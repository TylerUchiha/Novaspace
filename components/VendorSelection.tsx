
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Vendor, LocationData, UserProfile } from '../types';
import { Building2, ArrowRight, MapPin, Search, XCircle, ChevronLeft, Plus, Inbox, Check, FilterX, Bot, Send, Sparkles, Mail, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAvatar } from './UserAvatar';
import { ContactUsModal } from './ContactUsModal';

interface VendorSelectionProps {
  vendors: Vendor[];
  locations: LocationData[];
  onSelect: (vendor: Vendor) => void;
  onBack: () => void;
  userRole: string;
  onCreateSpace?: () => void;
  onDeleteVendor?: (vendorId: string) => void;
  onShowPrivacy?: () => void;
  onShowTerms?: () => void;
  onShowSupport?: () => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectedCities: string[];
  setSelectedCities: (cities: string[]) => void;
  allTags: string[];
  allCities: string[];
  userName?: string;
  userProfile?: UserProfile;
}

const getProfessionGreeting = (name?: string, profession?: string): string => {
  const firstName = name ? name.split(' ')[0] : '';
  const normProf = (profession || '').toLowerCase().trim();
  
  if (normProf.includes('doctor') || normProf.includes('dr.') || normProf.includes('physician') || normProf.includes('dentist')) {
    return firstName ? `Hey Dr. ${firstName}` : 'Hey doc';
  }
  if (normProf.includes('teacher') || normProf.includes('professor') || normProf.includes('educator')) {
    return firstName ? `Hey Professor ${firstName}` : 'Hey teach';
  }
  if (normProf.includes('engineer') || normProf.includes('architect')) {
    return firstName ? `Hey Engineer ${firstName}` : 'Hey builder';
  }
  if (normProf.includes('developer') || normProf.includes('coder') || normProf.includes('programmer') || normProf.includes('software')) {
    return firstName ? `Hey Coder ${firstName}` : 'Hey dev';
  }
  if (normProf.includes('designer') || normProf.includes('artist') || normProf.includes('creative')) {
    return firstName ? `Hey Designer ${firstName}` : 'Hey creative';
  }
  if (normProf.includes('chef') || normProf.includes('cook') || normProf.includes('baker')) {
    return firstName ? `Hey Chef ${firstName}` : 'Hey chef';
  }
  
  return firstName ? `Hey ${firstName}` : 'Hey there';
};

const VendorSelection: React.FC<VendorSelectionProps> = ({ 
  vendors, 
  locations,
  onSelect, 
  onBack, 
  userRole, 
  onCreateSpace,
  onDeleteVendor,
  onShowPrivacy,
  onShowTerms,
  onShowSupport,
  selectedTags,
  setSelectedTags,
  selectedCities,
  setSelectedCities,
  allTags,
  allCities,
  userName,
  userProfile
}) => {
  const isStaff = userRole === 'employee' || userRole === 'owner';
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedVendor, setExpandedVendor] = useState<Vendor | null>(null);

  // Contact modal state
  const [contactModalData, setContactModalData] = useState<{
    isOpen: boolean;
    title: string;
    name: string;
    email?: string;
    phone?: string;
    notes?: string;
    socials?: any[];
  }>({
    isOpen: false,
    title: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    socials: []
  });




  const toggleTag = (tag: string) => {
    setSelectedTags(selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag]);
  };

  const toggleCity = (city: string) => {
    setSelectedCities(selectedCities.includes(city) ? selectedCities.filter(c => c !== city) : [...selectedCities, city]);
  };

  const filteredVendors = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let result = vendors;
    
    if (query) {
      result = result.filter(vendor => 
        vendor.name.toLowerCase().includes(query) || 
        vendor.description.toLowerCase().includes(query)
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter(vendor => {
        const vendorLocations = locations.filter(loc => loc.vendorId === vendor.id);
        const vendorTags = new Set<string>(vendor.tags || []);
        vendorLocations.forEach(loc => loc.tags?.forEach(t => vendorTags.add(t)));
        return selectedTags.every(tag => vendorTags.has(tag));
      });
    }

    if (selectedCities.length > 0) {
      result = result.filter(vendor => {
        const vendorLocations = locations.filter(loc => loc.vendorId === vendor.id);
        return vendorLocations.some(loc => loc.city && selectedCities.includes(loc.city));
      });
    }

    
    // Deduplicate by ID to prevent React key warnings if state has duplicates
    const uniqueVendors: typeof result = [];
    const seen = new Set<string>();
    for (const v of result) {
      if (!seen.has(v.id)) {
        seen.add(v.id);
        uniqueVendors.push(v);
      }
    }
    
    return uniqueVendors;
  }, [searchQuery, vendors, selectedTags, selectedCities, locations]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-['Inter'] p-8 gap-8">
      {/* Sidebar Filter - User Portal Only */}
      {userRole === 'customer' && (
        <aside className="flex flex-col shrink-0 z-20 gap-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-7 h-fit w-fit animate-in slide-in-from-left-8 duration-700">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Filter by Tags</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {(() => {
                const availableTags = new Map();
                vendors.forEach(v => {
                  const vLocs = locations.filter(l => l.vendorId === v.id);
                  
                  // Check if this vendor matches text search
                  const query = searchQuery.toLowerCase().trim();
                  let matchesSearch = true;
                  if (query) {
                    matchesSearch = v.name.toLowerCase().includes(query) || v.description.toLowerCase().includes(query);
                  }
                  
                  // Check if this vendor matches selected cities
                  let matchesCities = true;
                  if (selectedCities.length > 0) {
                    const vCities = new Set();
                    vLocs.forEach(l => { if (l.city) vCities.add(l.city.trim().toLowerCase()); });
                    matchesCities = selectedCities.some(c => vCities.has(c.trim().toLowerCase()));
                  }
                  
                  // If it matches search and cities, its tags are "available"
                  if (matchesSearch && matchesCities) {
                    v.tags?.forEach(t => {
                      if(t) availableTags.set(t.trim().toLowerCase(), t.trim());
                    });
                    vLocs.forEach(l => {
                      l.tags?.forEach(t => {
                        if(t) availableTags.set(t.trim().toLowerCase(), t.trim());
                      });
                    });
                  }
                });
                
                // Always include currently selected tags even if they would lead to 0 results, so user can uncheck them
                selectedTags.forEach(t => {
                  if (t) availableTags.set(t.trim().toLowerCase(), t.trim());
                });
                
                const finalTags = Array.from(availableTags.values()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                
                return finalTags.length > 0 ? (
                  finalTags.map((tag: string) => (
                  <label key={tag} className="flex items-center gap-3 group cursor-pointer whitespace-nowrap">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                      />
                      <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" size={12} strokeWidth={4} />
                    </div>
                    <span className={`text-sm font-bold transition-colors ${selectedTags.includes(tag) ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
                      {tag}
                    </span>
                  </label>
                ))
                ) : (
                  <span className="text-xs font-bold text-slate-400 italic col-span-2">No tags available</span>
                );
              })()}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-7 h-fit w-fit animate-in slide-in-from-left-8 duration-700 delay-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Quick Cities</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {(() => {
                const availableCities = new Map();
                vendors.forEach(v => {
                  const vLocs = locations.filter(l => l.vendorId === v.id);
                  
                  // Check if this vendor matches text search
                  const query = searchQuery.toLowerCase().trim();
                  let matchesSearch = true;
                  if (query) {
                    matchesSearch = v.name.toLowerCase().includes(query) || v.description.toLowerCase().includes(query);
                  }
                  
                  // Check if this vendor matches selected tags
                  let matchesTags = true;
                  if (selectedTags.length > 0) {
                    const vTags = new Set((v.tags || []).map(t => t.trim().toLowerCase()));
                    vLocs.forEach(l => l.tags?.forEach(t => vTags.add(t.trim().toLowerCase())));
                    matchesTags = selectedTags.every(t => vTags.has(t.trim().toLowerCase()));
                  }
                  
                  if (matchesSearch && matchesTags) {
                    vLocs.forEach(l => {
                      if (l.city) availableCities.set(l.city.trim().toLowerCase(), l.city.trim());
                    });
                  }
                });
                
                selectedCities.forEach(c => {
                  if (c) availableCities.set(c.trim().toLowerCase(), c.trim());
                });
                
                const finalCities = Array.from(availableCities.values()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                
                return finalCities.length > 0 ? (
                  finalCities.map((city: string) => (
                  <label key={city} className="flex items-center gap-3 group cursor-pointer whitespace-nowrap">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox"
                        checked={selectedCities.includes(city)}
                        onChange={() => toggleCity(city)}
                        className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                      />
                      <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" size={12} strokeWidth={4} />
                    </div>
                    <span className={`text-sm font-bold transition-colors ${selectedCities.includes(city) ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
                      {city}
                    </span>
                  </label>
                ))
                ) : (
                  <span className="text-xs font-bold text-slate-400 italic col-span-2">No tags available</span>
                );
              })()}
            </div>
          </div>

          {(selectedTags.length > 0 || selectedCities.length > 0) && (
            <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-4 animate-in fade-in slide-in-from-left-4 duration-500">
              <button 
                onClick={() => {
                  setSelectedTags([]);
                  setSelectedCities([]);
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all flex items-center gap-3"
              >
                <FilterX size={16} />
                Clear All Filters
              </button>
            </div>
          )}
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-white rounded-[4rem] shadow-2xl border border-slate-100 p-8 lg:p-16 animate-in fade-in duration-700">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-colors group text-slate-400"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>



          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                Where would you like to <span className="text-blue-600 italic">Work</span> today?
              </h2>
              <p className="text-lg text-slate-500 font-medium mt-4 max-w-xl">
                Choose one of our premium partner networks to access their specific property layouts and member services.
              </p>
              
              <div className="mt-8 flex items-center gap-4">
                {userRole === 'owner' && (
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isEditMode ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-200 hover:text-blue-600 hover:border-blue-200 shadow-sm'}`}
                  >
                    <Edit2 size={16} />
                    {isEditMode ? 'Done Editing' : 'Edit Mode'}
                  </button>
                )}
              </div>
            </div>
          </header>

          {filteredVendors.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredVendors.map((vendor) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3 }}
                    key={vendor.id}
                    onClick={() => onSelect(vendor)}
                    className="group bg-white rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
                  >
                    <div className="h-56 relative overflow-hidden">
                      {isEditMode && onDeleteVendor && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                              onDeleteVendor(vendor.id);
                          }}
                          className="absolute top-4 right-4 z-10 w-10 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <img 
                        src={vendor.logo} 
                        alt={vendor.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>

                    <div className="p-10 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{vendor.name}</h3>
                        <div className={`p-2 rounded-xl bg-blue-50 text-blue-600`}>
                          <Building2 size={20} />
                        </div>
                      </div>
                      
                      <p className="text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                        {vendor.description}
                      </p>

                      {/* Tags Display */}
                      <div className="flex flex-wrap gap-1.5 mb-8">
                        {(vendor.tags || []).slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            {tag}
                          </span>
                        ))}

                        {(vendor.tags || []).length > 3 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setExpandedVendor(vendor); }}
                            className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-[8px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-100 transition-colors"
                          >
                            +{(vendor.tags || []).length - 3} More
                          </button>
                        )}
                        {(!vendor.tags || vendor.tags.length === 0) && (
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">No brand tags</span>
                        )}
                      </div>

                      {/* Contact Us Hyperlink */}
                      {(vendor.contactEmail || vendor.contactPhone || (vendor.socialsEnabled && vendor.socials && vendor.socials.length > 0)) && (
                        <div className="mb-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setContactModalData({
                                isOpen: true,
                                title: "Brand Support Team",
                                name: `${vendor.name} - Direct Contact`,
                                email: vendor.contactEmail,
                                phone: vendor.contactPhone,
                                notes: vendor.contactNotes,
                                socials: vendor.socialsEnabled ? vendor.socials : []
                              });
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-700 hover:underline transition-all bg-blue-50/40 hover:bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-100/50"
                          >
                            Contact Us
                          </button>
                        </div>
                      )}

                      <div className="mt-auto">
                        <div className="flex items-center gap-8 mb-8">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Locations</p>
                            <div className="flex items-center gap-2 text-slate-900 font-black">
                              <MapPin size={14} className="text-blue-500" />
                              {vendor.locationCount} Cities
                            </div>
                          </div>
                          <div className="h-10 w-[1px] bg-slate-100" />
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access</p>
                            <div className="flex items-center gap-2 text-slate-900 font-black">
                              {vendor.access || 'Full 24/7'}
                            </div>
                          </div>
                        </div>

                        <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-600 transition-colors">
                          Enter Workspace
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

              </AnimatePresence>

              {!searchQuery && selectedTags.length === 0 && userRole !== 'customer' && isEditMode && (
                <motion.div layout onClick={onCreateSpace} className="border-4 border-dashed border-blue-200 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center group hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer">
                   <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-6 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Plus size={32} />
                   </div>
                   <p className="text-xl font-black text-blue-900">Create New Space</p>
                   <p className="text-sm font-bold text-blue-600/60 mt-2">Add a new workspace location to the network.</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-center mb-8 text-slate-200">
                <Inbox size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">No matching workspaces found</h3>
              <p className="text-slate-500 font-medium max-w-sm mb-8">
                We couldn't find any locations matching your current filters.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
                className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-colors shadow-xl"
              >
                Clear Search
              </button>
            </div>
          )}

          <footer className="mt-20 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2025 NOVASPACE WORLDWIDE ECOSYSTEM</p>
             <div className="flex items-center gap-8">
                <button onClick={onShowPrivacy} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Privacy</button>
                <button onClick={onShowTerms} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Terms</button>
                <button onClick={onShowSupport} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Support</button>
             </div>
          </footer>
        </div>
      </div>

      {/* Expanded Vendor Modal */}
      <AnimatePresence>
        {expandedVendor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setExpandedVendor(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <button 
                onClick={() => setExpandedVendor(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-colors"
              >
                <XCircle size={20} />
              </button>
              
              <div className="h-72 relative overflow-hidden shrink-0">
                <img 
                  src={expandedVendor.logo} 
                  alt={expandedVendor.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{expandedVendor.name}</h3>
                  <div className={`p-3 rounded-2xl bg-blue-50 text-blue-600`}>
                    <Building2 size={24} />
                  </div>
                </div>
                
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                  {expandedVendor.description}
                </p>

                {/* All Tags Display */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {(expandedVendor.tags || []).map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}

                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-8 mb-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Locations</p>
                      <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
                        <MapPin size={16} className="text-blue-500" />
                        {expandedVendor.locationCount} Cities
                      </div>
                    </div>
                    <div className="h-12 w-[1px] bg-slate-100" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access</p>
                      <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
                        {expandedVendor.access || 'Full 24/7'}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      onSelect(expandedVendor);
                      setExpandedVendor(null);
                    }}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-600 transition-colors group"
                  >
                    Enter Workspace
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Us popup modal for Brand Socials */}
      <ContactUsModal
        isOpen={contactModalData.isOpen}
        onClose={() => setContactModalData(prev => ({ ...prev, isOpen: false }))}
        title={contactModalData.title}
        name={contactModalData.name}
        email={contactModalData.email}
        phone={contactModalData.phone}
        notes={contactModalData.notes}
        socials={contactModalData.socials}
      />
    </div>
  );
};

export default VendorSelection;
