import qrcode

qr = qrcode.QRCode(
    version=1,
    box_size=10,
    border=1,
)
qr.add_data("https://maharera.maharashtra.gov.in")
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save(r"c:\Users\Admin\Desktop\Kharghar Hills\public\assets\maharera_qr.png")
print("Saved maharera_qr.png successfully!")
