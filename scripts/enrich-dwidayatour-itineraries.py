#!/usr/bin/env python3
"""
For each package in dwidayatour-scraped.json that has pkgShortCode, call the same
Dwidayatour B2C APIs used by their Angular app (GetPackageSearchRQ → GetPackageResult
→ GetPackageDetails) and copy Rencana Perjalanan / Travel Plan rows into itinerary[].

Requires: Python 3.9+, stdlib only. Network access to www.dwidayatour.co.id.

Usage:
  python3 scripts/enrich-dwidayatour-itineraries.py
  python3 scripts/enrich-dwidayatour-itineraries.py path/to/dwidayatour-scraped.json
"""
from __future__ import annotations

import json
import re
import ssl
import sys
import time
import urllib.request
from html import unescape
from pathlib import Path

BASE = "https://www.dwidayatour.co.id"
DEFAULT_JSON = (
    Path(__file__).resolve().parent.parent / "src/lib/cms/dummy/dwidayatour-scraped.json"
)


def html_to_text(html: str | None) -> str:
    if not html:
        return ""
    t = (
        html.replace("<br>", "\n")
        .replace("<br/>", "\n")
        .replace("<br />", "\n")
    )
    t = re.sub(r"<[^>]+>", " ", t)
    return unescape(re.sub(r"[ \t]+", " ", t)).replace(" \n ", "\n").strip()


def post_json(url: str, payload: dict) -> dict:
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Mozilla/5.0 (compatible; KreataleItineraryEnrich/1.0)",
        },
        method="POST",
    )
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=120) as r:
        return json.loads(r.read().decode())


def get_package_search_rq() -> dict:
    return post_json(f"{BASE}/Home/Package/GetPackageSearchRQ", {"searchRequest": {}})


def search_by_short_code(short: str) -> dict | None:
    rq = get_package_search_rq()
    rq["Request"]["Master"]["PackageShortCode"] = short
    rq["Request"]["Master"]["LangCode"] = "en"
    rq["Request"]["RequestDetails"]["Search"] = {
        "Rooms": {
            "Room": [{"Adult": "1", "Child": "0", "ChildAge": [], "Infant": "0"}],
        },
    }
    rq["Request"]["RequestDetails"]["Filter"]["Type"] = "Search"
    # Angular passes angular.toJson(rq) as the searchRequest string value.
    raw = post_json(
        f"{BASE}/Home/Package/GetPackageResult",
        {"searchRequest": json.dumps(rq)},
    )
    rd = raw.get("Response", {}).get("ResponseDetails") or {}
    err = rd.get("Error") or {}
    code = str(err.get("Code", "200"))
    if code not in ("200", ""):
        return None
    search = rd.get("Search") or {}
    pkgs = search.get("Packages") or {}
    plist = pkgs.get("Package")
    if plist is None:
        return None
    if isinstance(plist, dict):
        plist = [plist]
    return plist[0] if plist else None


def get_package_details(summary: dict) -> dict | None:
    rq = get_package_search_rq()
    m = rq["Request"]["Master"]
    m["HolidayType"] = summary.get("HolidayTypeName") or "Group Series Package"
    region_id = summary.get("RegionId")
    m["RegionCode"] = str(region_id) if region_id is not None else ""
    m["RegionName"] = summary.get("RegionName") or ""
    m["LangCode"] = "en"
    m["PackageShortCode"] = summary.get("PackageShortCode") or ""
    m["DepartureReference"] = summary.get("DepartureReference") or "null"
    rq["Request"]["RequestDetails"]["Filter"] = {
        "Type": "Details",
        "PackageId": str(summary["PackageId"]),
        "Provider": str(summary["Provider"]),
        "Token": "null",
        "Deals": 0,
        "Recomendation": 0,
        "BookingType": 0,
        "SpecialRequest": None,
        "NoOfResults": None,
        "IsPreferred": None,
        "IsShowInMenu": None,
        "MealIndex": 0,
    }
    rq["Request"]["RequestDetails"]["Search"] = {
        "Rooms": {"Room": [{"Adult": "1", "Child": "0", "ChildAge": []}]},
    }
    raw = post_json(
        f"{BASE}/Home/Package/GetPackageDetails",
        {"detailsRequest": json.dumps({"Request": rq["Request"]})},
    )
    err = raw.get("Response", {}).get("ResponseDetails", {}).get("Error") or {}
    if str(err.get("Code", "200")) not in ("200", ""):
        return None
    pd = raw.get("Response", {}).get("ResponseDetails", {}).get("PackageDetails")
    if not pd:
        return None
    plist = pd.get("Packages", {}).get("Package")
    if isinstance(plist, dict):
        plist = [plist]
    return plist[0] if plist else None


def itinerary_from_details(detail_pkg: dict) -> list[dict]:
    info = (
        detail_pkg.get("DetailInfo", {})
        .get("ItineraryInfo", {})
        .get("Itinerary")
    )
    if not info:
        return []
    rows = info if isinstance(info, list) else [info]
    out: list[dict] = []
    for row in rows:
        seq = row.get("SequenceNo")
        try:
            day_n = int(seq)
        except (TypeError, ValueError):
            continue
        title = (row.get("BriefDesc") or "").strip()
        desc = html_to_text(row.get("LongDesc") or "")
        if not title and not desc:
            continue
        out.append({"day": day_n, "title": title or f"Day {day_n}", "description": desc})
    out.sort(key=lambda x: x["day"])
    return out


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_JSON
    data = json.loads(path.read_text(encoding="utf-8"))
    packages: list[dict] = data.get("packages") or []
    cache: dict[str, list[dict]] = {}
    errors: list[str] = []

    for i, pkg in enumerate(packages):
        short = pkg.get("pkgShortCode")
        if not short:
            errors.append(f"{pkg.get('slug')}: missing pkgShortCode (re-run scrape-dwidayatour.py)")
            continue
        if short not in cache:
            time.sleep(0.35)
            summary = search_by_short_code(short)
            if not summary:
                cache[short] = []
                errors.append(f"{short}: GetPackageResult returned no package")
                continue
            time.sleep(0.35)
            detail = get_package_details(summary)
            if not detail:
                cache[short] = []
                errors.append(f"{short}: GetPackageDetails failed")
                continue
            cache[short] = itinerary_from_details(detail)
        pkg["itinerary"] = cache[short]
        if not cache[short]:
            errors.append(f"{pkg.get('slug')} ({short}): empty itinerary")

    meta = data.setdefault("_meta", {})
    note = (
        "Homepage scrape + pkgShortCode; itineraries from Home/Package/GetPackageDetails "
        "(Rencana Perjalanan). Re-run scrape-dwidayatour.py then this script to refresh."
    )
    meta["itineraryNote"] = note

    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Updated {path} ({len(packages)} packages).")
    if errors:
        print("Warnings:")
        for e in errors[:25]:
            print(" ", e)
        if len(errors) > 25:
            print(f"  ... and {len(errors) - 25} more")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
