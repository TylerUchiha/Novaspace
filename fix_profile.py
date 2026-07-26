import re

with open('components/ProfilePage.tsx', 'r') as f:
    content = f.read()

content = content.replace("EGP                </span>", "Nova Points                </span>")
content = content.replace("<Sparkles size={12} /> {formData.credits.toLocaleString()} EGP", "<Sparkles size={12} /> {formData.credits.toLocaleString()} Nova Points")

with open('components/ProfilePage.tsx', 'w') as f:
    f.write(content)
