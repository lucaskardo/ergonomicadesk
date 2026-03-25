#!/usr/bin/env python3
"""
Upload product images to Medusa from:
1. Extracted PDF images (extracted-images/)
2. Locally named images (Downloads folder)
3. Scraped images (scraped-images/)

Strategy:
- Use full-page PDF renders for office/desk/storage/table products (unambiguous per page)
- Use embedded PDF images for chairs (individual shots in SILLAS PDF)
- Use locally named files for frames
- Match old-site SKU patterns to Medusa handles for scraped images
"""

import os
import re
import json
import requests
import mimetypes

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(SCRIPT_DIR, "..", "..", "..")
EXTRACTED_DIR = os.path.join(BACKEND_DIR, "extracted-images")
SCRAPED_DIR = os.path.join(BACKEND_DIR, "backend", "scraped-images")
SCRAPED_IMAGE_MAP = os.path.join(SCRAPED_DIR, "image-map.json")

MEDUSA_URL = "http://localhost:9000"
ADMIN_EMAIL = "admin@ergonomicadesk.com"
ADMIN_PASSWORD = "AdminErgo2026!"

# Additional local image directories to search
LOCAL_SEARCH_DIRS = [
    os.path.expanduser("~/Downloads"),
    os.path.expanduser("~/Downloads/ergo-barcodes"),
]

# ============================================================
# MAPPING: PDF page → Medusa handles
# For each entry: (pdf_prefix, page_num, image_type, [handles])
#   image_type: "full" = use page render, "embedded_N" = use embedded img N
# ============================================================

PDF_PAGE_HANDLE_MAP = [
    # ── FLOW PDF ──────────────────────────────────────────────
    # page 2: desk-exec-blok + desk-exec-flow lifestyle shots
    ("FLOW", 2, "full", [
        "desk-exec-blok-white-oakli-220",
        "desk-exec-flow-taupe-oakli-180",
    ]),
    # page 3: storage-exec-flow lifestyle + product shot
    ("FLOW", 3, "full", ["storage-exec-flow-white-oakli-240"]),
    # page 4: works-4p-flow, works-4pext-flow
    ("FLOW", 4, "full", [
        "works-4p-flow-taupe-white-280",
        "works-4pext-flow-taupe-white-140",
    ]),
    # page 5: works-2pcab-flow, works-2pcabext-flow
    ("FLOW", 5, "full", [
        "works-2pcab-flow-taupe-oakli-140",
        "works-2pcabext-flow-taupe-oakli-140",
    ]),
    # page 6: works-2p-flow
    ("FLOW", 6, "full", ["works-2p-flow-taupe-white-140"]),
    # page 7: Desk-1pcab-flow, Desk-1pcab-blok
    ("FLOW", 7, "full", [
        "desk-1pcab-blok-white-oakli-140",
    ]),
    # page 8: table-meet-flow
    ("FLOW", 8, "full", ["table-meet-flow-taupe-oakli-200"]),
    # page 9: table-meet-blok (multiple sizes all use same render)
    ("FLOW", 9, "full", [
        "table-meet-blok-white-oakli-200",
        "table-meet-blok-white-oakli-260",
        "table-meet-blok-white-oakli-280",
        "table-meet-blok-white-oakli-320",
    ]),
    # page 10: storage-tallglass-flow
    ("FLOW", 10, "full", ["storage-tallglass-flow-white-oakli-80x200"]),
    # page 11: storage-lowcab-flow, storage-medcab-flow
    ("FLOW", 11, "full", [
        "storage-lowcab-flow-white-oakli-80x80",
        "storage-medcab-flow-white-oakli-80x115",
    ]),
    # page 12: storage-teacab-flow
    ("FLOW", 12, "full", ["storage-teacab-flow-white-oakli-120x80"]),
    # page 13: table-bar-flow
    ("FLOW", 13, "full", ["table-bar-flow-taupe-oakli-180"]),
    # page 14: table-round-flow
    ("FLOW", 14, "full", ["table-round-flow-white-oakli-70"]),

    # ── CORE PDF ──────────────────────────────────────────────
    # page 2: desk-exec-core (both colors use same catalog render)
    ("CORE", 2, "full", [
        "desk-exec-core-black-coral-180x60",
        "desk-exec-core-white-white-180x60",
    ]),
    # page 3: desk-1pcab-core, desk-1pcabext-core
    ("CORE", 3, "full", [
        "desk-1pcab-core-black-coral-140x60",
        "desk-1pcab-core-white-white-140x60",
        "desk-1pcabext-core-black-coral-140x60",
        "desk-1pcabext-core-white-white-140x60",
    ]),
    # page 4: desk-1p-core
    ("CORE", 4, "full", [
        "desk-1p-core-black-coral-140x70",
        "desk-1p-core-white-white-140x70",
    ]),
    # page 5: desk-1pcab-core extension L (cabinetext)
    ("CORE", 5, "full", [
        "desk-cabinetext-core-black-coral-100x48",
        "desk-cabinetext-core-white-white-100x48",
    ]),
    # page 6: works-2pcab-core, works-2pcabext-core
    ("CORE", 6, "full", [
        "works-2pcab-core-black-coral-120x120",
        "works-2pcab-core-white-white-120x120",
        "works-2pcabext-core-black-coral-120x120",
        "works-2pcabext-core-white-white-120x120",
    ]),
    # page 7: works-4p-core
    ("CORE", 7, "full", [
        "works-4p-core-black-coral-240x120",
        "works-4p-core-white-white-240x120",
    ]),
    # page 8: storage-exec-core
    ("CORE", 8, "full", [
        "storage-exec-core-black-coral-200x50",
        "storage-exec-core-white-white-200x50",
    ]),
    # page 9: storage-medcab-core, storage-sidecab-core
    ("CORE", 9, "full", [
        "storage-medcab-core-black-coral-100x85",
        "storage-medcab-core-white-white-100x85",
        "storage-sidecab-core-black-black-140x58",
        "storage-sidecab-core-white-white-140x58",
    ]),
    # page 10: storage-sidecab-core (more sizes), storage-tallcab-core
    ("CORE", 10, "full", [
        "storage-sidecab-core-black-black-80x65",
        "storage-sidecab-core-white-white-80x65",
        "storage-tallcab-core-black-coral-100x200",
        "storage-tallcab-core-white-white-100x200",
    ]),
    # page 11: table-meet-core
    ("CORE", 11, "full", ["table-meet-core-black-coral-240x120"]),

    # ── ARMA PDF (frames & tops) ──────────────────────────────
    # The Arma PDF has frame comparison images and color swatches
    # Use the full page render for the overall frame comparison
    ("ARMA", 1, "full", [
        "sobre-melamina",
        "sobre-madera-natural",
    ]),
]

# Chairs: SILLAS embedded images → chair handles (sequential order in PDF)
# 28 embedded images from SILLAS; skip very wide/landscape ones (banners)
# Order in sillas PDF (based on catalog layout, top-to-bottom, left-to-right):
SILLAS_IMG_TO_HANDLE = {
    # img_num: handle (use first variant handle as representative)
    "03": "chair-xtcv2-mesh-bl-bl-bl",
    "05": "chair-xtcv2-leather-bl-bl-bl",
    "06": "chair-hdforce-foam-bl-bl",
    "07": "chair-asci-mesh-bl-bl",
    "08": "chair-hifix-mesh-wh-gr",
    "11": "chair-zentu-mesh-gr-gr",
    "12": "chair-tesseract-mesh-bl-bl",
    "13": "chair-vantix-mesh-wh-gr",
    "14": "chair-avid-foam-bl-bl",
    "15": "chair-tau-mesh-bl-bl",
    "16": "chair-ensis-foam-bl-bl",
    "17": "chair-yen-foam-bl-gr",
    "18": "chair-nexa-foam-bl-bl",
    "19": "chair-atom-mesh-wh-gr",
    "20": "chair-sync-foam-bl-bl",
    "21": "chair-torq-mesh-bl-bl",
    "22": "chair-movix-foam-bl-bl",
    "23": "chair-pace-bl-bl",
    "24": "chair-movix-stool-foam-bl-bl",
    "26": "chair-arc-foam-black-bl",
    "28": "chair-looper-foam-bl-blu",
    "31": "chair-vigor-stool-bl-bl",
    "32": "chair-medusa-foam-gr-gr",
}

# ARMA embedded images → frame handles (by image index)
ARMA_IMG_TO_HANDLE = {
    "01": ["frame-single-bl", "frame-single-wh"],   # single motor frame
    "03": ["frame-single-lt-bl", "frame-single-lt-wh"],  # single motor LT
    "04": ["frame-double-bl", "frame-double-wh"],    # double motor
    "05": ["frame-3stage-bl", "frame-3stage-wh"],    # 3-stage
    "06": ["frame-heavy-bl", "frame-heavy-wh"],      # heavy duty
    "16": ["frame-l-bl", "frame-l-wh"],              # L-frame
    "19": ["frame-l-lt-bl", "frame-l-lt-wh"],        # L-frame LT
    "20": ["frame-4column-wh"],                       # 4-column
    "21": ["top-mela-white-custom"],                  # white melamine swatch
    "22": ["top-mela-general-custom"],                # general melamine
    "23": ["top-mela-pecan-custom"],                  # pecan melamine
    "37": ["sobre-melamina"],
    "38": ["sobre-madera-natural"],
}

# ============================================================
# AUTH + API helpers
# ============================================================

def get_admin_token():
    resp = requests.post(
        f"{MEDUSA_URL}/auth/user/emailpass",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()["token"]


def list_products(token):
    """Return dict: handle → product_id"""
    all_products = {}
    offset = 0
    limit = 100
    while True:
        resp = requests.get(
            f"{MEDUSA_URL}/admin/products",
            params={"limit": limit, "offset": offset, "fields": "id,handle,images"},
            headers={"Authorization": f"Bearer {token}"},
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        products = data.get("products", [])
        for p in products:
            all_products[p["handle"]] = {
                "id": p["id"],
                "images": p.get("images", []),
            }
        if len(products) < limit:
            break
        offset += limit
    return all_products


def upload_file(token, filepath):
    """Upload a file to Medusa. Returns the URL."""
    mime, _ = mimetypes.guess_type(filepath)
    if not mime:
        mime = "image/jpeg"
    with open(filepath, "rb") as f:
        resp = requests.post(
            f"{MEDUSA_URL}/admin/uploads",
            headers={"Authorization": f"Bearer {token}"},
            files={"files": (os.path.basename(filepath), f, mime)},
            timeout=30,
        )
    resp.raise_for_status()
    files = resp.json().get("files", [])
    if files:
        return files[0]["url"]
    return None


def set_product_images(token, product_id, image_urls):
    """Set product images."""
    resp = requests.post(
        f"{MEDUSA_URL}/admin/products/{product_id}",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json={"images": [{"url": u} for u in image_urls]},
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()


# ============================================================
# IMAGE RESOLUTION
# ============================================================

def get_pdf_full_render(pdf_prefix, page_num):
    """Get path to full page render."""
    fname = f"{pdf_prefix}_page{page_num:02d}_full.png"
    path = os.path.join(EXTRACTED_DIR, fname)
    return path if os.path.exists(path) else None


def get_pdf_embedded(pdf_prefix, page_num, img_num_str):
    """Get path to embedded image. img_num_str is like '03'."""
    # Try both .jpeg and .jpg
    for ext in ["jpeg", "jpg", "png"]:
        fname = f"{pdf_prefix}_page{page_num:02d}_img{img_num_str}.{ext}"
        path = os.path.join(EXTRACTED_DIR, fname)
        if os.path.exists(path):
            return path
    return None


def find_local_image(handle):
    """Search Downloads for an image with the handle in its name."""
    # Exact SKU-named file first
    for d in LOCAL_SEARCH_DIRS:
        if not os.path.isdir(d):
            continue
        for fname in os.listdir(d):
            fbase = os.path.splitext(fname)[0].lower()
            if fbase == handle.lower() or fbase == handle.lower() + "-1":
                path = os.path.join(d, fname)
                if os.path.isfile(path) and fname.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                    return path
    # Partial match
    for d in LOCAL_SEARCH_DIRS:
        if not os.path.isdir(d):
            continue
        for fname in os.listdir(d):
            fname_lower = fname.lower()
            if handle.lower() in fname_lower and fname_lower.endswith((".jpg", ".jpeg", ".png", ".webp")):
                return os.path.join(d, fname)
    return None


def find_scraped_image(handle):
    """Look in scraped-images/ for an image matching this handle."""
    if not os.path.exists(SCRAPED_IMAGE_MAP):
        return None
    with open(SCRAPED_IMAGE_MAP) as f:
        image_map = json.load(f)

    # Direct match
    if handle in image_map and image_map[handle]:
        fname = image_map[handle][0]
        path = os.path.join(SCRAPED_DIR, fname)
        if os.path.exists(path):
            return path

    # Try matching by stripping color suffix
    # e.g. "chair-arc-foam-black-bl" → old site might have "chair-arc-foam-black-bl"
    for old_sku, files in image_map.items():
        if files and handle.lower().startswith(old_sku.lower()[:15]):
            path = os.path.join(SCRAPED_DIR, files[0])
            if os.path.exists(path):
                return path

    return None


def resolve_image_for_handle(handle):
    """Find the best image for a given product handle."""
    # 1. Local Downloads (exact SKU-named)
    path = find_local_image(handle)
    if path:
        return path, "local"

    # 2. Scraped from old site
    path = find_scraped_image(handle)
    if path:
        return path, "scraped"

    return None, None


# ============================================================
# MAIN
# ============================================================

def main():
    print("=== Medusa Image Uploader ===\n")
    print("Authenticating...", end=" ")
    token = get_admin_token()
    print("OK")

    print("Loading products...", end=" ")
    products = list_products(token)
    print(f"{len(products)} products")

    results = {
        "uploaded": [],
        "skipped_already_has_images": [],
        "no_image_found": [],
        "errors": [],
    }

    # Build the full assignment: handle → list of image paths
    handle_to_images = {}

    # ── PDF PAGE RENDERS ──────────────────────────────────────
    for (pdf_prefix, page_num, img_type, handles) in PDF_PAGE_HANDLE_MAP:
        if img_type == "full":
            path = get_pdf_full_render(pdf_prefix, page_num)
            if path:
                for h in handles:
                    if h not in handle_to_images:
                        handle_to_images[h] = []
                    handle_to_images[h].append(path)

    # ── SILLAS EMBEDDED ──────────────────────────────────────
    for img_num_str, handle in SILLAS_IMG_TO_HANDLE.items():
        path = get_pdf_embedded("SILLAS", 1, img_num_str)
        if path:
            if handle not in handle_to_images:
                handle_to_images[handle] = []
            handle_to_images[handle].append(path)

    # ── ARMA EMBEDDED ────────────────────────────────────────
    for img_num_str, handles in ARMA_IMG_TO_HANDLE.items():
        path = get_pdf_embedded("ARMA", 1, img_num_str)
        if path:
            for h in (handles if isinstance(handles, list) else [handles]):
                if h not in handle_to_images:
                    handle_to_images[h] = []
                handle_to_images[h].append(path)

    # ── LOCAL + SCRAPED ──────────────────────────────────────
    for handle in products:
        if handle not in handle_to_images or not handle_to_images[handle]:
            path, source = resolve_image_for_handle(handle)
            if path:
                handle_to_images[handle] = [path]

    # ── UPLOAD ───────────────────────────────────────────────
    print(f"\nImage assignments: {len(handle_to_images)} products have images\n")

    for handle, product_data in sorted(products.items()):
        product_id = product_data["id"]
        existing_images = product_data.get("images", [])

        if existing_images:
            results["skipped_already_has_images"].append(handle)
            continue

        image_paths = handle_to_images.get(handle)
        if not image_paths:
            results["no_image_found"].append(handle)
            continue

        # Upload images (deduplicate paths)
        seen_paths = []
        for p in image_paths:
            if p not in seen_paths:
                seen_paths.append(p)

        uploaded_urls = []
        try:
            for path in seen_paths[:3]:  # max 3 images per product
                url = upload_file(token, path)
                if url:
                    uploaded_urls.append(url)
                    print(f"  ✓ {handle} ← {os.path.basename(path)}")

            if uploaded_urls:
                set_product_images(token, product_id, uploaded_urls)
                results["uploaded"].append({"handle": handle, "images": len(uploaded_urls)})
            else:
                results["errors"].append(f"{handle}: upload returned no URL")
        except Exception as e:
            print(f"  ✗ {handle}: {e}")
            results["errors"].append(f"{handle}: {e}")

    # ── REPORT ───────────────────────────────────────────────
    print(f"\n{'='*50}")
    print(f"✅ Uploaded:              {len(results['uploaded'])} products")
    print(f"⏭  Already had images:   {len(results['skipped_already_has_images'])} products")
    print(f"❌ No image found:        {len(results['no_image_found'])} products")
    print(f"⚠️  Errors:               {len(results['errors'])}")

    if results["no_image_found"]:
        print(f"\nProducts WITHOUT images ({len(results['no_image_found'])}):")
        for h in sorted(results["no_image_found"]):
            print(f"  - {h}")

    if results["errors"]:
        print(f"\nErrors:")
        for e in results["errors"]:
            print(f"  - {e}")


if __name__ == "__main__":
    main()
