import re

with open('components/VendorSelection.tsx', 'r') as f:
    content = f.read()

# Remove floating widget
content = re.sub(r"      \{\/\* Nova Bot Chat Widget \*\/\}.*?      \{\/\* Reusable elegant Contact Us Popup \*\/\}", "      {/* Reusable elegant Contact Us Popup */}", content, flags=re.DOTALL)

# Remove chatbotFilteredIds check in filteredLocations
content = re.sub(r" \|\| chatbotFilteredIds !== null", "", content)

# Remove usage in filters
content = re.sub(r" \|\| chatbotFilteredIds\.includes\(loc\.id\)", "", content)

with open('components/VendorSelection.tsx', 'w') as f:
    f.write(content)

with open('components/LocationSelection.tsx', 'r') as f:
    content = f.read()

content = re.sub(r" \|\| chatbotFilteredIds !== null", "", content)
content = re.sub(r" \|\| chatbotFilteredIds\.includes\(loc\.id\)", "", content)

with open('components/LocationSelection.tsx', 'w') as f:
    f.write(content)
