import sys

with open('components/MenuConfig.tsx', 'r') as f:
    content = f.read()

# 1. Add handleToggleItemAvailability function to MenuConfig
func_code = """  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  const handleToggleItemAvailability = (id: string, currentStatus: boolean) => {
    onUpdateLocation(prev => {
      const prevMenu = prev.menu || [];
      return { menu: prevMenu.map(m => m.id === id ? { ...m, isAvailable: !currentStatus } : m) };
    });
  };"""

content = content.replace("  const [selectedRoomId, setSelectedRoomId] = useState<string>('');", func_code)

# 2. Update rendering for items
old_render = """                {activeCategory && menuByCategories[activeCategory.name]?.map(item => {
                  const qty = orderBasket[item.id] || 0;
                  return (
                    <div key={item.id} className={`bg-white rounded-[2.5rem] p-6 border transition-all ${qty > 0 ? 'border-emerald-400 shadow-xl shadow-emerald-50' : 'border-slate-100 shadow-sm hover:border-slate-200'}`}>
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-4 relative">"""

new_render = """                {activeCategory && menuByCategories[activeCategory.name]?.map(item => {
                  const qty = orderBasket[item.id] || 0;
                  const isAvailable = item.isAvailable !== false;
                  return (
                    <div key={item.id} className={`bg-white rounded-[2.5rem] p-6 border relative transition-all ${!isAvailable ? 'opacity-75 grayscale-[50%] border-slate-200' : qty > 0 ? 'border-emerald-400 shadow-xl shadow-emerald-50' : 'border-slate-100 shadow-sm hover:border-slate-200'}`}>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleItemAvailability(item.id, isAvailable);
                        }}
                        className={`absolute top-8 left-8 z-20 p-2.5 rounded-2xl border transition-all backdrop-blur-md ${isAvailable ? 'bg-white/80 border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-rose-50' : 'bg-rose-500 border-rose-500 text-white shadow-lg'}`}
                        title={isAvailable ? "Mark as Unavailable" : "Mark as Available"}
                      >
                        {isAvailable ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <div className={`aspect-[4/3] rounded-3xl overflow-hidden mb-4 relative ${!isAvailable ? 'pointer-events-none' : ''}`}>"""

content = content.replace(old_render, new_render)

# 3. Disable ordering if not available
old_qty_buttons = """                        <span className="text-xl font-black text-blue-600">{item.price} <span className="text-xs text-blue-400">EGP</span></span>
                        
                        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-2xl">
                          <button
                            type="button"
                            onClick={() => setOrderBasket(prev => ({ ...prev, [item.id]: Math.max(0, qty - 1) }))}
                            className="text-slate-400 hover:text-slate-800 disabled:opacity-20 p-1"
                            disabled={qty === 0}
                          >"""

new_qty_buttons = """                        <span className="text-xl font-black text-blue-600">{item.price} <span className="text-xs text-blue-400">EGP</span></span>
                        
                        <div className={`flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-2xl ${!isAvailable ? 'opacity-50 pointer-events-none' : ''}`}>
                          <button
                            type="button"
                            onClick={() => setOrderBasket(prev => ({ ...prev, [item.id]: Math.max(0, qty - 1) }))}
                            className="text-slate-400 hover:text-slate-800 disabled:opacity-20 p-1"
                            disabled={qty === 0 || !isAvailable}
                          >"""

content = content.replace(old_qty_buttons, new_qty_buttons)

old_plus_button = """                          <button
                            type="button"
                            onClick={() => setOrderBasket(prev => ({ ...prev, [item.id]: qty + 1 }))}
                            className="text-slate-400 hover:text-slate-800 p-1"
                          >"""

new_plus_button = """                          <button
                            type="button"
                            onClick={() => setOrderBasket(prev => ({ ...prev, [item.id]: qty + 1 }))}
                            className="text-slate-400 hover:text-slate-800 disabled:opacity-20 p-1"
                            disabled={!isAvailable}
                          >"""

content = content.replace(old_plus_button, new_plus_button)


with open('components/MenuConfig.tsx', 'w') as f:
    f.write(content)

