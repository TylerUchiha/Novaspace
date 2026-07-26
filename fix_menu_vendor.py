import sys

with open('components/MenuConfig.tsx', 'r') as f:
    content = f.read()

content = content.replace("location?.acceptedPaymentMethods", "vendor?.acceptedPaymentMethods")
content = content.replace("location.acceptedPaymentMethods", "vendor.acceptedPaymentMethods")

with open('components/MenuConfig.tsx', 'w') as f:
    f.write(content)

print("Updated MenuConfig.tsx")
