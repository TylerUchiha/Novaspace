import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Fix all instances of userProfile.credits.toLocaleString()
content = content.replace("userProfile.credits.toLocaleString()", "(userProfile?.credits || 0).toLocaleString()")

with open('App.tsx', 'w') as f:
    f.write(content)
