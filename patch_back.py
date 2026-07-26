import re

with open('App.tsx', 'r') as f:
    content = f.read()

old_gateway = """  if (postLoginAction === 'global_gateway') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-['Inter']">
        <div className="max-w-3xl w-full">"""

new_gateway = """  if (postLoginAction === 'global_gateway') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-['Inter'] relative">
        <div className="absolute top-6 left-6">
          <button onClick={handleLogout} className="flex items-center gap-2 p-3 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm hover:shadow-md transition-all">
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="max-w-3xl w-full">"""

content = content.replace(old_gateway, new_gateway)

with open('App.tsx', 'w') as f:
    f.write(content)
