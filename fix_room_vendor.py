import sys

with open('components/RoomDetail.tsx', 'r') as f:
    content = f.read()

content = content.replace("currentLocation?.acceptedPaymentMethods", "vendor?.acceptedPaymentMethods")
content = content.replace("currentLocation.acceptedPaymentMethods", "vendor.acceptedPaymentMethods")

with open('components/RoomDetail.tsx', 'w') as f:
    f.write(content)

print("Updated RoomDetail.tsx")
