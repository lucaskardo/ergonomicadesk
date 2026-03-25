#!/usr/bin/env python3
"""
Scrape product images from old ergonomicadesk.com using __NEXT_DATA__ SSR JSON.
Images are served from CloudFront CDN.
"""

import requests
import json
import os
import re
import time
from urllib.parse import quote

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(SCRIPT_DIR, "..", "..", "..")
OUTPUT_DIR = os.path.join(BACKEND_DIR, "scraped-images")

BASE_URL = "https://ergonomicadesk.com"
CDN_BASE = "https://d1tnzngtf1n4as.cloudfront.net/public"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://ergonomicadesk.com/",
    "Origin": "https://ergonomicadesk.com",
}

# All subcategory slugs to scrape
SUBCATEGORY_SLUGS = [
    "chairs",
    "stools",
    "desk_frames",
    "desktop_tops",
    "accessories",
    "standing_desks",
    "monitor_stands",
    "laptop_stands",
    "arm_stands",
    "cables",
    "chargers",
    "hubs",
    "keyboards",
    "mice",
    "Executive",
    "Gamer",
    "mats",
    "health",
    "decoration",
    "storage",
    "dividers",
    "pads",
    "drawers",
    "cpu_stands",
]

# Also scrape these category pages directly
CATEGORY_SLUGS = [
    "seating",
    "desks",
    "stands",
    "accesories",
    "chargers",
    "hubs_adapters",
    "keyboard_mouse",
    "monitors",
    "health",
    "decoration",
    "sound",
]

image_map = {}  # old_sku -> [filename, ...]


def get_next_data(path):
    url = f"{BASE_URL}{path}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        match = re.search(
            r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>',
            resp.text,
            re.DOTALL,
        )
        if match:
            return json.loads(match.group(1))
    except Exception as e:
        print(f"  Fetch failed {url}: {e}")
    return None


def cdn_url(image_path):
    """Build CDN URL from relative image path."""
    parts = image_path.split("/")
    encoded = "/".join(quote(p, safe="") for p in parts)
    return f"{CDN_BASE}/{encoded}"


def download_image(url, filepath):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15, stream=True)
        resp.raise_for_status()
        with open(filepath, "wb") as f:
            for chunk in resp.iter_content(8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"    Failed: {url} → {e}")
        return False


def process_product(product, output_dir):
    """Download product images and record mapping."""
    sku = product.get("sku", "").strip()
    if not sku:
        return

    main_image = product.get("mainImage", "") or ""
    images = product.get("images", []) or []

    # Deduplicate, main image first
    all_images = []
    if main_image and main_image not in all_images:
        all_images.append(main_image)
    for img in images:
        if img and img not in all_images:
            all_images.append(img)

    if not all_images:
        return

    saved_files = []
    for idx, img_path in enumerate(all_images[:6]):
        url = cdn_url(img_path)
        ext = os.path.splitext(img_path)[-1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
            ext = ".jpg"

        # Use SKU as filename
        safe_sku = re.sub(r"[^a-zA-Z0-9\-_]", "", sku.lower())
        fname = f"{safe_sku}{ext}" if idx == 0 else f"{safe_sku}_{idx+1}{ext}"
        # Avoid overwriting if already saved from another color variant
        filepath = os.path.join(output_dir, fname)

        if os.path.exists(filepath):
            saved_files.append(fname)
            continue

        if download_image(url, filepath):
            saved_files.append(fname)
            print(f"    ✓ {fname}")

    if saved_files:
        image_map[sku] = saved_files


def extract_products(data):
    """Extract product list from __NEXT_DATA__."""
    if not data:
        return []
    props = data.get("props", {}).get("pageProps", {})
    products = props.get("products", [])
    if isinstance(products, list):
        return products
    if isinstance(products, dict):
        return products.get("items", [])
    return []


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Output: {OUTPUT_DIR}\n")
    seen_skus = set()

    # Scrape subcategories
    for slug in SUBCATEGORY_SLUGS:
        data = get_next_data(f"/subcategories/{slug}")
        products = extract_products(data)
        if not products:
            continue
        print(f"Subcategory [{slug}]: {len(products)} products")
        for p in products:
            sku = p.get("sku", "").strip()
            if not sku or sku in seen_skus:
                continue
            seen_skus.add(sku)
            print(f"  {sku}")
            process_product(p, OUTPUT_DIR)
        time.sleep(0.4)

    # Scrape categories (may have products directly)
    for slug in CATEGORY_SLUGS:
        data = get_next_data(f"/categories/{slug}")
        products = extract_products(data)
        if not products:
            continue
        print(f"\nCategory [{slug}]: {len(products)} products")
        for p in products:
            sku = p.get("sku", "").strip()
            if not sku or sku in seen_skus:
                continue
            seen_skus.add(sku)
            print(f"  {sku}")
            process_product(p, OUTPUT_DIR)
        time.sleep(0.4)

    # Save image map
    map_path = os.path.join(OUTPUT_DIR, "image-map.json")
    with open(map_path, "w") as f:
        json.dump(image_map, f, indent=2)

    print(f"\n=== DONE ===")
    print(f"Scraped: {len(image_map)} products with images")
    print(f"Map: {map_path}")


if __name__ == "__main__":
    main()
