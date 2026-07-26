import re

with open('components/VendorSelection.tsx', 'r') as f:
    content = f.read()

content = re.sub(r"import { getNovaBotResponse } from '\.\./services/geminiService';\n", "", content)

with open('components/VendorSelection.tsx', 'w') as f:
    f.write(content)
