import sys

with open('components/MyBookingsPage.tsx', 'r') as f:
    content = f.read()

# 1. Add getMenuItemName to BookingCardProps
content = content.replace(
    "onFinalize: (res: Reservation) => void;",
    "onFinalize: (res: Reservation) => void;\n  getMenuItemName: (res: Reservation, itemId: string) => string;"
)

# 2. Update BookingCard signature
content = content.replace(
    "const BookingCard: React.FC<BookingCardProps> = ({ res, isCurrent, onCancel, locationName, vendor, now, onFinalize, onClick }) => {",
    "const BookingCard: React.FC<BookingCardProps> = ({ res, isCurrent, onCancel, locationName, vendor, now, onFinalize, onClick, getMenuItemName }) => {"
)

# 3. Update the item name inside BookingCard
content = content.replace(
    "const menuItem = vendor?.menu?.find(m => m.id === item.itemId);\n              return (\n                <div key={idx} className=\"flex flex-col bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm\">\n                  <div className=\"flex items-center gap-1.5\">\n                    <span className=\"text-[10px] font-black text-blue-600\">{item.quantity}x</span>\n                    <span className=\"text-[10px] font-bold text-slate-700\">{menuItem?.name || 'Item'}</span>",
    "const itemName = getMenuItemName(res, item.itemId);\n              return (\n                <div key={idx} className=\"flex flex-col bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm\">\n                  <div className=\"flex items-center gap-1.5\">\n                    <span className=\"text-[10px] font-black text-blue-600\">{item.quantity}x</span>\n                    <span className=\"text-[10px] font-bold text-slate-700\">{itemName}</span>"
)

# 4. Add getMenuItemName to MyBookingsPage component
get_menu_item_func = """
  const getMenuItemName = (res: Reservation, itemId: string) => {
    let item = vendors.find(v => v.id === res.vendorId)?.menu?.find(m => m.id === itemId);
    if (!item) {
      item = locations.find(l => l.id === res.locationId)?.menu?.find(m => m.id === itemId);
    }
    if (!item) {
      const loc = locations.find(l => l.id === res.locationId);
      const floor = loc?.floors.find(f => f.id === res.floorId);
      const room = floor?.rooms.find(r => r.id === res.roomId);
      item = room?.menu?.find(m => m.id === itemId);
    }
    return item?.name || 'Item';
  };
"""

content = content.replace(
    "const getLocationName = (id: string) => locations.find(l => l.id === id)?.name || 'Unknown Location';",
    "const getLocationName = (id: string) => locations.find(l => l.id === id)?.name || 'Unknown Location';\n" + get_menu_item_func
)

# 5. Pass getMenuItemName to BookingCard instances
content = content.replace(
    "onFinalize={setFinalizingRes}",
    "onFinalize={setFinalizingRes}\n                  getMenuItemName={getMenuItemName}"
)

# 6. Update the modal in MyBookingsPage to use getMenuItemName
content = content.replace(
    "const vendor = vendors.find(v => v.id === selectedResDetails.vendorId);\n                      const menuItem = vendor?.menu?.find(m => m.id === item.itemId);\n                      return (\n                        <div key={idx} className=\"flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100\">\n                          <div className=\"flex items-center gap-3\">\n                            <span className=\"w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black\">{item.quantity}x</span>\n                            <div className=\"flex flex-col\">\n                              <span className=\"text-xs font-black text-slate-900\">{menuItem?.name || 'Item'}</span>",
    "const vendor = vendors.find(v => v.id === selectedResDetails.vendorId);\n                      const menuItem = vendor?.menu?.find(m => m.id === item.itemId) || locations.find(l => l.id === selectedResDetails.locationId)?.menu?.find(m => m.id === item.itemId) || locations.find(l => l.id === selectedResDetails.locationId)?.floors.find(f => f.id === selectedResDetails.floorId)?.rooms.find(r => r.id === selectedResDetails.roomId)?.menu?.find(m => m.id === item.itemId);\n                      const itemName = getMenuItemName(selectedResDetails, item.itemId);\n                      return (\n                        <div key={idx} className=\"flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100\">\n                          <div className=\"flex items-center gap-3\">\n                            <span className=\"w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black\">{item.quantity}x</span>\n                            <div className=\"flex flex-col\">\n                              <span className=\"text-xs font-black text-slate-900\">{itemName}</span>"
)


with open('components/MyBookingsPage.tsx', 'w') as f:
    f.write(content)
