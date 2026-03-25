#!/usr/bin/env python3
"""
Extract product images from Ergonomica catalog PDFs.
Saves embedded images + full-page renders to extracted-images/
"""

import fitz  # pymupdf
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(SCRIPT_DIR, "..", "..", "..")
OUTPUT_DIR = os.path.join(BACKEND_DIR, "extracted-images")

PDFs = [
    (
        "/Users/lucaskay/Downloads/CORE COLLECTION - ERGONOMICA OFICE 2026.pdf",
        "CORE",
    ),
    (
        "/Users/lucaskay/Downloads/FLOW COLLECTION - Ergonomica office 2026.pdf",
        "FLOW",
    ),
    (
        "/Users/lucaskay/Downloads/Sillas ergonómicas.pdf",
        "SILLAS",
    ),
    (
        "/Users/lucaskay/Downloads/Arma tu escritorio v5.pdf",
        "ARMA",
    ),
]

MIN_DIM = 100   # px — skip tiny icons
MAX_DIM = 2500  # px — skip full-page backgrounds
PAGE_RENDER_DPI = 200


def extract_embedded_images(doc, pdf_name, output_dir):
    """Extract embedded images from all pages."""
    count = 0
    for page_num, page in enumerate(doc, start=1):
        images = page.get_images(full=True)
        for img_idx, img in enumerate(images, start=1):
            xref = img[0]
            try:
                base = doc.extract_image(xref)
                data = base["image"]
                w, h = base["width"], base["height"]

                if w < MIN_DIM or h < MIN_DIM:
                    continue
                if w > MAX_DIM and h > MAX_DIM:
                    continue

                ext = base["ext"]
                fname = f"{pdf_name}_page{page_num:02d}_img{img_idx:02d}.{ext}"
                path = os.path.join(output_dir, fname)
                with open(path, "wb") as f:
                    f.write(data)
                print(f"  Saved embedded: {fname} ({w}x{h})")
                count += 1
            except Exception as e:
                print(f"  Warning: could not extract xref {xref}: {e}")
    return count


def render_pages(doc, pdf_name, output_dir):
    """Render each page as a full PNG."""
    count = 0
    mat = fitz.Matrix(PAGE_RENDER_DPI / 72, PAGE_RENDER_DPI / 72)
    for page_num, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=mat)
        fname = f"{pdf_name}_page{page_num:02d}_full.png"
        path = os.path.join(output_dir, fname)
        pix.save(path)
        print(f"  Rendered page: {fname} ({pix.width}x{pix.height})")
        count += 1
    return count


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Output directory: {OUTPUT_DIR}\n")

    total_embedded = 0
    total_rendered = 0

    for pdf_path, pdf_name in PDFs:
        if not os.path.exists(pdf_path):
            print(f"[SKIP] PDF not found: {pdf_path}")
            continue

        print(f"\n=== Processing {pdf_name}: {os.path.basename(pdf_path)} ===")
        doc = fitz.open(pdf_path)
        print(f"  Pages: {len(doc)}")

        embedded = extract_embedded_images(doc, pdf_name, OUTPUT_DIR)
        rendered = render_pages(doc, pdf_name, OUTPUT_DIR)
        doc.close()

        print(f"  → {embedded} embedded images, {rendered} page renders")
        total_embedded += embedded
        total_rendered += rendered

    print(f"\n=== DONE ===")
    print(f"Total embedded images: {total_embedded}")
    print(f"Total page renders: {total_rendered}")
    print(f"Output: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
