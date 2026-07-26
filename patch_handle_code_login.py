import re

with open('App.tsx', 'r') as f:
    content = f.read()

old_block = """        if (isOwnerAll) {
          setIsLocationConfirmed(false);
          setSelectedVendor(vendor);
          await signIn('owner');
          return true;
        } else if (isOwnerSingle) {
          setIsLocationConfirmed(true);
          setSelectedVendor(vendor);
          setCurrentLocationId(loc.id);
          setCurrentFloorId(loc.floors[0]?.id || '');
          await signIn('owner');
          return true;
        }"""

new_block = """        if (isOwnerAll) {
          setIsLocationConfirmed(false);
          setSelectedVendor(vendor);
          await signIn('owner');
          setPostLoginAction('global_gateway');
          return true;
        } else if (isOwnerSingle) {
          setIsLocationConfirmed(true);
          setSelectedVendor(vendor);
          setCurrentLocationId(loc.id);
          setCurrentFloorId(loc.floors[0]?.id || '');
          await signIn('owner');
          setPostLoginAction(null);
          return true;
        }"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Patched handleCodeLogin")
else:
    print("Could not find handleCodeLogin block")

with open('App.tsx', 'w') as f:
    f.write(content)
