import os

file_path = "components/LandingPage.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace email placeholder
content = content.replace('placeholder="alex@novaspace.ai"', 'placeholder=""')

# Replace password placeholder
content = content.replace('placeholder="••••••••"', 'placeholder=""')

# Replace phone number placeholder
content = content.replace('placeholder="+1 (555) 000-0000"', 'placeholder=""')

# Replace branch access code placeholder
content = content.replace('placeholder="NS-SF-88"', 'placeholder=""')

# Replace Name placeholder
content = content.replace('placeholder="Alex Carter"', 'placeholder=""')

with open(file_path, "w") as f:
    f.write(content)

print("Placeholders patched.")
