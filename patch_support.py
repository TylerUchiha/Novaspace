import re

with open('components/SupportPage.tsx', 'r') as f:
    content = f.read()

content = re.sub(r"const faqs = \[.*?\];\n\n", "", content, flags=re.DOTALL)
content = re.sub(r"interface SupportPageProps \{\n  onBack: \(\) => void;\n\}", "interface SupportPageProps {\n  onBack: () => void;\n  faqs?: {q: string; a: string}[];\n}", content)

content = re.sub(r"const SupportPage: React\.FC<SupportPageProps> = \(\{ onBack \}\) => \{", "const SupportPage: React.FC<SupportPageProps> = ({ onBack, faqs = [] }) => {", content)

with open('components/SupportPage.tsx', 'w') as f:
    f.write(content)
