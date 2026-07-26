import re

with open('components/LandingPage.tsx', 'r') as f:
    content = f.read()

content = re.sub(r"  const \[isOwnerModalOpen, setIsOwnerModalOpen\] = useState\(false\);\n", "", content)
content = re.sub(r"  const \[ownerCode, setOwnerCode\] = useState\(''\);\n", "", content)
content = re.sub(r"  const \[ownerCodeError, setOwnerCodeError\] = useState\(false\);\n", "", content)

# Remove handleOwnerSubmit
handleOwnerPattern = r"  const handleOwnerSubmit = async \(e: React.FormEvent\) => \{\n    e.preventDefault\(\);\n    if \(ownerCode === 'Global Access'\) \{\n      onLogin\('owner'\);\n      setIsOwnerModalOpen\(false\);\n    \} else \{\n      setOwnerCodeError\(true\);\n      setTimeout\(\(\) => setOwnerCodeError\(false\), 2000\);\n    \}\n  \};\n"
content = re.sub(handleOwnerPattern, "", content)

with open('components/LandingPage.tsx', 'w') as f:
    f.write(content)
