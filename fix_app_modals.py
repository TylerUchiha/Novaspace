import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Replace all instances of the modal + AnimatePresence back to AnimatePresence
bad_code = """
        {showCreditsModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden">
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95">
              {renderCredits(true, () => setShowCreditsModal(false))}
            </div>
          </div>
        )}
      </AnimatePresence>
"""
bad_code2 = """
        {showCreditsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden">
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95">
              {renderCredits(true, () => setShowCreditsModal(false))}
            </div>
          </div>
        )}
"""

content = content.replace(bad_code.strip(), "</AnimatePresence>")
# Wait, let's just do a regex replace
content = re.sub(r"\s*\{showCreditsModal && \(\s*<div className=\"fixed inset-0 z-\[\d+\].*?</div>\s*</div>\s*\)\}\s*</AnimatePresence>", "\n      </AnimatePresence>", content, flags=re.DOTALL)

with open('App.tsx', 'w') as f:
    f.write(content)

