import os
import zlib
from pypdf import PdfReader

pdf_path = r"C:\Users\Admin\Downloads\Website_kharghar_hills_desktop - V1.pdf"
out_dir = r"c:\Users\Admin\Desktop\Kharghar Hills\public\assets"
os.makedirs(out_dir, exist_ok=True)

reader = PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

for page_idx, page in enumerate(reader.pages):
    print(f"\n--- PAGE {page_idx + 1} ---")
    if "/Resources" in page and "/XObject" in page["/Resources"]:
        xObject = page["/Resources"]["/XObject"].get_object()
        for obj_name in xObject:
            xobj = xObject[obj_name].get_object()
            if xobj.get("/Subtype") == "/Image":
                width = xobj.get("/Width")
                height = xobj.get("/Height")
                filters = xobj.get("/Filter")
                print(f"Image {obj_name}: {width}x{height}, Filter={filters}")
                
                # If DCTDecode (JPEG)
                if filters == "/DCTDecode":
                    data = xobj.get_data()
                    filename = f"page{page_idx + 1}_{obj_name.replace('/', '')}_{width}x{height}.jpg"
                    filepath = os.path.join(out_dir, filename)
                    with open(filepath, "wb") as f:
                        f.write(data)
                    print(f"  Saved JPEG: {filename} ({len(data)/1024:.1f} KB)")
                elif filters == "/FlateDecode":
                    try:
                        raw = xobj.get_data()
                        filename = f"page{page_idx + 1}_{obj_name.replace('/', '')}_{width}x{height}.bin"
                        filepath = os.path.join(out_dir, filename)
                        with open(filepath, "wb") as f:
                            f.write(raw)
                        print(f"  Saved raw stream: {filename} ({len(raw)/1024:.1f} KB)")
                    except Exception as e:
                        print(f"  Error extracting FlateDecode: {e}")
