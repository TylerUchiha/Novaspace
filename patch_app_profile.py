import re

with open('App.tsx', 'r') as f:
    content = f.read()

# Replace the first usage
content = content.replace(
    "<ProfilePage user={userProfile} reservations={allReservations} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />",
    "<ProfilePage user={userProfile} reservations={allReservations} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} onNavigateToCredits={() => setActiveTab('credits')} />"
)

# Replace the second usage
content = content.replace(
    "<ProfilePage user={userProfile} reservations={allReservations} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} onClose={() => setPostLoginAction(null)} />",
    "<ProfilePage user={userProfile} reservations={allReservations} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} onClose={() => setPostLoginAction(null)} onNavigateToCredits={() => { setPostLoginAction(null); setActiveTab('credits'); }} />"
)

with open('App.tsx', 'w') as f:
    f.write(content)
