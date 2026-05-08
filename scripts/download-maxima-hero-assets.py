#!/usr/bin/env python3
"""
Download Maxima Therapy hero SVGs (SSR) and Lottie JSON referenced in their layout bundle.

Output:
  public/maxima/hero-svgs/{slug}.svg
  public/maxima/lottie/**  (mirrors /assets/lottie/...)

Re-run when their assets change.

Notes:
  - As of 2026-04, each program route returns the *same* SSR wedge SVG (shell); full
    program-specific vector art ships in their client JS. We still save one copy per slug
    for diffing / future extraction from bundles.
  - Demo use only; assets are © Maxima Therapy — obtain permission before any public reuse.
"""

from __future__ import annotations

import json
import os
import re
import ssl
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_SVG = ROOT / "public" / "maxima" / "hero-svgs"
OUT_LOTTIE = ROOT / "public" / "maxima" / "lottie"

BASE = "https://maximatherapy.com"
UA = "Mozilla/5.0 (compatible; KreataleDemoAssetScript/1.0; +https://kreatale.com)"

ROUTES = [
    ("0-to-3", "/programs/0-to-3"),
    ("3-to-18", "/programs/3-to-18"),
    ("18-to-65", "/programs/18-to-65"),
    ("65-and-plus", "/programs/65-and-plus"),
]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=60, context=ctx) as r:
        return r.read().decode("utf-8", "replace")


def extract_hero_svg(html: str) -> str | None:
    ss = html.find('<section class="_carousel')
    if ss == -1:
        return None
    se = html.find("</section>", ss)
    if se == -1:
        return None
    sub = html[ss:se]
    token = '<svg class="w-full h-auto" width="2979"'
    rel = sub.find(token)
    if rel == -1:
        return None
    start = ss + rel
    depth = 0
    i = start
    while i < len(html):
        if html.startswith("<svg", i):
            depth += 1
            i += 1
            continue
        if html.startswith("</svg>", i):
            depth -= 1
            i += len("</svg>")
            if depth == 0:
                return html[start:i]
            continue
        i += 1
    return None


def lottie_paths_from_layout(layout_js: str) -> list[str]:
    return sorted(set(re.findall(r"/assets/lottie/[^\"']+\.json", layout_js)))


def main() -> None:
    OUT_SVG.mkdir(parents=True, exist_ok=True)
    OUT_LOTTIE.mkdir(parents=True, exist_ok=True)

    home = fetch(BASE + "/")
    m = re.search(r"/assets/(layout-[^\"]+\.js)", home)
    if not m:
        raise SystemExit("Could not find layout-*.js in homepage HTML")
    layout_name = m.group(1)
    layout_url = f"{BASE}/assets/{layout_name}"
    print("layout:", layout_url)
    layout_js = fetch(layout_url)
    lottie_urls = [BASE + p for p in lottie_paths_from_layout(layout_js)]
    print("lottie files:", len(lottie_urls))

    manifest: dict[str, object] = {"layout": layout_url, "svgs": {}, "lottie": []}

    for slug, path in ROUTES:
        html = fetch(BASE + path)
        svg = extract_hero_svg(html)
        if not svg:
            raise SystemExit(f"No hero SVG for {slug}")
        out = OUT_SVG / f"{slug}.svg"
        out.write_text(svg, encoding="utf-8")
        manifest["svgs"][slug] = str(out.relative_to(ROOT))
        print("wrote", out, "bytes", out.stat().st_size)

    for url in lottie_urls:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        ctx = ssl.create_default_context()
        with urllib.request.urlopen(req, timeout=60, context=ctx) as r:
            data = r.read()
        rel = url.removeprefix(BASE + "/assets/lottie/")
        dest = OUT_LOTTIE / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        manifest["lottie"].append(str(dest.relative_to(ROOT)))
        print("wrote", dest, "bytes", len(data))

    (OUT_SVG / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )
    print("manifest:", OUT_SVG / "manifest.json")


if __name__ == "__main__":
    main()
