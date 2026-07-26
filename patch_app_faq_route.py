import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import SupportPage from './components/SupportPage';", "import SupportPage from './components/SupportPage';\nimport FAQManagement from './components/FAQManagement';")

route_code = """
  if (postLoginAction === 'edit_faq') {
    return (
      <FAQManagement 
        faqs={faqs}
        setFaqs={setFaqs}
        onBack={() => setPostLoginAction('global_gateway')}
      />
    );
  }
"""

content = content.replace("if (postLoginAction === 'code_credentials') {", route_code + "\n  if (postLoginAction === 'code_credentials') {")

button_code = """
            <button onClick={() => setPostLoginAction('edit_faq')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-rose-200 transition-all group flex flex-col items-center text-center md:col-span-2">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LifeBuoy size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">FAQ Management</h2>
              <p className="text-slate-500 font-medium">Edit, add, or delete frequently asked questions</p>
            </button>
          </div>
"""

content = content.replace("          </div>\n        </div>\n      </div>\n    );\n  }\n\n  if (postLoginAction === 'code_credentials') {", button_code + "        </div>\n      </div>\n    );\n  }\n\n  if (postLoginAction === 'code_credentials') {")

with open('App.tsx', 'w') as f:
    f.write(content)
