import re

with open('components/LandingPage.tsx', 'r') as f:
    content = f.read()

start_idx = content.find("{/* Owner Global Access Modal */}")

if start_idx != -1:
    end_idx = content.rfind("</div>\n  );\n};\n\nexport default LandingPage;")
    if end_idx != -1:
        content = content[:start_idx] + content[end_idx:]

with open('components/LandingPage.tsx', 'w') as f:
    f.write(content)
