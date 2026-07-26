with open("App.tsx", "r") as f:
    content = f.read()

target = "if (room.type !== 'Service' && (isStaff || room.status === RoomStatus.AVAILABLE)) setSelectedRoomIds(prev => prev.includes(room.id) ? prev.filter(id => id !== room.id) : [...prev, room.id]);"
replacement = "if (room.type !== 'Service') setSelectedRoomIds(prev => prev.includes(room.id) ? prev.filter(id => id !== room.id) : [...prev, room.id]);"

if target in content:
    content = content.replace(target, replacement)
    with open("App.tsx", "w") as f:
        f.write(content)
    print("Patched click2")
else:
    print("Target not found")
