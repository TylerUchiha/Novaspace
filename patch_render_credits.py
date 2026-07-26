import re

with open('App.tsx', 'r') as f:
    content = f.read()

# We need to find the definition of renderContent to insert renderCredits before it.
# And we need to replace the credits tab block.

# Extract credits jsx
match = re.search(r"    if \(activeTab === 'credits'\) return \(\n(      <div className=\"flex-1 bg-slate-50/30 overflow-y-auto p-10 font-\['Inter'\]\">\n(?:.*?)\n      </div>)\n    \);\n    return null;\n  };\n", content, re.DOTALL)

if not match:
    print("Could not extract credits jsx")
    exit(1)

credits_jsx = match.group(1)

# Now define renderCredits
# We need to replace `Back to Dashboard` button with an X button if it's a modal, or just adjust the layout.
# Let's adjust the wrapper for modal vs full page.

render_credits_func = f"""
  const renderCredits = (isModal: boolean = false, onClose?: () => void) => (
{credits_jsx}
  );
"""

# Let's apply some changes to credits_jsx to make it responsive to isModal.
# 1. Replace the wrapper div to support modal if needed.
# We'll just replace it when we create renderCredits.

new_credits_jsx = credits_jsx.replace(
    '<div className="flex-1 bg-slate-50/30 overflow-y-auto p-10 font-[\'Inter\']">',
    '<div className={isModal ? "w-full max-w-5xl mx-auto p-10" : "flex-1 bg-slate-50/30 overflow-y-auto p-10 font-[\'Inter\']"}>'
)

new_credits_jsx = new_credits_jsx.replace(
    '<button onClick={() => setActiveTab(\'blueprint\')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors mb-6">\n              <ChevronLeft size={16} /> Back to Dashboard\n            </button>',
    '{!isModal && (\n            <button onClick={() => setActiveTab(\'blueprint\')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors mb-6">\n              <ChevronLeft size={16} /> Back to Dashboard\n            </button>\n            )}\n            {isModal && onClose && (\n              <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">\n                <X size={24} />\n              </button>\n            )}'
)

# And if it is modal, we need a close button maybe?
# The wrapper is: <div className="max-w-5xl mx-auto">
# Let's make it relative so absolute close button works
new_credits_jsx = new_credits_jsx.replace(
    '<div className="max-w-5xl mx-auto">',
    '<div className="max-w-5xl mx-auto relative">'
)

render_credits_func = f"""
  const renderCredits = (isModal: boolean = false, onClose?: () => void) => (
{new_credits_jsx}
  );
"""

# Insert renderCredits before renderContent
content = content.replace("const renderContent = () => {", render_credits_func + "\n  const renderContent = () => {")

# Replace the original block in renderContent with a call to renderCredits
content = re.sub(
    r"    if \(activeTab === 'credits'\) return \(\n(?:.*?)\n      </div>\n    \);\n    return null;\n  };\n",
    "    if (activeTab === 'credits') return renderCredits();\n    return null;\n  };\n",
    content,
    flags=re.DOTALL
)

with open('App.tsx', 'w') as f:
    f.write(content)

print("Patched!")

