import React, { useState } from 'react';
import { Vendor, LocationData, SocialLink } from '../types';
import { 
  Phone, 
  MessageCircle, 
  Globe, 
  Plus, 
  Trash2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Check, 
  ExternalLink, 
  Layers, 
  Building2, 
  Link as LinkIcon,
  Smartphone,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SocialsConfigProps {
  vendor: Vendor;
  locations: LocationData[];
  onUpdateVendor: (vendorId: string, data: Partial<Vendor>) => void;
  onUpdateLocation: (locationId: string, data: Partial<LocationData>) => void;
}

export const SocialsConfig: React.FC<SocialsConfigProps> = ({
  vendor,
  locations,
  onUpdateVendor,
  onUpdateLocation
}) => {
  // Main Tab State: 'brand' vs 'branches'
  const [activeTab, setActiveTab] = useState<'brand' | 'branches'>('brand');

  // Selected Branch Tab State for Branch Socials
  const [activeBranchId, setActiveBranchId] = useState<string>(
    locations[0]?.id || ''
  );

  const selectedBranch = locations.find(loc => loc.id === activeBranchId);

  // Form states for Brand Socials
  const [vendorFormType, setVendorFormType] = useState<'call' | 'whatsapp' | 'social'>('social');
  const [vendorFormValue, setVendorFormValue] = useState('');
  const [vendorFormName, setVendorFormName] = useState('');
  const [vendorFormError, setVendorFormError] = useState('');
  const [vendorAutofillMsg, setVendorAutofillMsg] = useState('');

  // Form states for Branch Socials
  const [branchFormType, setBranchFormType] = useState<'call' | 'whatsapp' | 'social'>('social');
  const [branchFormValue, setBranchFormValue] = useState('');
  const [branchFormName, setBranchFormName] = useState('');
  const [branchFormError, setBranchFormError] = useState('');
  const [branchAutofillMsg, setBranchAutofillMsg] = useState('');

  // Auto guess logic for social URLs (ONLY guesses Name when using 'social' type, never switches tabs/types)
  const handleUrlInputChange = (
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
    setFormValue(finalValue);
    setAutofillMsg('');

    // Only auto-guess platform name for 'social' type links
    if (formType !== 'social') return;

    const trimmed = value.trim();
    if (!trimmed) return;

    let lowercaseVal = trimmed.toLowerCase();
    
    // Add protocol if missing to parse URL successfully
    if (!lowercaseVal.startsWith('http://') && !lowercaseVal.startsWith('https://')) {
      lowercaseVal = 'https://' + lowercaseVal;
    }

    try {
      const url = new URL(lowercaseVal);
      const hostname = url.hostname.replace('www.', '');

      let guessedPlatform = '';
      if (hostname.includes('instagram.com')) guessedPlatform = 'Instagram';
      else if (hostname.includes('facebook.com') || hostname.includes('fb.com')) guessedPlatform = 'Facebook';
      else if (hostname.includes('twitter.com') || hostname.includes('x.com')) guessedPlatform = 'Twitter/X';
      else if (hostname.includes('linkedin.com')) guessedPlatform = 'LinkedIn';
      else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) guessedPlatform = 'YouTube';
      else if (hostname.includes('tiktok.com')) guessedPlatform = 'TikTok';
      else if (hostname.includes('pinterest.com')) guessedPlatform = 'Pinterest';
      else if (hostname.includes('github.com')) guessedPlatform = 'GitHub';
      else {
        // Fallback: extract domain name capitalized
        const parts = hostname.split('.');
        if (parts.length > 0) {
          guessedPlatform = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        }
      }

      if (guessedPlatform) {
        setFormName(guessedPlatform);
        setAutofillMsg(`✨ Auto-detected Platform Name: ${guessedPlatform}`);
      }
    } catch (e) {
      // Not a valid URL yet, do nothing
    }
  };

  // Save Social Link for Brand Socials
  const handleAddVendorSocial = () => {
    setVendorFormError('');
    if (!vendorFormValue.trim()) {
      setVendorFormError('Please enter a valid link or phone number.');
      return;
    }

    if (vendorFormType === 'social' && !vendorFormName.trim()) {
      setVendorFormError('Please provide a display name for the link.');
      return;
    }

    let finalValue = vendorFormValue.trim();
    if (vendorFormType === 'social') {
      const lower = finalValue.toLowerCase();
      if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
        finalValue = 'https://' + finalValue;
      }
    }

    const newSocial: SocialLink = {
      id: `soc_${Date.now()}`,
      type: vendorFormType,
      value: finalValue,
      name: vendorFormType === 'social' ? vendorFormName.trim() : undefined
    };

    const currentSocials = vendor.socials || [];
    onUpdateVendor(vendor.id, {
      socials: [...currentSocials, newSocial]
    });

    // Reset Form
    setVendorFormValue('');
    setVendorFormName('');
    setVendorAutofillMsg('');
  };

  // Remove Social Link for Brand Socials
  const handleRemoveVendorSocial = (id: string) => {
    const currentSocials = vendor.socials || [];
    onUpdateVendor(vendor.id, {
      socials: currentSocials.filter(s => s.id !== id)
    });
  };

  // Toggle Brand Socials Visibility
  const handleToggleVendorSocials = (enabled: boolean) => {
    onUpdateVendor(vendor.id, {
      socialsEnabled: enabled
    });
  };

  // Save Social Link for selected Branch
  const handleAddBranchSocial = () => {
    setBranchFormError('');
    if (!selectedBranch) return;

    if (!branchFormValue.trim()) {
      setBranchFormError('Please enter a valid link or phone number.');
      return;
    }

    if (branchFormType === 'social' && !branchFormName.trim()) {
      setBranchFormError('Please provide a display name for the link.');
      return;
    }

    let finalValue = branchFormValue.trim();
    if (branchFormType === 'social') {
      const lower = finalValue.toLowerCase();
      if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
        finalValue = 'https://' + finalValue;
      }
    }

    const newSocial: SocialLink = {
      id: `soc_${Date.now()}`,
      type: branchFormType,
      value: finalValue,
      name: branchFormType === 'social' ? branchFormName.trim() : undefined
    };

    const currentSocials = selectedBranch.socials || [];
    onUpdateLocation(selectedBranch.id, {
      socials: [...currentSocials, newSocial]
    });

    // Reset Form
    setBranchFormValue('');
    setBranchFormName('');
    setBranchAutofillMsg('');
  };

  // Remove Social Link for selected Branch
  const handleRemoveBranchSocial = (id: string) => {
    if (!selectedBranch) return;
    const currentSocials = selectedBranch.socials || [];
    onUpdateLocation(selectedBranch.id, {
      socials: currentSocials.filter(s => s.id !== id)
    });
  };

  // Toggle Branch Socials Visibility
  const handleToggleBranchSocials = (enabled: boolean) => {
    if (!selectedBranch) return;
    onUpdateLocation(selectedBranch.id, {
      socialsEnabled: enabled
    });
  };

  return (
    <div className="flex-1 bg-slate-50/50 overflow-y-auto p-8 font-['Inter']">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
              <Sparkles size={14} /> Network Control Panel
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Social Channels Hub</h2>
            <p className="text-slate-500 font-semibold italic mt-1 text-sm">
              Configure unified workspace social links or set up custom branch contacts.
            </p>
          </div>
        </header>

        {/* Primary Tabs Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md">
          <button
            onClick={() => setActiveTab('brand')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${activeTab === 'brand' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Layers size={15} />
            Brand Socials
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${activeTab === 'branches' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Building2 size={15} />
            Branch Socials
          </button>
        </div>

        {/* Tab content area */}
        <AnimatePresence mode="wait">
          {activeTab === 'brand' ? (
            <motion.div
              key="brand-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-6"
            >
              <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-xl p-8 flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg leading-tight">Brand Socials configuration</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Global defaults for the entire workspace network</p>
                    </div>
                  </div>

                  {/* On / Off Visibility Switch */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${vendor.socialsEnabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {vendor.socialsEnabled ? 'Visible' : 'Hidden'}
                    </span>
                    <button
                      onClick={() => handleToggleVendorSocials(!vendor.socialsEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${vendor.socialsEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${vendor.socialsEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${vendor.socialsEnabled ? 'bg-emerald-50/20 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                  {vendor.socialsEnabled ? (
                    <>
                      <Eye size={18} className="text-emerald-500 shrink-0" />
                      <p className="text-xs font-bold leading-relaxed">
                        Brand socials are **publicly visible** and show ONLY in main co-working spaces (not branches).
                      </p>
                    </>
                  ) : (
                    <>
                      <EyeOff size={18} className="text-slate-400 shrink-0" />
                      <p className="text-xs font-semibold leading-relaxed">
                        Brand socials are currently **hidden** from customer screens.
                      </p>
                    </>
                  )}
                </div>

                {/* Active channels listing */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Brand Socials</h4>
                  {(!vendor.socials || vendor.socials.length === 0) ? (
                    <div className="py-8 border border-dashed border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center text-slate-400">
                      <Smartphone className="opacity-40 mb-1" size={24} />
                      <p className="text-xs font-bold">No global socials configured yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {vendor.socials.map((social) => (
                        <div key={social.id} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-slate-200 hover:bg-slate-50/80 transition-all">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500">
                              {social.type === 'call' && <Phone size={16} />}
                              {social.type === 'whatsapp' && <MessageCircle size={16} className="text-emerald-500" />}
                              {social.type === 'social' && <Globe size={16} className="text-blue-500" />}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                                {social.type === 'call' && 'Direct Call'}
                                {social.type === 'whatsapp' && 'WhatsApp'}
                                {social.type === 'social' && (social.name || 'Link')}
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 bg-white px-2 py-0.5 rounded-md border border-slate-100">{social.type}</span>
                              </p>
                              <p className="text-[10px] font-semibold text-slate-400 truncate mt-0.5 max-w-xs">{social.value}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveVendorSocial(social.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all"
                            title="Delete Social"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input form */}
                <div className="border-t border-slate-100 pt-6 mt-2 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add New Brand Social Connection</h4>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {(['social', 'whatsapp', 'call'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setVendorFormType(type);
                          setVendorFormError('');
                          setVendorFormValue('');
                          setVendorFormName('');
                          setVendorAutofillMsg('');
                        }}
                        className={`py-3 rounded-xl border font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${vendorFormType === type ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                      >
                        {type === 'call' && <Phone size={12} />}
                        {type === 'whatsapp' && <MessageCircle size={12} />}
                        {type === 'social' && <Globe size={12} />}
                        {type === 'social' ? 'Social Link' : type === 'whatsapp' ? 'WhatsApp' : 'Phone'}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                      {vendorFormType === 'social' ? 'Link / URL' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        {vendorFormType === 'social' ? <LinkIcon size={16} /> : <Smartphone size={16} />}
                      </div>
                      <input
                        type="text"
                        value={vendorFormValue}
                        onChange={(e) => handleUrlInputChange(
                          e.target.value, 
                          vendorFormType,
                          setVendorFormValue,
                          setVendorFormName,
                          setVendorAutofillMsg
                        )}
                        placeholder={vendorFormType === 'social' ? 'e.g. instagram.com/novaspace' : 'e.g. 155501990'}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {vendorAutofillMsg && (
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-[10px] font-bold text-blue-600 animate-in fade-in slide-in-from-top-2">
                      <Sparkles size={14} className="text-blue-500 shrink-0" />
                      <span>{vendorAutofillMsg}</span>
                    </div>
                  )}

                  {vendorFormType === 'social' && (
                    <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Display Name</label>
                      <input
                        type="text"
                        value={vendorFormName}
                        onChange={(e) => setVendorFormName(e.target.value)}
                        placeholder="e.g. Instagram, LinkedIn, Main Website"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  )}

                  {vendorFormError && (
                    <p className="text-xs font-bold text-rose-500 ml-1">{vendorFormError}</p>
                  )}

                  <button
                    onClick={handleAddVendorSocial}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-blue-100 flex items-center justify-center gap-2 mt-2"
                  >
                    <Plus size={16} /> Save Brand Socials
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="branches-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Branch Selector Dropdown Tab Menu System */}
              <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1">
                      Select Branch:
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold italic ml-1">
                      Choose which branch to view and edit social configurations for
                    </p>
                  </div>
                  
                  <div className="relative min-w-[240px]">
                    <select
                      value={activeBranchId}
                      onChange={(e) => {
                        setActiveBranchId(e.target.value);
                        setBranchFormError('');
                        setBranchFormValue('');
                        setBranchFormName('');
                        setBranchAutofillMsg('');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3.5 text-xs font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      {locations.map((loc) => {
                        const socialsCount = loc.socials?.length || 0;
                        const statusText = loc.socialsEnabled ? 'Visible' : 'Hidden';
                        return (
                          <option key={loc.id} value={loc.id}>
                            🏢 {loc.name} ({socialsCount} channels, {statusText})
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 border-l border-slate-200/60 my-2">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBranch ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-xl p-8 flex flex-col space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-lg leading-tight">
                          {selectedBranch.name} Socials
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          Configure specific, custom social settings for this location
                        </p>
                      </div>
                    </div>

                    {/* Visibility switch for selected branch tab */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${selectedBranch.socialsEnabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {selectedBranch.socialsEnabled ? 'Visible' : 'Hidden'}
                      </span>
                      <button
                        onClick={() => handleToggleBranchSocials(!selectedBranch.socialsEnabled)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${selectedBranch.socialsEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${selectedBranch.socialsEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Status Box */}
                  <div className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${selectedBranch.socialsEnabled ? 'bg-emerald-50/20 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                    {selectedBranch.socialsEnabled ? (
                      <>
                        <Eye size={18} className="text-emerald-500 shrink-0" />
                        <p className="text-xs font-bold leading-relaxed">
                          Branch-specific socials are **live** for customers viewing **{selectedBranch.name}**.
                        </p>
                      </>
                    ) : (
                      <>
                        <EyeOff size={18} className="text-slate-400 shrink-0" />
                        <p className="text-xs font-semibold leading-relaxed">
                          Branch socials are **disabled**. Socials are completely hidden for this branch.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Active Branch Socials */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {selectedBranch.name} channels
                    </h4>
                    {(!selectedBranch.socials || selectedBranch.socials.length === 0) ? (
                      <div className="py-8 border border-dashed border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center text-slate-400">
                        <Smartphone className="opacity-40 mb-1" size={24} />
                        <p className="text-xs font-bold">No branch-specific contacts configured yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedBranch.socials.map((social) => (
                          <div key={social.id} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-slate-200 hover:bg-slate-50/80 transition-all">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500">
                                {social.type === 'call' && <Phone size={16} />}
                                {social.type === 'whatsapp' && <MessageCircle size={16} className="text-emerald-500" />}
                                {social.type === 'social' && <Globe size={16} className="text-blue-500" />}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                                  {social.type === 'call' && 'Direct Call'}
                                  {social.type === 'whatsapp' && 'WhatsApp'}
                                  {social.type === 'social' && (social.name || 'Link')}
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 bg-white px-2 py-0.5 rounded-md border border-slate-100">{social.type}</span>
                                </p>
                                <p className="text-[10px] font-semibold text-slate-400 truncate mt-0.5 max-w-xs">{social.value}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveBranchSocial(social.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all"
                              title="Delete Branch Social"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add New Branch Social */}
                  <div className="border-t border-slate-100 pt-6 mt-2 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Add Custom Channel for {selectedBranch.name}
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {(['social', 'whatsapp', 'call'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setBranchFormType(type);
                            setBranchFormError('');
                            setBranchFormValue('');
                            setBranchFormName('');
                            setBranchAutofillMsg('');
                          }}
                          className={`py-3 rounded-xl border font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${branchFormType === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          {type === 'call' && <Phone size={12} />}
                          {type === 'whatsapp' && <MessageCircle size={12} />}
                          {type === 'social' && <Globe size={12} />}
                          {type === 'social' ? 'Social Link' : type === 'whatsapp' ? 'WhatsApp' : 'Phone'}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                        {branchFormType === 'social' ? 'Link / URL' : 'Phone Number'}
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {branchFormType === 'social' ? <LinkIcon size={16} /> : <Smartphone size={16} />}
                        </div>
                        <input
                          type="text"
                          value={branchFormValue}
                          onChange={(e) => handleUrlInputChange(
                            e.target.value, 
                            branchFormType,
                            setBranchFormValue,
                            setBranchFormName,
                            setBranchAutofillMsg
                          )}
                          placeholder={branchFormType === 'social' ? 'e.g. instagram.com/branchplace' : 'e.g. 14155550188'}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    {branchAutofillMsg && (
                      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[10px] font-bold text-indigo-600 animate-in fade-in slide-in-from-top-2">
                        <Sparkles size={14} className="text-indigo-500 shrink-0" />
                        <span>{branchAutofillMsg}</span>
                      </div>
                    )}

                    {branchFormType === 'social' && (
                      <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Display Name</label>
                        <input
                          type="text"
                          value={branchFormName}
                          onChange={(e) => setBranchFormName(e.target.value)}
                          placeholder="e.g. Instagram, Facebook, Contact Page"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                        />
                      </div>
                    )}

                    {branchFormError && (
                      <p className="text-xs font-bold text-rose-500 ml-1">{branchFormError}</p>
                    )}

                    <button
                      onClick={handleAddBranchSocial}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-indigo-100 flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus size={16} /> Save Branch Social
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 bg-white rounded-3xl text-center text-slate-400 border border-slate-200/80">
                  <p className="text-sm font-bold">Please select or add co-working branches first.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
