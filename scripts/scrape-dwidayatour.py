#!/usr/bin/env python3
"""
Fetch https://www.dwidayatour.co.id/?lang=en and write
src/lib/cms/dummy/dwidayatour-scraped.json (packages, experiences, blog cards).

Each package row includes pkgShortCode from homepage links. After scraping, run
scripts/enrich-dwidayatour-itineraries.py to attach day-by-day plans from the
live Package Details API (same source as “Rencana Perjalanan” on the site).

Requires: Python 3.9+, stdlib only.
"""
from __future__ import annotations

import json
import re
import ssl
import sys
import urllib.request
from datetime import datetime, timezone
from html import unescape
from pathlib import Path

URL = "https://www.dwidayatour.co.id/?lang=en"
OUT = Path(__file__).resolve().parent.parent / "src/lib/cms/dummy/dwidayatour-scraped.json"


def slugify(s: str) -> str:
    s = s.lower()
    out = []
    for c in s:
        if c.isalnum():
            out.append(c)
        elif c in " +/&":
            out.append("-")
    r = "".join(out).strip("-")
    while "--" in r:
        r = r.replace("--", "-")
    return r[:90]


def fetch(url: str) -> str:
    ctx = ssl.create_default_context()
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (compatible; KreataleScraper/1.1)"},
    )
    with urllib.request.urlopen(req, context=ctx, timeout=45) as r:
        return r.read().decode("utf-8", errors="replace")


def main() -> int:
    text = fetch(URL)

    nav = re.findall(
        r"onclick=\"setLinkURL\('([^']*)','([^']*)', '([^']*)', '([^']*)','(\d+)', '([^']*)', 'HTL'\)\">([^<]+)</a>",
        text,
    )
    regions = {f"pills_PKG{a[4]}": a[6].strip() for a in nav}

    panes = re.findall(
        r'<div class="tab-pane[^"]*" id="(pills_PKG\d+)"[^>]*>(.*?)(?=<div class="tab-pane|\Z)',
        text,
        re.S,
    )

    packages: list[dict] = []
    for pid, block in panes:
        region = regions.get(pid, pid)
        chunks = re.split(r"<h3>", block)
        for ch in chunks[1:]:
            tm = re.search(r'<span title="([^"]+)"', ch)
            if not tm:
                continue
            title = unescape(tm.group(1)).strip()
            if not re.search(r"\d+D\d+N", title, re.I):
                continue
            pm = re.search(r"\{\{\s*(\d+)\s*\|\s*number\s*:\s*0", ch)
            if not pm:
                continue
            raw = pm.group(1)
            price_fmt = f"{int(raw):,}".replace(",", ".")
            dm = re.search(r'class="content-text"[^>]*title="([^"]+)"', ch)
            departures = unescape(dm.group(1)).strip() if dm else ""
            dur_m = re.match(r"(\d+D\d+N)\s*", title, re.I)
            duration = dur_m.group(1) if dur_m else ""
            im = re.search(r'data-src="(https://cdn\.dwidayatour\.co\.id[^"]+)"', ch)
            scm = re.search(r"PKGShortCode=([A-Z0-9]+)", ch)
            pkg_short = scm.group(1) if scm else None
            packages.append(
                {
                    "title": title,
                    "slug": slugify(title),
                    "location": region,
                    "duration": duration,
                    "feature": departures,
                    "price": price_fmt,
                    "price_raw": raw,
                    "image": im.group(1) if im else None,
                    "pkgShortCode": pkg_short,
                }
            )

    experiences: list[dict] = []
    oth_tabs = [
        ("pills_OTH13", "Cruise"),
        ("pills_OTH14", "Umroh"),
        ("pills_OTH16", "JR Pass"),
        ("pills_OTH42", "Themepark"),
    ]
    for pid, cat in oth_tabs:
        m = re.search(
            rf'id="{pid}"[^>]*>(.*?)(?=id="pills_OTH|\Z)',
            text,
            re.S,
        )
        sub = m.group(1) if m else ""
        for part in re.split(r'<div class="item">', sub)[1:]:
            tm = re.search(r'<span title="([^"]+)"', part)
            if not tm:
                continue
            name = unescape(tm.group(1)).strip()
            sm = re.search(r'class="content-text"[^>]*title="([^"]*)"', part)
            subti = unescape(sm.group(1)).strip() if sm else ""
            pm = re.search(r"\{\{\s*(\d+)\s*\|\s*number\s*:\s*0", part)
            if not pm:
                continue
            raw = pm.group(1)
            price_fmt = f"{int(raw):,}".replace(",", ".")
            im = re.search(r'data-src="(https://cdn\.dwidayatour\.co\.id[^"]+)"', part)
            desc = subti or cat
            desc = f"{desc} · From Rp {price_fmt}"
            display = f"{name} ({subti})" if subti else name
            experiences.append(
                {
                    "name": display,
                    "slug": slugify(f"{name}-{subti}-{cat}"),
                    "category": cat,
                    "description": desc,
                    "image": im.group(1) if im else None,
                }
            )

    tips: list[dict] = []
    for m in re.finditer(r'href="(/art/([a-z0-9-]+))"', text):
        slug = m.group(2)
        seg = text[m.start() : m.start() + 4000]
        if "pplr_tourArticle" not in seg:
            continue
        tm = re.search(r'<span title="([^"]+)"', seg)
        if not tm:
            continue
        title = unescape(tm.group(1)).strip()
        em = re.search(r'class="content-text[^"]*"[^>]*title="([^"]+)"', seg)
        excerpt = unescape(em.group(1)).strip() if em else ""
        im = re.search(r'data-src="(https://cdn\.dwidayatour\.co\.id[^"]+)"', seg)
        if any(t["slug"] == slug for t in tips):
            continue
        tips.append(
            {
                "title": title,
                "slug": slug,
                "excerpt": excerpt[:800],
                "body": excerpt,
                "image": im.group(1) if im else None,
            }
        )
        if len(tips) >= 12:
            break

    payload = {
        "_meta": {
            "source": URL,
            "scrapedAt": datetime.now(timezone.utc).isoformat(),
            "note": "Homepage HTML: Angular {{ price | number }} literals, lazy-load image URLs, PKGShortCode from PackageResult links.",
        },
        "packages": packages,
        "experiences": experiences,
        "travelTips": tips,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} ({len(packages)} packages, {len(experiences)} products, {len(tips)} articles)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
