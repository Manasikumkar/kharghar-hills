import os
from PIL import Image

p = r"c:\Users\Admin\Desktop\Kharghar Hills\public\assets\page6_advisor.jpg"
im = Image.open(p)
print(f"Bands: {im.getbands()}")
print(f"Extrema: {im.getextrema()}")
# Resize a thumbnail to see colors
thumb = im.resize((10, 10))
print("Sample colors:", list(thumb.getdata())[:5])
