import re

with open('components/VendorSelection.tsx', 'r') as f:
    content = f.read()

content = content.replace("locations, chatbotFilteredIds]);", "locations]);")

with open('components/VendorSelection.tsx', 'w') as f:
    f.write(content)
