import os
from pypdf import PdfReader

pdf_path = r"C:\Users\Admin\Downloads\Website_kharghar_hills_desktop - V1.pdf"
out_dir = r"c:\Users\Admin\Desktop\Kharghar Hills\public\assets"
os.makedirs(out_dir, exist_ok=True)

reader = PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

total_images = 0

for page_idx, page in enumerate(reader.pages):
    print(f"\n--- PAGE {page_idx + 1} ---")
    
    # Extract images
    images = page.images
    print(f"Found {len(images)} images")
    for img_idx, img in enumerate(images):
        name = img.name
        img_data = img.data
        out_filename = f"page{page_idx + 1}_{img_idx + 1}_{name}"
        out_path = os.path.join(out_dir, out_filename)
        with open(out_path, "wb") as f:
            f.write(img_data)
        size_kb = len(img_data) / 1024
        print(f"  Extracted: {out_filename} ({size_kb:.1f} KB)")
        total_images += 1

print(f"\nTotal extracted images: {total_images}")
