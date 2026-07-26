import sys

with open('components/SocialsConfig.tsx', 'r') as f:
    content = f.read()

old_func = """  const handleUrlInputChange = (
    value: string, 
    formType: 'call' | 'whatsapp' | 'social',
    setFormValue: (v: string) => void,
    setFormName: (n: string) => void,
    setAutofillMsg: (msg: string) => void
  ) => {
    setFormValue(value);"""

new_func = """  const handleUrlInputChange = (
    value: string, 
    formType: 'call' | 'whatsapp' | 'social',
    setFormValue: (v: string) => void,
    setFormName: (n: string) => void,
    setAutofillMsg: (msg: string) => void
  ) => {
    let finalValue = value;
    if (formType === 'call' || formType === 'whatsapp') {
      finalValue = value.replace(/\D/g, '');
    }
    setFormValue(finalValue);"""

content = content.replace(old_func, new_func)

with open('components/SocialsConfig.tsx', 'w') as f:
    f.write(content)
