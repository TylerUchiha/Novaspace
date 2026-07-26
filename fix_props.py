import sys

with open('components/GlobalConfigPage.tsx', 'r') as f:
    content = f.read()

find_str = """const GlobalConfigPage: React.FC<GlobalConfigPageProps> = ({
  vendor,
  locations,
  allLocations,
  onUpdateLocation,
}) => {"""

replace_str = """const GlobalConfigPage: React.FC<GlobalConfigPageProps> = ({
  vendor,
  locations,
  allLocations,
  onUpdateLocation,
  onUpdateVendor,
}) => {"""

content = content.replace(find_str, replace_str)
with open('components/GlobalConfigPage.tsx', 'w') as f:
    f.write(content)
