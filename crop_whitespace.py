import sys
import os
from PIL import Image
import numpy as np

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".webp"}

MARGIN = 0

def crop_whitespace(img):
    """Crop whitespace from a PIL Image and return the cropped image."""
    arr = np.array(img)
    mask = np.any(arr < 255, axis=2)
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]

    if len(rows) == 0 or len(cols) == 0:
        return img

    top = max(rows[0] - MARGIN, 0)
    bottom = min(rows[-1] + MARGIN + 1, img.height)
    left = max(cols[0] - MARGIN, 0)
    right = min(cols[-1] + MARGIN + 1, img.width)

    return img.crop((left, top, right, bottom))

def process_file(path):
    """Crop whitespace from a single file, saving in place as PNG."""
    img = Image.open(path).convert("RGB")
    cropped = crop_whitespace(img)
    out_path = os.path.splitext(path)[0] + ".png"
    cropped.save(out_path, "PNG")
    if path != out_path:
        os.remove(path)
    print(f"Cropped: {img.width}x{img.height} -> {cropped.width}x{cropped.height} -> {out_path}")

def process_folder(folder, rename=False):
    """Crop images in a folder. If rename=True, rename to img1.png, img2.png, ... sorted by modification time."""
    files = []
    for fname in os.listdir(folder):
        if os.path.splitext(fname)[1].lower() in IMAGE_EXTS:
            files.append(fname)
    files.sort(key=lambda f: os.path.getmtime(os.path.join(folder, f)))

    if not files:
        print(f"No image files found in {folder}")
        return

    if rename:
        # First pass: crop and save to temp names to avoid conflicts
        temp_paths = []
        for i, fname in enumerate(files, 1):
            src = os.path.join(folder, fname)
            img = Image.open(src).convert("RGB")
            cropped = crop_whitespace(img)
            temp_name = f"_tmp_img{i}.png"
            temp_path = os.path.join(folder, temp_name)
            cropped.save(temp_path, "PNG")
            print(f"img{i}.png: {fname} ({img.width}x{img.height} -> {cropped.width}x{cropped.height})")
            temp_paths.append(temp_path)

        # Remove original files
        for fname in files:
            src = os.path.join(folder, fname)
            if os.path.exists(src):
                os.remove(src)

        # Second pass: rename temp files to final names
        for i, temp_path in enumerate(temp_paths, 1):
            final_path = os.path.join(folder, f"img{i}.png")
            os.rename(temp_path, final_path)

        print(f"\nRenamed {len(files)} images to img1.png ~ img{len(files)}.png")
    else:
        for fname in files:
            process_file(os.path.join(folder, fname))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python crop_whitespace.py [--rename] <image_or_folder> [...]")
        sys.exit(1)

    rename = False
    paths = []
    for arg in sys.argv[1:]:
        if arg == "--rename":
            rename = True
        else:
            paths.append(arg)

    for path in paths:
        if os.path.isdir(path):
            process_folder(path, rename=rename)
        else:
            process_file(path)
