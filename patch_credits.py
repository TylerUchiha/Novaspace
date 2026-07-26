import re

with open('App.tsx', 'r') as f:
    content = f.read()

pattern = r"""    if \(activeTab === 'credits'\) return \(
      <div className="flex-1 bg-slate-50/30 overflow-y-auto p-10 font-\['Inter'\]">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">My Balance</h2>"""

replacement = """    if (activeTab === 'credits') return (
      <div className="flex-1 bg-slate-50/30 overflow-y-auto p-10 font-['Inter']">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <button onClick={() => setActiveTab('blueprint')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors mb-6">
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">My Balance</h2>"""

content = re.sub(pattern, replacement, content)

with open('App.tsx', 'w') as f:
    f.write(content)

