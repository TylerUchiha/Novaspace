import re

with open('App.tsx', 'r') as f:
    content = f.read()

default_privacy = """[
    { title: "Data Collection", content: "We collect information that you provide directly to us, such as when you create an account, make a booking, or contact support. This may include your name, email address, phone number, and payment information." },
    { title: "How We Use Data", content: "We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about your bookings and account." },
    { title: "Data Security", content: "We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information." }
  ]"""

default_terms = """[
    { title: "Agreement to Terms", content: "By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site." },
    { title: "User Responsibilities", content: "You agree to use our workspaces and facilities in a respectful manner, adhering to all posted rules and guidelines. You are responsible for any damage caused to the facilities or equipment during your booking." },
    { title: "Cancellation Policy", content: "Bookings must be cancelled at least 24 hours in advance for a full refund. Cancellations made less than 24 hours before the booking start time may be subject to a cancellation fee." }
  ]"""

state_code = f"""
  const [privacySections, setPrivacySections] = useState<{{title: string, content: string}}[]>(() => {{
    const saved = localStorage.getItem('novaspace_privacy');
    if (saved) return JSON.parse(saved);
    return {default_privacy};
  }});

  useEffect(() => {{
    localStorage.setItem('novaspace_privacy', JSON.stringify(privacySections));
  }}, [privacySections]);

  const [termsSections, setTermsSections] = useState<{{title: string, content: string}}[]>(() => {{
    const saved = localStorage.getItem('novaspace_terms');
    if (saved) return JSON.parse(saved);
    return {default_terms};
  }});

  useEffect(() => {{
    localStorage.setItem('novaspace_terms', JSON.stringify(termsSections));
  }}, [termsSections]);
"""

# add state to App.tsx
content = content.replace("  const [faqs, setFaqs] = useState<{q: string, a: string}[]>(() => {", state_code + "\n  const [faqs, setFaqs] = useState<{q: string, a: string}[]>(() => {")

# add to import list
content = content.replace("import FAQManagement from './components/FAQManagement';", "import FAQManagement from './components/FAQManagement';\nimport PolicyManagement from './components/PolicyManagement';\nimport { Shield, Scale } from 'lucide-react';")

# change PostLoginAction type definition if present - wait, postLoginAction is defined in useState
# let's just do it dynamically via string replacement if it exists
content = re.sub(r"useState<'welcome' \| 'workspaces' \| 'select_network' \| 'edit_profile' \| 'create_space' \| 'privacy' \| 'terms' \| 'support' \| 'api_status' \| 'global_gateway' \| 'code_credentials' \| 'edit_faq' \| null>", "useState<string | null>", content)
content = re.sub(r"useState<.*?>\('welcome'\)", "useState<any>('welcome')", content)

# Update rendering of PrivacyPage and TermsPage
content = content.replace("<PrivacyPage onBack={() => setPostLoginAction(isLoggedIn ? (selectedVendor ? 'select_network' : null) : null)} />", "<PrivacyPage onBack={() => setPostLoginAction(isLoggedIn ? (selectedVendor ? 'select_network' : null) : null)} sections={privacySections} />")
content = content.replace("<TermsPage onBack={() => setPostLoginAction(isLoggedIn ? (selectedVendor ? 'select_network' : null) : null)} />", "<TermsPage onBack={() => setPostLoginAction(isLoggedIn ? (selectedVendor ? 'select_network' : null) : null)} sections={termsSections} />")

route_code = """
  if (postLoginAction === 'edit_privacy') {
    return (
      <PolicyManagement 
        title="Privacy Policy"
        icon="privacy"
        sections={privacySections}
        setSections={setPrivacySections}
        onBack={() => setPostLoginAction('global_gateway')}
      />
    );
  }

  if (postLoginAction === 'edit_terms') {
    return (
      <PolicyManagement 
        title="Terms of Service"
        icon="terms"
        sections={termsSections}
        setSections={setTermsSections}
        onBack={() => setPostLoginAction('global_gateway')}
      />
    );
  }
"""

content = content.replace("if (postLoginAction === 'edit_faq') {", route_code + "\n  if (postLoginAction === 'edit_faq') {")

button_code = """
            <button onClick={() => setPostLoginAction('edit_privacy')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-blue-200 transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Privacy Policy</h2>
              <p className="text-slate-500 font-medium">Edit, add, or delete privacy policy sections</p>
            </button>
            <button onClick={() => setPostLoginAction('edit_terms')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-indigo-200 transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Scale size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Terms of Service</h2>
              <p className="text-slate-500 font-medium">Edit, add, or delete terms of service sections</p>
            </button>
"""

content = content.replace("<p className=\"text-slate-500 font-medium\">Edit, add, or delete frequently asked questions</p>\n            </button>", "<p className=\"text-slate-500 font-medium\">Edit, add, or delete frequently asked questions</p>\n            </button>" + button_code)

with open('App.tsx', 'w') as f:
    f.write(content)
