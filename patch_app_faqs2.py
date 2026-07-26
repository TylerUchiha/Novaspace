import re

with open('App.tsx', 'r') as f:
    content = f.read()

default_faqs = """[
    { q: "How do I book a workspace?", a: "Simply browse our locations, select your preferred branch, and use the interactive blueprint to pick your space and time slot." },
    { q: "Can I cancel my reservation?", a: "Yes, you can cancel your reservation through your profile dashboard up to 24 hours in advance. For enterprise bookings, please consult your account manager." },
    { q: "What amenities are included?", a: "Standard access includes high-speed Wi-Fi, premium coffee, printing services, and access to common lounge areas. Premium tier members receive priority access to private acoustic booths." },
    { q: "Do you offer team subscriptions?", a: "Absolutely. Our enterprise tier allows you to manage multiple members under a unified billing cycle with customizable access controls." },
    { q: "Are pets allowed in the workspaces?", a: "Pet policies vary by location. Please check the specific branch details page to see if they are pet-friendly." }
  ]"""

state_code = f"""
  const [faqs, setFaqs] = useState<{{q: string, a: string}}[]>(() => {{
    const saved = localStorage.getItem('novaspace_faqs');
    if (saved) return JSON.parse(saved);
    return {default_faqs};
  }});

  useEffect(() => {{
    localStorage.setItem('novaspace_faqs', JSON.stringify(faqs));
  }}, [faqs]);
"""

content = content.replace("  const [allVendors, setAllVendors] = useState<Vendor[]>(() => {", state_code + "\n  const [allVendors, setAllVendors] = useState<Vendor[]>(() => {")

content = content.replace("<SupportPage onBack={() => setPostLoginAction(isLoggedIn ? (selectedVendor ? 'select_network' : null) : null)} />", "<SupportPage onBack={() => setPostLoginAction(isLoggedIn ? (selectedVendor ? 'select_network' : null) : null)} faqs={faqs} />")

with open('App.tsx', 'w') as f:
    f.write(content)
