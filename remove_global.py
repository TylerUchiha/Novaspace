import re

with open('components/LandingPage.tsx', 'r') as f:
    content = f.read()

# Remove Global Access button
btn_pattern = r'                    <button \n                      type="button"\n                      onClick=\{\(\) => setIsOwnerModalOpen\(true\)\}\n.*?Global Access.*?\n                    </button>\n'
content = re.sub(btn_pattern, '', content, flags=re.DOTALL)

# Remove Global Access modal
modal_pattern = r'      \{\/\* Owner Global Access Modal \*\/\}[\s\S]*?setIsOwnerModalOpen\(false\)\}\n              className="absolute top-6 right-6.*?\n              <X size=\{20\} \/>\n            <\/button>\n            <div className="text-center space-y-4 mb-8">\n              <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto">\n                <Globe size=\{32\} \/>\n              <\/div>\n              <div>\n                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Global Access<\/h3>\n                <p className="text-sm font-bold text-slate-400 mt-1">Enter master authorization code<\/p>\n              <\/div>\n            <\/div>\n            <form onSubmit=\{handleOwnerSubmit\} className="space-y-6">[\s\S]*?<\/div>\n      \)\}\n'
content = re.sub(modal_pattern, '', content, flags=re.DOTALL)

with open('components/LandingPage.tsx', 'w') as f:
    f.write(content)
