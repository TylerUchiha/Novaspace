with open("components/PropertyConfig.tsx", "r") as f:
    content = f.read()

target = """<option value="HotDesk">Hot Desk</option>
<option value="Service">Service Area</option>"""
replacement = """<option value="HotDesk">Hot Desk</option>
<option value="SharedDesk">Global Access</option>
<option value="Service">Service Area</option>"""

if target in content:
    content = content.replace(target, replacement)
    with open("components/PropertyConfig.tsx", "w") as f:
        f.write(content)
    print("Patched dropdown")
else:
    print("Target not found")
