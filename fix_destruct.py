import sys

with open('components/LocationSelection.tsx', 'r') as f:
    content = f.read()

content = content.replace("  userName,\n  userProfile", "  userName,\n  userProfile,\n  onAddLocation")

with open('components/LocationSelection.tsx', 'w') as f:
    f.write(content)
