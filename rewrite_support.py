import re

content = """import React, { useEffect, useState } from 'react';
import { ChevronLeft, LifeBuoy, Mail, Send, X, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SupportPageProps {
  onBack: () => void;
}

const faqs = [
  { q: "How do I book a workspace?", a: "Simply browse our locations, select your preferred branch, and use the interactive blueprint to pick your space and time slot." },
  { q: "Can I cancel my reservation?", a: "Yes, you can cancel your reservation through your profile dashboard up to 24 hours in advance. For enterprise bookings, please consult your account manager." },
  { q: "What amenities are included?", a: "Standard access includes high-speed Wi-Fi, premium coffee, printing services, and access to common lounge areas. Premium tier members receive priority access to private acoustic booths." },
  { q: "Do you offer team subscriptions?", a: "Absolutely. Our enterprise tier allows you to manage multiple members under a unified billing cycle with customizable access controls." },
  { q: "Are pets allowed in the workspaces?", a: "Pet policies vary by location. Please check the specific branch details page to see if they are pet-friendly." }
];

const SupportPage: React.FC<SupportPageProps> = ({ onBack }) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    name: '',
    number: '',
    email: '',
    inquiry: ''
  });
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailFormError, setEmailFormError] = useState<string | null>(null);
  
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailFormData.number.length !== 11) {
      setEmailFormError("Please enter exactly 11 digits.");
      return;
    }
    setEmailFormError(null);
    setIsEmailSending(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEmailSending(false);
    setEmailSent(true);
    
    // Auto close after showing success
    setTimeout(() => {
      setIsEmailModalOpen(false);
      setEmailSent(false);
      setEmailFormData({ name: '', number: '', email: '', inquiry: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] relative flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors shadow-sm"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Help & Support</h1>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <LifeBuoy size={32} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">How can we help?</h2>
          <p className="text-slate-500 font-medium">We're here to assist you with any questions or issues.</p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center max-w-sm w-full hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Email Support</h3>
            <p className="text-slate-500 font-medium mb-6">Send us a message and we'll get back to you within 24 hours.</p>
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="mt-auto w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>

        <section className="mt-16 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Frequently Asked Questions</h3>
            <p className="text-slate-500 font-medium text-sm">Quick answers to common questions about NovaSpace</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div 
                  key={i} 
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isOpen ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-slate-100 shadow-sm hover:border-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                >
                  <div className="p-6 flex items-center justify-between gap-4">
                    <h4 className={`font-black text-sm sm:text-base transition-colors ${isOpen ? 'text-blue-900' : 'text-slate-900'}`}>
                      {faq.q}
                    </h4>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-2">
                          <p className="text-slate-500 font-medium text-sm leading-relaxed border-t border-slate-100 pt-4">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="mt-24 pt-10 border-t border-slate-200 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2026 NOVASPACE WORLDWIDE ECOSYSTEM</p>
        </footer>
      </div>

      {/* Email Support Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-900 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg text-white">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-widest">Email Support</h3>
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Response within 24h</p>
                </div>
              </div>
              <button 
                onClick={() => !isEmailSending && setIsEmailModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
                disabled={isEmailSending}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8">
              {emailSent ? (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Message Sent!</h3>
                  <p className="text-slate-500 font-medium">We've received your inquiry and will respond shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={emailFormData.name}
                        onChange={(e) => setEmailFormData({...emailFormData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        maxLength={11}
                        pattern="\d{11}"
                        title="Please enter exactly 11 digits"
                        value={emailFormData.number}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                          setEmailFormData({...emailFormData, number: val});
                        }}
                        placeholder="01234567890"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={emailFormData.email}
                      onChange={(e) => setEmailFormData({...emailFormData, email: e.target.value})}
                      placeholder="you@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inquiry</label>
                    <textarea 
                      required
                      rows={4}
                      value={emailFormData.inquiry}
                      onChange={(e) => setEmailFormData({...emailFormData, inquiry: e.target.value})}
                      placeholder="How can we help you?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>

                  {emailFormError && (
                    <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-black uppercase tracking-widest text-center">
                      {emailFormError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isEmailSending}
                    className="w-full bg-blue-600 text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isEmailSending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
"""

with open('components/SupportPage.tsx', 'w') as f:
    f.write(content)
