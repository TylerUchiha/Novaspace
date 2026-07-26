import os

file_path = "components/PaymentAnalytics.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_pdf_print = """    doc.text(`Card / POS: ${card.toLocaleString()} EGP`, 14, y); y += 6;"""
new_pdf_print = """    doc.text(`Card / POS (App): ${cardApp.toLocaleString()} EGP`, 14, y); y += 6;
    doc.text(`Card / POS (In-store): ${cardInstore.toLocaleString()} EGP`, 14, y); y += 6;"""

content = content.replace(old_pdf_print, new_pdf_print)

with open(file_path, "w") as f:
    f.write(content)

print("PDF print patched.")
