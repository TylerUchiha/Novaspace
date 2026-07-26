import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace("userProfile.credits < totalPrice", "(userProfile?.credits || 0) < totalPrice")
content = content.replace("credits: userProfile.credits - totalPrice", "credits: (userProfile?.credits || 0) - totalPrice")
content = content.replace("userProfile.credits + topUpAmount", "(userProfile?.credits || 0) + topUpAmount")

with open('App.tsx', 'w') as f:
    f.write(content)
