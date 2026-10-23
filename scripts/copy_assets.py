import os
import shutil
from PIL import Image

brain_dir = r"C:\Users\Admin\.gemini\antigravity-ide\brain\8672962f-c834-418d-a759-477de57168af"
dest_dir = r"c:\Users\Admin\Desktop\Kharghar Hills\public\assets"
os.makedirs(dest_dir, exist_ok=True)

files = [
    ("hero_kharghar_hills_1792732820416.jpg", "hero_arch_hills.jpg"),
    ("infrastructure_network_1792733112397.jpg", "infra_highway_night.jpg"),
    ("interior_luxury_living_1792732861818.jpg", "pricing_living_room.jpg"),
    ("lifestyle_active_tennis_1792732992502.jpg", "lifestyle_tennis.jpg"),
    ("lifestyle_kids_tomorrow_1792732910504.jpg", "lifestyle_kids.jpg"),
    ("lifestyle_nature_hills_1792733045019.jpg", "lifestyle_nature.jpg")
]

for src_name, dst_name in files:
    src_path = os.path.join(brain_dir, src_name)
    dst_path = os.path.join(dest_dir, dst_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        with Image.open(dst_path) as im:
            print(f"Copied {src_name} -> {dst_name} ({im.size})")

# Also let's check high res page4_1_Im0.jpg which is 9744x6504
full_panorama = os.path.join(dest_dir, "page4_1_Im0.jpg")
if os.path.exists(full_panorama):
    dst_pano = os.path.join(dest_dir, "panorama_hills_full.jpg")
    shutil.copy2(full_panorama, dst_pano)
    # create a responsive web version around 2560px wide for optimal performance and crispness
    with Image.open(full_panorama) as im:
        im_resized = im.resize((2560, int(2560 * im.height / im.width)), Image.Resampling.LANCZOS)
        im_resized.save(os.path.join(dest_dir, "panorama_hills_web.jpg"), "JPEG", quality=90)
        print("Created panorama_hills_web.jpg (2560px)")
