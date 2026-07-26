
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { LocationData, Vendor, Reservation, UserProfile, SocialLink } from '../types';
import { ArrowRight, MapPin, Building2, ChevronLeft, Sparkles, Navigation, Globe, CheckCircle2, ShieldCheck, Users, Search, FilterX, Check, ExternalLink, XCircle, Bot, Send, MessageSquare, Mail, MessageCircle, Phone, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAvatar } from './UserAvatar';
import { ContactUsModal } from './ContactUsModal';

interface LocationSelectionProps {
  vendor: Vendor;
  locations: LocationData[];
  onSelect: (locationId: string) => void;
  onBack: () => void;
  activeLocationId?: string;
  userRole: 'customer' | 'employee' | 'owner';
  allReservations?: Reservation[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectedCities: string[];
  setSelectedCities: (cities: string[]) => void;
  allTags: string[];
  allCities: string[];
  userName?: string;
  userProfile?: UserProfile;
  onAddLocation?: () => void;
  onDeleteLocation?: (locationId: string) => void;
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

const isMainLocation = (loc: LocationData) => {
  return loc.id === 'sf-main' || loc.id === 'ny-main' || loc.id === 'ldn-sh' || loc.id.endsWith('-hq');
};

const getActiveSocials = (loc: LocationData, vend: Vendor) => {
  // If the location has branch-specific socials configured and enabled, use them!
  if (loc.socialsEnabled !== false && loc.socials && loc.socials.length > 0) {
    return loc.socials;
  }
  
  // Otherwise, if it is the main location, fall back to showing the brand/vendor socials (working space socials)
  if (isMainLocation(loc)) {
    if (vend.socialsEnabled !== false && vend.socials && vend.socials.length > 0) {
      return vend.socials;
    }
  }
  
  return [];
};

const hasContactInfo = (loc: LocationData, vend: Vendor) => {
  const hasBranchContact = !!(loc.contactEmail || loc.contactPhone || loc.contactNotes);
  const hasSocials = getActiveSocials(loc, vend).length > 0;
  
  if (isMainLocation(loc)) {
    const hasBrandContact = !!(vend.contactEmail || vend.contactPhone || vend.contactNotes);
    return hasBrandContact || hasBranchContact || hasSocials;
  } else {
    return hasBranchContact || hasSocials;
  }
};

const LocationSelection: React.FC<LocationSelectionProps> = ({ 
  vendor, 
  locations, 
  onSelect, 
  onBack, 
  activeLocationId, 
  userRole,
  allReservations = [],
  selectedTags,
  setSelectedTags,
  selectedCities,
  setSelectedCities,
  allTags,
  allCities,
  userName,
  userProfile,
  onAddLocation,
  onDeleteLocation
}) => {
  const isStaff = userRole === 'employee' || userRole === 'owner';
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedLocation, setExpandedLocation] = useState<LocationData | null>(null);
  const [contactModalData, setContactModalData] = useState<{
    isOpen: boolean;
    title: string;
    name: string;
    email?: string;
    phone?: string;
    notes?: string;
    socials?: SocialLink[];
  }>({
    isOpen: false,
    title: '',
    name: '',
  });




  const toggleTag = (tag: string) => {
    setSelectedTags(selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag]);
  };

  const toggleCity = (city: string) => {
    setSelectedCities(selectedCities.includes(city) ? selectedCities.filter(c => c !== city) : [...selectedCities, city]);
  };

  const getLocationStats = (locationId: string) => {
    const locRes = allReservations.filter(r => r.locationId === locationId);
    const pending = locRes.filter(r => r.status === 'pending').length;
    return { total: locRes.length, pending };
  };

  const filteredLocations = useMemo(() => {
    const uniqueLocations = locations.filter((loc, index, self) => 
      index === self.findIndex((t) => t.id === loc.id)
    );

    let result = uniqueLocations;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(loc => 
        loc.name.toLowerCase().includes(query) || 
        loc.address?.toLowerCase().includes(query) ||
        loc.description?.toLowerCase().includes(query)
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter(loc => {
        const combinedTags = new Set([...(vendor.tags || []), ...(loc.tags || [])]);
        return selectedTags.every(tag => combinedTags.has(tag));
      });
    }

    if (selectedCities.length > 0) {
      result = result.filter(loc => loc.city && selectedCities.includes(loc.city));
    }


    return result;
  }, [locations, searchQuery, selectedTags, selectedCities, vendor.tags]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-['Inter'] p-8 gap-8">
      {/* Sidebar Filter - User Portal Only */}
      {!isStaff && (
        <aside className="flex flex-col shrink-0 z-20 gap-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-7 h-fit w-fit animate-in slide-in-from-left-8 duration-700">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Filter by Tags</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {allTags.length > 0 ? (
                allTags.map(tag => (
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
              )}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-7 h-fit w-fit animate-in slide-in-from-left-8 duration-700 delay-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Quick Cities</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {allCities.length > 0 ? (
                allCities.map(city => (
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
                <span className="text-xs font-bold text-slate-400 italic col-span-2">No cities available</span>
              )}
            </div>
          </div>

          {(searchQuery || selectedTags.length > 0 || selectedCities.length > 0) && (
            <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-4 animate-in fade-in slide-in-from-left-4 duration-500">
              <button 
                onClick={() => {
                  setSearchQuery('');
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
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <button 
              onClick={onBack}
              className={`flex items-center gap-2 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] transition-colors group ${isStaff ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {isStaff ? 'Switch Org' : 'Back to Networks'}
            </button>

            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workspaces..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300 shadow-sm"
              />
            </div>
            {userRole === 'owner' && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isEditMode ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'bg-white text-slate-400 border border-slate-200 hover:text-emerald-600 hover:border-emerald-200 shadow-sm'}`}
              >
                <Edit2 size={16} />
                {isEditMode ? 'Done Editing' : 'Edit Mode'}
              </button>
            )}
          </div>

          <header className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isStaff ? 'text-emerald-600' : 'text-blue-600'}`}>
                {isStaff ? 'Internal Registry' : 'Select a Branch'}
              </span>
              <div className={`h-px w-12 ${isStaff ? 'bg-emerald-200' : 'bg-blue-200'}`} />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6">
              {vendor.name} <span className="text-slate-300 font-light">{isStaff ? 'Infrastructure' : 'Ecosystem'}</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
              {isStaff 
                ? `You are currently viewing the management portal for ${vendor.name}. Select a property to access administrative controls.`
                : `We operate ${locations.length} flagship properties in this region. Select a location below to view its real-time blueprint.`}
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8">
            {filteredLocations.length > 0 ? (
              <>
              {filteredLocations.map((loc, idx) => {
                const isActive = loc.id === activeLocationId;
                const stats = getLocationStats(loc.id);
                
                return (
                  <div 
                    key={loc.id}
                    onClick={() => onSelect(loc.id)}
                    className={`group relative bg-white rounded-[3.5rem] p-10 border-2 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col md:flex-row gap-10 animate-in slide-in-from-bottom-8 ${
                      isActive 
                        ? (isStaff ? 'border-emerald-500 ring-8 ring-emerald-50' : 'border-blue-500 ring-8 ring-blue-50') 
                        : 'border-slate-100 hover:border-blue-200'
                    }`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Visual Accent */}
                    <div className={`absolute top-0 right-0 p-12 -rotate-12 pointer-events-none transition-colors ${
                      isActive ? (isStaff ? 'text-emerald-50' : 'text-blue-50') : 'text-slate-50 group-hover:text-blue-50/50'
                    }`}>
                      {isStaff ? <ShieldCheck size={180} strokeWidth={0.5} /> : <Navigation size={180} strokeWidth={0.5} />}
                    </div>

                    <div className="w-full md:w-48 h-48 shrink-0 rounded-[2.5rem] overflow-hidden shadow-inner bg-slate-100 relative">
                      {isEditMode && onDeleteLocation && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                              onDeleteLocation(loc.id);
                          }}
                          className="absolute top-2 right-2 z-20 w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                       <img 
                        src={loc.image || `https://picsum.photos/seed/${loc.id}/600/600`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={loc.name}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                       {isActive && (
                          <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[8px] font-black uppercase tracking-widest shadow-lg ${isStaff ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                            <CheckCircle2 size={10} />
                            Active Branch
                          </div>
                       )}
                       <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-[8px] font-black uppercase tracking-widest">
                         <Sparkles size={10} />
                         {isStaff ? 'Operational' : 'Verified'}
                       </div>
                    </div>

                    <div className="flex-1 flex flex-col relative z-10">
                      <div className="mb-6">
                        <h3 className={`text-3xl font-black tracking-tight leading-tight transition-colors ${
                          isActive 
                            ? (isStaff ? 'text-emerald-700' : 'text-blue-700') 
                            : 'text-slate-900 group-hover:text-blue-600'
                        }`}>
                          {loc.name}
                        </h3>
                        
                        {(loc.address || loc.mapUrl) && (
                          <div className="mt-3 flex flex-col gap-2">
                             {loc.address && (
                               <div className="flex items-start gap-2">
                                  <MapPin size={16} className="text-rose-500 mt-0.5 shrink-0" />
                                  {loc.mapUrl ? (
                                    <a 
                                      href={loc.mapUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors line-clamp-2 underline decoration-slate-200 underline-offset-4"
                                    >
                                      {loc.address}
                                    </a>
                                  ) : (
                                    <span className="text-xs font-bold text-slate-500 line-clamp-2">
                                       {loc.address}
                                    </span>
                                  )}
                               </div>
                             )}
                          </div>
                        )}

                        {hasContactInfo(loc, vendor) && (
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const isMain = isMainLocation(loc);
                                setContactModalData({
                                  isOpen: true,
                                  title: isMain ? "Main Location Support" : "Branch Support Team",
                                  name: isMain ? `${loc.name} (Main Hub)` : `${loc.name} - Direct Contact`,
                                  email: isMain ? (loc.contactEmail || vendor.contactEmail) : loc.contactEmail,
                                  phone: isMain ? (loc.contactPhone || vendor.contactPhone) : loc.contactPhone,
                                  notes: isMain ? (loc.contactNotes || vendor.contactNotes) : loc.contactNotes,
                                  socials: getActiveSocials(loc, vendor)
                                });
              {userRole === 'owner' && onAddLocation && isEditMode && (
                <button onClick={onAddLocation} className="group relative bg-white rounded-[3.5rem] p-10 border-2 border-dashed border-slate-200 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-6 animate-in slide-in-from-bottom-8 hover:border-emerald-200 hover:bg-emerald-50/50 min-h-[300px]">
                   <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-emerald-100 group-hover:text-emerald-600 shadow-inner">
                     <Plus size={40} />
                   </div>
                   <div className="text-center">
                     <span className="font-black text-2xl tracking-tight text-slate-600 group-hover:text-emerald-700 block mb-2">Add New Branch</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600/70">Initialize a new location</span>
                   </div>
                </button>
              )}
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-700 hover:underline transition-all bg-blue-50/40 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/50"
                            >
                              Contact Us
                            </button>
                          </div>
                        )}

                        {loc.tags && loc.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {loc.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                {tag}
                              </span>
                            ))}
                            {loc.tags.length > 3 && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setExpandedLocation(loc); }}
                                className="px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[8px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-100 transition-colors"
                              >
                                +{loc.tags.length - 3} More
                              </button>
                            )}
                          </div>
                        )}

                        {isStaff && (
                          <div className="mt-4 flex gap-3">
                            <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                              <Users size={12} className="text-slate-400" />
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{stats.total} Reservations</span>
                            </div>
                            {stats.pending > 0 && (
                              <div className="px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">{stats.pending} Pending</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className={`mt-auto flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-5 transition-all ${
                        isStaff ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {isStaff ? 'Initialize Management Console' : 'Open Interactive Blueprint'}
                        <ArrowRight size={16} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {userRole === 'owner' && onAddLocation && isEditMode && (
                <button onClick={onAddLocation} className="group relative bg-white rounded-[3.5rem] p-10 border-2 border-dashed border-slate-200 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-6 animate-in slide-in-from-bottom-8 hover:border-emerald-200 hover:bg-emerald-50/50 min-h-[300px]">
                   <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-emerald-100 group-hover:text-emerald-600 shadow-inner">
                     <Plus size={40} />
                   </div>
                   <div className="text-center">
                     <span className="font-black text-2xl tracking-tight text-slate-600 group-hover:text-emerald-700 block mb-2">Add New Branch</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600/70">Initialize a new location</span>
                   </div>
                </button>
              )}
              </>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-6">
                  <Search size={40} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">No Workspaces Found</h4>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Try adjusting your search or filters</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-8 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-slate-100"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {!isStaff && !searchQuery && (
              <div className="border-4 border-dashed border-slate-100 rounded-[3.5rem] p-10 flex flex-col items-center justify-center text-center group hover:bg-slate-100/50 hover:border-blue-200 transition-all cursor-default">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-200 group-hover:bg-white group-hover:text-blue-500 group-hover:shadow-lg transition-all">
                    <Building2 size={32} />
                </div>
                <p className="text-xl font-black text-slate-300 group-hover:text-slate-400 transition-colors">Expansion Coming Soon</p>
                <p className="text-sm font-bold text-slate-300 mt-2 px-12">New properties in this region are currently under architectural review.</p>
              </div>
            )}
          </div>

          <footer className="mt-24 pt-10 border-t border-slate-200 text-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Global Property Management Console v2.5</p>
          </footer>
        </div>
      </div>

      {/* Expanded Location Modal */}
      <AnimatePresence>
        {expandedLocation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setExpandedLocation(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <button 
                onClick={() => setExpandedLocation(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-colors"
              >
                <XCircle size={20} />
              </button>
              
              <div className="h-72 relative overflow-hidden shrink-0 bg-slate-100">
                <img 
                  src={expandedLocation.image || `https://picsum.photos/seed/${expandedLocation.id}/600/600`} 
                  alt={expandedLocation.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={12} />
                  {isStaff ? 'Operational' : 'Verified'}
                </div>
              </div>

              <div className="p-10 flex flex-col flex-1">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">{expandedLocation.name}</h3>
                
                {(expandedLocation.address || expandedLocation.mapUrl) && (
                  <div className="mb-8 flex items-start gap-3">
                    <MapPin size={20} className="text-rose-500 mt-0.5 shrink-0" />
                    {expandedLocation.mapUrl ? (
                      <a 
                        href={expandedLocation.mapUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors underline decoration-slate-200 underline-offset-4"
                      >
                        {expandedLocation.address}
                      </a>
                    ) : (
                      <span className="text-sm font-bold text-slate-500">
                        {expandedLocation.address}
                      </span>
                    )}
                  </div>
                )}

                {/* All Tags Display */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {(expandedLocation.tags || []).map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={() => {
                      onSelect(expandedLocation.id);
                      setExpandedLocation(null);
                    }}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-600 transition-colors group"
                  >
                    {isStaff ? 'Manage Infrastructure' : 'View Blueprint'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

              {userRole === 'owner' && onAddLocation && isEditMode && (
                <button onClick={onAddLocation} className="group relative bg-white rounded-[3.5rem] p-10 border-2 border-dashed border-slate-200 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-6 animate-in slide-in-from-bottom-8 hover:border-emerald-200 hover:bg-emerald-50/50 min-h-[300px]">
                   <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-emerald-100 group-hover:text-emerald-600 shadow-inner">
                     <Plus size={40} />
                   </div>
                   <div className="text-center">
                     <span className="font-black text-2xl tracking-tight text-slate-600 group-hover:text-emerald-700 block mb-2">Add New Branch</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600/70">Initialize a new location</span>
                   </div>
                </button>
              )}

      {/* Reusable elegant Contact Us Popup */}
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

export default LocationSelection;
