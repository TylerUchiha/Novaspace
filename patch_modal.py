with open('components/LandingPage.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "Owner Global Access Modal" in line:
        skip = True
    if not skip:
        new_lines.append(line)
    if skip and line.strip() == ")}" and "</div>" in lines[i-1]:
        skip = False

with open('components/LandingPage.tsx', 'w') as f:
    f.writelines(new_lines)
