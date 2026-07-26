import React from 'react';
import { Phone, X, ShieldAlert, Globe, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SocialLink } from '../types';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  socials?: SocialLink[];
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({
  isOpen,
  onClose,
  title,
  name,
  email,
  phone,
  notes,
  socials
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 overflow-hidden z-10"
        >
          {/* Header Accent Decorator */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
            title="Close"
          >
            <X size={18} />
          </button>

          {/* Title */}
          <div className="mb-6 mt-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
              {title}
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {name}
            </h3>
          </div>

          {/* Info Details Section */}
          <div className="space-y-4">
            {/* Social Links */}
            {socials && socials.length > 0 ? (
              <div className="space-y-2.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Socials & Instant Messaging
                </p>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                  {socials.map((soc) => {
                    const isWhatsapp = soc.type === 'whatsapp';
                    const isCall = soc.type === 'call';
                    const href = isCall 
                      ? `tel:${soc.value}` 
                      : isWhatsapp 
                        ? `https://wa.me/${soc.value.replace(/[^0-9]/g, '')}` 
                        : soc.value;

                    return (
                      <a
                        key={soc.id}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-50/30 border border-slate-100 rounded-2xl transition-all"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors shrink-0">
                            {isCall && <Phone size={15} />}
                            {isWhatsapp && <MessageCircle size={15} className="text-emerald-500" />}
                            {soc.type === 'social' && <Globe size={15} className="text-blue-500" />}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-black text-slate-800 truncate">
                              {soc.type === 'call' && 'Direct Call'}
                              {soc.type === 'whatsapp' && 'WhatsApp Chat'}
                              {soc.type === 'social' && (soc.name || 'Social Link')}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">
                              {soc.value}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-blue-600 group-hover:translate-x-0.5 transition-transform">
                          Connect &rarr;
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : null}



            {/* Fallback if nothing is provided */}
            {!email && !phone && !notes && (!socials || socials.length === 0) ? (
              <div className="py-6 flex flex-col items-center text-center">
                <ShieldAlert className="text-slate-300 mb-2" size={32} />
                <p className="text-sm font-bold text-slate-400">
                  No contact details have been registered yet by the workspace owner.
                </p>
              </div>
            ) : null}
          </div>

          {/* Action button */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-slate-200"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
