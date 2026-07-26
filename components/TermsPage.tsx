import React, { useEffect } from 'react';
import { ChevronLeft, Scale, Gavel, FileText, AlertTriangle } from 'lucide-react';
import { PolicySection } from './PolicyManagement';

interface TermsPageProps {
  onBack: () => void;
  sections?: PolicySection[];
}

const TermsPage: React.FC<TermsPageProps> = ({ onBack, sections = [] }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-16 overflow-y-auto font-['Inter']">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 hover:text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-colors group text-slate-400"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Scale size={24} />
            </div>
            <h1 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em]">Legal</h1>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Terms of <span className="text-indigo-600 italic">Service</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium mt-4">
            Please read these terms carefully before using our services.
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <section key={index} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  {index % 3 === 0 ? <Scale size={24} /> : index % 3 === 1 ? <Gavel size={24} /> : <AlertTriangle size={24} />}
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{section.title}</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <footer className="mt-20 pt-10 border-t border-slate-200 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2026 NOVASPACE WORLDWIDE ECOSYSTEM</p>
        </footer>
      </div>
    </div>
  );
};

export default TermsPage;
