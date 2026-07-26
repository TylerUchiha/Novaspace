import re

with open('components/VendorSelection.tsx', 'r') as f:
    content = f.read()

# Remove floating widget
content = re.sub(r"      \{\/\* Nova Bot Chat Widget \*\/\}.*?      \{\/\* Contact Us popup modal for Brand Socials \*\/\}", "      {/* Contact Us popup modal for Brand Socials */}", content, flags=re.DOTALL)

# Remove any remaining mentions of chatbotFilteredIds
content = re.sub(r"    if \(chatbotFilteredIds !== null\) \{.*?\n    \}\n", "", content, flags=re.DOTALL)

with open('components/VendorSelection.tsx', 'w') as f:
    f.write(content)
