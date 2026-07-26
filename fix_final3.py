with open("components/VendorSelection.tsx", "r") as f:
    content = f.read()

content = content.replace("                          </span>\n                        ))", "                          </span>\n                        ))}")

with open("components/VendorSelection.tsx", "w") as f:
    f.write(content)
