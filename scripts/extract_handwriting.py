"""
extract_handwriting.py

Removes the paper background from scanned recipe images, leaving only
the handwritten ink as a transparent PNG.

Requirements:
    pip install Pillow numpy

Usage:
    python scripts/extract_handwriting.py

Options (edit the CONFIG section below):
    THRESHOLD  — pixels brighter than this (0–255) become transparent.
                 Start with 190. If paper remains, lower it. If ink disappears, raise it.
    INK_COLOR  — optional (R, G, B) to tint the ink a consistent color.
                 Set to None to keep the original scanned ink color.
                 e.g. (40, 22, 8) for warm dark brown.

Output goes to public/recipes-extracted/ — originals are untouched.
Once happy, swap the path in src/data/pages.json.
"""

import os
import glob
import numpy as np
from PIL import Image

# ── Configuration ──────────────────────────────────────────────────────────────
THRESHOLD = 220  # 0–255, adjust after reviewing output
INK_COLOR = None  # e.g. (40, 22, 8) for warm brown, or None to keep original
INPUT_DIR = "public/recipes"
OUTPUT_DIR = "public/recipes-extracted"
# ───────────────────────────────────────────────────────────────────────────────

os.makedirs(OUTPUT_DIR, exist_ok=True)

files = sorted(
    glob.glob(os.path.join(INPUT_DIR, "*.png"))
    + glob.glob(os.path.join(INPUT_DIR, "*.jpg"))
    + glob.glob(os.path.join(INPUT_DIR, "*.jpeg"))
    + glob.glob(os.path.join(INPUT_DIR, "*.webp")),
    key=lambda p: os.path.basename(p).lower(),
)

if not files:
    print(f"No images found in {INPUT_DIR}")
    raise SystemExit(1)

print(f"Processing {len(files)} images (threshold: {THRESHOLD})...\n")

for path in files:
    name = os.path.splitext(os.path.basename(path))[0] + ".png"
    out = os.path.join(OUTPUT_DIR, name)

    img = Image.open(path).convert("RGBA")
    data = np.array(img, dtype=np.uint8)

    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]

    # Perceived brightness (weighted for human vision)
    brightness = 0.299 * r + 0.587 * g + 0.114 * b

    # Paper pixels → transparent
    paper_mask = brightness > THRESHOLD
    data[paper_mask, 3] = 0

    # Ink pixels → opaque, optionally tinted
    ink_mask = ~paper_mask
    data[ink_mask, 3] = 255
    if INK_COLOR is not None:
        data[ink_mask, 0] = INK_COLOR[0]
        data[ink_mask, 1] = INK_COLOR[1]
        data[ink_mask, 2] = INK_COLOR[2]

    Image.fromarray(data).save(out, "PNG")
    print(f"  ✓ {name}")

print(f"\nDone! Output in: {OUTPUT_DIR}")
print()
print("Next steps:")
print("  1. Open a few images and check the result.")
print(f"     Too much paper remaining? → lower THRESHOLD (e.g. {THRESHOLD - 20})")
print(f"     Ink strokes missing?      → raise THRESHOLD (e.g. {THRESHOLD + 20})")
print("  2. Once happy, update src/data/pages.json to point to /recipes-extracted/")
