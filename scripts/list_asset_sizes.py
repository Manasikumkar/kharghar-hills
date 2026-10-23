import os
from PIL import Image

assets_dir = r"c:\Users\Admin\Desktop\Kharghar Hills\public\assets"
for f in os.listdir(assets_dir):
    if f.endswith(('.jpg', '.png')):
        p = os.path.join(assets_dir, f)
        with Image.open(p) as im:
            print(f"{f}: {im.size}, {im.format}")
