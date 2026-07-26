import sys
import glob

for filename in ['components/RoomDetail.tsx', 'components/MenuConfig.tsx', 'App.tsx']:
    with open(filename, 'r') as f:
        content = f.read()
    
    # Replace `flex-1 ` with `` for the payment buttons
    content = content.replace('flex-1 p-4 rounded-2xl', 'w-24 p-4 rounded-2xl')
    content = content.replace('flex-1 p-3 rounded-xl', 'w-24 p-3 rounded-xl')

    with open(filename, 'w') as f:
        f.write(content)
print("Removed flex-1")
