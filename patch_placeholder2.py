import os

file_path = "components/LandingPage.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace Name placeholder
content = content.replace('placeholder="Alex Rivera"', 'placeholder=""')

# Replace Password placeholder if they use something else
content = content.replace('placeholder="********"', 'placeholder=""')

# Also in MenuConfig, RoomDetail, ProfilePage if needed?
with open(file_path, "w") as f:
    f.write(content)

print("Placeholders 2 patched.")
