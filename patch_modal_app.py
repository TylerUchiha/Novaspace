import re

with open('App.tsx', 'r') as f:
    content = f.read()

modal_code = """
        {showCreditsModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden">
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95">
              {renderCredits(true, () => setShowCreditsModal(false))}
            </div>
          </div>
        )}
      </AnimatePresence>
"""

content = content.replace("</AnimatePresence>", modal_code)

with open('App.tsx', 'w') as f:
    f.write(content)

