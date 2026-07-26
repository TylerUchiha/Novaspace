with open('components/LandingPage.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "const [ownerCode, setOwnerCode]" in line:
        continue
    if "const [ownerCodeError, setOwnerCodeError]" in line:
        continue
    if "const [isOwnerModalOpen, setIsOwnerModalOpen]" in line:
        continue
    if "const handleOwnerSubmit = async (e: React.FormEvent) => {" in line:
        skip = True
    if not skip:
        new_lines.append(line)
    if skip and line.strip() == "};" and "setTimeout(() => setOwnerCodeError(false), 2000);" in lines[i-2]:
        skip = False

with open('components/LandingPage.tsx', 'w') as f:
    f.writelines(new_lines)
