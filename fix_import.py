import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("import { Building, motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';")
content = content.replace("import { ", "import { Building, ", 1) # first import is lucide-react

with open(file_path, "w") as f:
    f.write(content)

print("Import fixed.")
