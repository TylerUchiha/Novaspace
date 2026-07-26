import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace("from 'lucide-react';", ", LifeBuoy } from 'lucide-react';")
content = content.replace("} , LifeBuoy }", ", LifeBuoy }")

with open('App.tsx', 'w') as f:
    f.write(content)
