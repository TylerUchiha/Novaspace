import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Add state
if "const [showCreditsModal" not in content:
    content = content.replace(
        "const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);",
        "const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);\n  const [showCreditsModal, setShowCreditsModal] = useState(false);"
    )

# Fix edit_profile logic
profile_block = """  if (postLoginAction === 'edit_profile' && !isStaff) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter'] relative">
        <div className="p-6">
          <button onClick={() => setPostLoginAction(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
            <ChevronLeft size={20} /> Back to Menu
          </button>
        </div>
        <ProfilePage user={userProfile} reservations={allReservations} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} onClose={() => setPostLoginAction(null)} onNavigateToCredits={() => setShowCreditsModal(true)} />
        {showCreditsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden">
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95">
              {renderCredits(true, () => setShowCreditsModal(false))}
            </div>
          </div>
        )}
      </div>
    );
  }"""

content = re.sub(
    r"  if \(postLoginAction === 'edit_profile' && !isStaff\) \{\n    return \(\n      <div className=\"min-h-screen bg-slate-50 flex flex-col font-\['Inter'\]\">\n        <div className=\"p-6\">\n          <button onClick=\{\(\) => setPostLoginAction\(null\)\} className=\"flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors\">\n            <ChevronLeft size=\{20\} /> Back to Menu\n          </button>\n        </div>\n        <ProfilePage user=\{userProfile\} reservations=\{allReservations\} onLogout=\{handleLogout\} onUpdateProfile=\{handleUpdateProfile\} onClose=\{\(\) => setPostLoginAction\(null\)\} onNavigateToCredits=\{\(\) => \{ setPostLoginAction\(null\); setActiveTab\('credits'\); \}\} />\n      </div>\n    \);\n  \}",
    profile_block,
    content
)

# Fix inside renderContent
# In activeTab === 'profile'
content = content.replace(
    "<ProfilePage user={userProfile} reservations={allReservations} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} onNavigateToCredits={() => setActiveTab('credits')} />",
    "<ProfilePage user={userProfile} reservations={allReservations} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} onNavigateToCredits={() => setShowCreditsModal(true)} />"
)

# And inside renderContent we also want to display the modal if they are inside the main dashboard?
# Wait, if they are in the main dashboard, they could just switch to activeTab='credits'. 
# But the user asked for a pop-up. We should probably show the modal everywhere they click on it, or just in ProfilePage?
# "when i click it, it opens as pop up menu that has the transaction history and a top up button, both functional just like the one here"
# If they are in the dashboard, should it also be a modal? Yes, let's keep consistency.

with open('App.tsx', 'w') as f:
    f.write(content)

