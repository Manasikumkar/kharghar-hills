import os
from PIL import Image

tif_path = r"c:\Users\Admin\Desktop\Kharghar Hills\public\assets\page6_1_Im0.tif"
jpg_path = r"c:\Users\Admin\Desktop\Kharghar Hills\public\assets\page6_advisor.jpg"

if os.path.exists(tif_path):
    with Image.open(tif_path) as im:
        rgb_im = im.convert("RGB")
        rgb_im.save(jpg_path, "JPEG", quality=95)
        print(f"Converted page6_1_Im0.tif to {jpg_path}, size={rgb_im.size}")
