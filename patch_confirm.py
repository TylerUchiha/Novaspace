import re

with open('components/VendorSelection.tsx', 'r') as f:
    content = f.read()

content = content.replace("                            if(window.confirm('Are you sure you want to delete this workspace?')) {\n                              onDeleteVendor(vendor.id);\n                            }", "                              onDeleteVendor(vendor.id);")

with open('components/VendorSelection.tsx', 'w') as f:
    f.write(content)

with open('components/LocationSelection.tsx', 'r') as f:
    content = f.read()

content = content.replace("                            if(window.confirm('Are you sure you want to delete this branch?')) {\n                              onDeleteLocation(loc.id);\n                            }", "                              onDeleteLocation(loc.id);")

with open('components/LocationSelection.tsx', 'w') as f:
    f.write(content)
