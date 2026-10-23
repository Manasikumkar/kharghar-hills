import os
from PIL import Image
from pypdf import PdfReader

assets_dir = r"c:\Users\Admin\Desktop\Kharghar Hills\public\assets"
pdf_path = r"C:\Users\Admin\Downloads\Website_kharghar_hills_desktop - V1.pdf"

print("--- EXAMINING EXTRACTED ASSETS ---")
for f in sorted(os.listdir(assets_dir)):
    full_path = os.path.join(assets_dir, f)
    if os.path.isfile(full_path):
        try:
            with Image.open(full_path) as im:
                print(f"{f}: format={im.format}, size={im.size}, mode={im.mode}")
                if im.format == "TIFF":
                    png_path = os.path.join(assets_dir, f.replace(".tif", ".png"))
                    im.save(png_path, "PNG")
                    print(f"  Converted TIFF to PNG: {png_path}")
        except Exception as e:
            print(f"{f}: error opening: {e}")

print("\n--- EXAMINING FONTS & VECTOR ELEMENTS IN PDF ---")
reader = PdfReader(pdf_path)
for page_num, page in enumerate(reader.pages):
    print(f"\nPage {page_num + 1}:")
    if "/Resources" in page and "/Font" in page["/Resources"]:
        fonts = page["/Resources"]["/Font"].get_object()
        for f_name in fonts:
            font_obj = fonts[f_name].get_object()
            base_font = font_obj.get("/BaseFont", "Unknown")
            subtype = font_obj.get("/Subtype", "Unknown")
            print(f"  Font: {f_name} -> BaseFont: {base_font}, Subtype: {subtype}")
