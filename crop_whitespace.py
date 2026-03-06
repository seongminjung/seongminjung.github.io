import sys
import os
from PIL import Image
import numpy as np

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".webp"}

MARGIN = 0

def crop_whitespace(path):
    img = Image.open(path).convert("RGB")
    arr = np.array(img)

    # Find non-white pixels (white = 255,255,255)
    mask = np.any(arr < 255, axis=2)
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]

    if len(rows) == 0 or len(cols) == 0:
        print("Image is entirely white, skipping.")
        return

    top = max(rows[0] - MARGIN, 0)
    bottom = min(rows[-1] + MARGIN + 1, img.height)
    left = max(cols[0] - MARGIN, 0)
    right = min(cols[-1] + MARGIN + 1, img.width)

    cropped = img.crop((left, top, right, bottom))
    out_path = os.path.splitext(path)[0] + ".png"
    cropped.save(out_path, "PNG")
    if path != out_path:
        os.remove(path)
    print(f"Cropped: {img.width}x{img.height} -> {cropped.width}x{cropped.height} -> {out_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python crop_whitespace.py <image_or_folder> [...]")
        sys.exit(1)
    for arg in sys.argv[1:]:
        if os.path.isdir(arg):
            for fname in sorted(os.listdir(arg)):
                if os.path.splitext(fname)[1].lower() in IMAGE_EXTS:
                    crop_whitespace(os.path.join(arg, fname))
        else:
            crop_whitespace(arg)
