import re

with open('App.tsx', 'r') as f:
    content = f.read()

old_onback = """      onBack={() => { 
        if (userRole === 'owner') {
          setPostLoginAction(null);
        } else if (userRole === 'manager') {
          setPostLoginAction(null);
        } else if (userRole === 'customer') {
          setPostLoginAction(null);
        } else {
          handleLogout();
        }
      }}"""

new_onback = """      onBack={() => { 
        if (userRole === 'owner') {
          setPostLoginAction('global_gateway');
        } else {
          handleLogout();
        }
      }}"""

content = content.replace(old_onback, new_onback)

with open('App.tsx', 'w') as f:
    f.write(content)
