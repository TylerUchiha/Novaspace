import sys

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace("currentLocation?.acceptedPaymentMethods", "selectedVendor?.acceptedPaymentMethods")
content = content.replace("currentLocation.acceptedPaymentMethods", "selectedVendor.acceptedPaymentMethods")

with open('App.tsx', 'w') as f:
    f.write(content)

print("Updated App.tsx")
