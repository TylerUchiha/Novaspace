import sys

with open('components/GlobalConfigPage.tsx', 'r') as f:
    content = f.read()

# Replace the state and branch logic
find_str = """  const spaceLocations = locations;
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  // Automatically select the first branch if none selected or if locations change
  useEffect(() => {
    if (spaceLocations.length > 0) {
      const match = spaceLocations.find(l => l.id === selectedBranchId);
      if (!match) {
        setSelectedBranchId(spaceLocations[0].id);
      }
    } else {
      setSelectedBranchId('');
    }
  }, [vendor.id, locations, selectedBranchId]);

  const selectedBranch = allLocations.find(l => l.id === selectedBranchId);

  // Toggle specific Branch (Location) payment settings
  const handleToggleBranchPayment = (method: 'card' | 'instapay' | 'novaPoints') => {
    if (!selectedBranch) return;
    const current = selectedBranch.acceptedPaymentMethods || { card: true, instapay: true, novaPoints: true };
    const newValue = !current[method];

    onUpdateLocation(selectedBranch.id, {
      acceptedPaymentMethods: { ...current, [method]: newValue }
    });
  };"""

replacement_str = """  // Toggle Global (Vendor) payment settings
  const handleToggleGlobalPayment = (method: 'card' | 'instapay' | 'novaPoints') => {
    const current = vendor.acceptedPaymentMethods || { card: true, instapay: true, novaPoints: true };
    const newValue = !current[method];

    onUpdateVendor(vendor.id, {
      acceptedPaymentMethods: { ...current, [method]: newValue }
    });
  };"""

content = content.replace(find_str, replacement_str)

# Replace the branch switcher and conditional rendering
content = content.replace("""        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider">
          <ShieldCheck size={16} />
          <span>Branch configuration mode</span>
        </div>""", """        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider">
          <ShieldCheck size={16} />
          <span>Global configuration mode</span>
        </div>""")

branch_switcher = """          {/* Branch Switcher Tab List */}
          {spaceLocations.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-100 p-2.5 rounded-3xl shadow-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1">
                <Building2 size={12} />
                <span>Select Branch:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {spaceLocations.map(loc => {
                  const isSelected = loc.id === selectedBranchId;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedBranchId(loc.id)}
                      className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 ${
                        isSelected 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                          : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {loc.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}"""
content = content.replace(branch_switcher, "")

# Remove the {selectedBranch ? ( wrapper
content = content.replace("          {selectedBranch ? (", "")
content = content.replace("""            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm max-w-xl mx-auto">
              <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">No Branches Available</h3>
              <p className="text-sm font-semibold text-slate-500">Please add a location to configure its accepted payment methods.</p>
            </div>
          )}""", "")

# Replace the text "Configuring payments for"
content = content.replace("""              {/* Branch Title Badge */}
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">Configuring payments for</span>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">{selectedBranch.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">{selectedBranch.address || 'Standard Location Address'}</p>
              </div>""", """              {/* Global Title Badge */}
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9px] font-black text-purple-600 uppercase tracking-[0.2em]">Global Payment Configuration</span>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">{vendor.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">These settings apply to the entire network</p>
              </div>""")

# Replace the methods
content = content.replace("selectedBranch.acceptedPaymentMethods", "vendor.acceptedPaymentMethods")
content = content.replace("handleToggleBranchPayment", "handleToggleGlobalPayment")

with open('components/GlobalConfigPage.tsx', 'w') as f:
    f.write(content)

print("Updated GlobalConfigPage.tsx")
