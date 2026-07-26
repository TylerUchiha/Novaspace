import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

old = "setAllReservations(prev => prev.filter(r => r.id !== id));"
new = "setAllReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));"

content = content.replace(old, new)

with open(file_path, "w") as f:
    f.write(content)

print("Cancel patched.")
