import GlobalConfigPage from "./components/GlobalConfigPage";
import ClockInAccessPage from "./components/ClockInAccessPage";
import WorkingTimesPage from "./components/WorkingTimesPage";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Room, RoomStatus, Reservation, UserProfile, Vendor, Floor, LocationData, Employee } from './types';
import { LOCATIONS, ROOM_COLORS, INITIAL_RESERVATIONS, VENDORS } from './constants';
import RoomDetail from './components/RoomDetail';
import LandingPage from './components/LandingPage';
import VendorSelection from './components/VendorSelection';
import LocationSelection from './components/LocationSelection';
import EmployeeDashboard from './components/EmployeeDashboard';
import PropertyConfig from './components/PropertyConfig';
import ProfilePage from './components/ProfilePage';
import CreateSpacePage from './components/CreateSpacePage';
import MyBookingsPage from './components/MyBookingsPage';
import MenuConfig from './components/MenuConfig';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PaymentAnalytics from './components/PaymentAnalytics';
import ClockInPage from './components/ClockInPage';
import ShiftRegistryDashboard from './components/ShiftRegistryDashboard';
import StaffAnalytics from './components/StaffAnalytics';
import StoreAnalytics from './components/StoreAnalytics';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import SupportPage from './components/SupportPage';
import FAQManagement from './components/FAQManagement';
import PolicyManagement from './components/PolicyManagement';
import { Shield, Scale } from 'lucide-react';
import APIStatusPage from './components/APIStatusPage';
import { CancellationPoliciesPage } from './components/CancellationPoliciesPage';
import { SocialsConfig } from './components/SocialsConfig';
import WelcomePage from './components/WelcomePage';
import { Building, Building2, Crown, ArrowLeft, Map as MapIcon, LogOut, ShieldCheck, Settings, Eye, X, Plus, Search, User, Check, CheckCircle2, Mail, ChevronLeft, Globe, Calendar, Wallet, Coins, Utensils, ShoppingCart, BarChart3, AlertCircle, Clock, KeyRound, Ban, Star, Layout, CreditCard, Edit, Banknote, Upload, Store, DollarSign, Users , LifeBuoy } from 'lucide-react';

import { useAuth } from './components/AuthProvider';

const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

const App: React.FC = () => {
  const { user, userProfile, loading, signIn, signOut, updateUserProfile } = useAuth();
  const setUserProfile = updateUserProfile;
  const isLoggedIn = !!user;
  const userRole = (userProfile?.role as 'customer' | 'employee' | 'owner' | 'manager') || null;
  const isStaff = userRole === 'employee' || userRole === 'manager' || userRole === 'owner';


  const [privacySections, setPrivacySections] = useState<{title: string, content: string}[]>(() => {
    const saved = localStorage.getItem('novaspace_privacy');
    if (saved) return JSON.parse(saved);
    return [
    { title: "Data Collection", content: "We collect information that you provide directly to us, such as when you create an account, make a booking, or contact support. This may include your name, email address, phone number, and payment information." },
    { title: "How We Use Data", content: "We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about your bookings and account." },
    { title: "Data Security", content: "We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information." }
  ];
  });

  useEffect(() => {
    localStorage.setItem('novaspace_privacy', JSON.stringify(privacySections));
  }, [privacySections]);

  const [termsSections, setTermsSections] = useState<{title: string, content: string}[]>(() => {
    const saved = localStorage.getItem('novaspace_terms');
    if (saved) return JSON.parse(saved);
    return [
    { title: "Agreement to Terms", content: "By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site." },
    { title: "User Responsibilities", content: "You agree to use our workspaces and facilities in a respectful manner, adhering to all posted rules and guidelines. You are responsible for any damage caused to the facilities or equipment during your booking." },
    { title: "Cancellation Policy", content: "Bookings must be cancelled at least 24 hours in advance for a full refund. Cancellations made less than 24 hours before the booking start time may be subject to a cancellation fee." }
  ];
  });

  useEffect(() => {
    localStorage.setItem('novaspace_terms', JSON.stringify(termsSections));
  }, [termsSections]);

  const [faqs, setFaqs] = useState<{q: string, a: string}[]>(() => {
    const saved = localStorage.getItem('novaspace_faqs');
    if (saved) return JSON.parse(saved);
    return [
    { q: "How do I book a workspace?", a: "Simply browse our locations, select your preferred branch, and use the interactive blueprint to pick your space and time slot." },
    { q: "Can I cancel my reservation?", a: "Yes, you can cancel your reservation through your profile dashboard up to 24 hours in advance. For enterprise bookings, please consult your account manager." },
    { q: "What amenities are included?", a: "Standard access includes high-speed Wi-Fi, premium coffee, printing services, and access to common lounge areas. Premium tier members receive priority access to private acoustic booths." },
    { q: "Do you offer team subscriptions?", a: "Absolutely. Our enterprise tier allows you to manage multiple members under a unified billing cycle with customizable access controls." },
    { q: "Are pets allowed in the workspaces?", a: "Pet policies vary by location. Please check the specific branch details page to see if they are pet-friendly." }
  ];
  });

  useEffect(() => {
    localStorage.setItem('novaspace_faqs', JSON.stringify(faqs));
  }, [faqs]);

  const [allVendors, setAllVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('nova_all_vendors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return VENDORS;
  });

  useEffect(() => {
    localStorage.setItem('nova_all_vendors', JSON.stringify(allVendors));
  }, [allVendors]);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(() => {
    const stored = localStorage.getItem('nova_selected_vendor_id');
    if (stored) {
      const savedVendors = localStorage.getItem('nova_all_vendors');
      let currentVendors = VENDORS;
      if (savedVendors) {
        try {
          currentVendors = JSON.parse(savedVendors);
        } catch (e) {}
      }
      const found = currentVendors.find(v => v.id === stored);
      return found || null;
    }
    return null;
  });
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(() => {
    return localStorage.getItem('nova_is_location_confirmed') === 'true';
  });
  const [favoritedRooms, setFavoritedRooms] = useState<string[]>([]);
  
  // New: Sub-tab state for configuration
  const [configView, setConfigView] = useState<'layout' | 'brand' | 'branch' | 'tags' | 'space_properties'>('layout');
const [codeEditModal, setCodeEditModal] = useState<{ type: 'master' | 'branch', id: string, currentCode: string } | null>(null);
  const [postLoginAction, setPostLoginAction] = useState<any>('welcome');
  const [codeLoginType, setCodeLoginType] = useState<'single' | 'all' | 'global' | null>(() => {
    return (localStorage.getItem('nova_code_login_type') as any) || null;
  });

  useEffect(() => {
    if (codeLoginType) {
      localStorage.setItem('nova_code_login_type', codeLoginType);
    } else {
      localStorage.removeItem('nova_code_login_type');
    }
  }, [codeLoginType]);


  const [allEmployees, setAllEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('nova_all_employees');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    const now = Date.now();
    const threeHoursAgo = now - 3 * 3600 * 1000;
    const eightHoursAgo = now - 8 * 3600 * 1000;
    return [
      { 
        id: 'e1', 
        name: 'James Wilson', 
        phone: '555-1001', 
        pfp: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200', 
        pinCode: '1111', 
        shifts: [
          {
            id: 'shift-1',
            startTime: eightHoursAgo,
            endTime: threeHoursAgo,
            breaks: [{ start: eightHoursAgo + 2 * 3600 * 1000, end: eightHoursAgo + 3 * 3600 * 1000 }],
            clockOutPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=600'
          }
        ] 
      },
      { 
        id: 'e2', 
        name: 'Maria Garcia', 
        phone: '555-1002', 
        pfp: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200', 
        pinCode: '2222', 
        shifts: [
          {
            id: 'shift-2',
            startTime: eightHoursAgo + 3600 * 1000,
            endTime: now - 3600 * 1000,
            breaks: [],
            clockOutPhoto: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600&h=600'
          }
        ] 
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nova_all_employees', JSON.stringify(allEmployees));
  }, [allEmployees]);

  const [allUsers, setAllUsers] = useState<UserProfile[]>([
    { name: 'Alex Rivera', role: 'Member', email: 'alex.rivera@novaspace.ai', pfp: `https://picsum.photos/400/400?seed=AlexRivera`, phone: '555-0123', credits: 2500, paymentMethods: [{ id: '1', type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true, name: 'Personal Card' }, { id: '2', type: 'Mastercard', last4: '8888', expiry: '08/26', isDefault: false, name: 'Company Expense' }], profession: 'Doctor' },
    { name: 'Sarah Chen', role: 'Premium', email: 'sarah.c@zenith.com', pfp: `https://picsum.photos/400/400?seed=SarahChen`, phone: '555-7890', credits: 12000, paymentMethods: [], profession: 'Artist' },
    { name: 'Jordan Hayes', role: 'Member', email: 'jordan.h@startup.io', pfp: `https://picsum.photos/400/400?seed=Jordan`, phone: '555-4321', credits: 450, paymentMethods: [], profession: 'Engineer' }
  ]);

  const [allLocations, setAllLocations] = useState<LocationData[]>(() => {
    const saved = localStorage.getItem('nova_all_locations_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return LOCATIONS;
  });

  useEffect(() => {
    localStorage.setItem('nova_all_locations_v3', JSON.stringify(allLocations));
  }, [allLocations]);

  const [allReservations, setAllReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('nova_all_reservations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_RESERVATIONS;
  });

  useEffect(() => {
    localStorage.setItem('nova_all_reservations', JSON.stringify(allReservations));
  }, [allReservations]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const allGlobalTags = useMemo(() => {
    const tags = new Set<string>();
    allVendors.forEach(v => v.tags?.forEach(t => tags.add(t)));
    allLocations.forEach(loc => {
      loc.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allLocations, allVendors]);

  const allGlobalCities = useMemo(() => {
    const cities = new Set<string>();
    allLocations.forEach(loc => {
      if (loc.city) cities.add(loc.city);
    });
    return Array.from(cities).sort();
  }, [allLocations]);

  const vendorLocations = useMemo(() => allLocations.filter(loc => loc.vendorId === selectedVendor?.id), [allLocations, selectedVendor]);
  const [currentLocationId, setCurrentLocationId] = useState(() => {
    return localStorage.getItem('nova_current_location_id') || '';
  });
  const [currentFloorId, setCurrentFloorId] = useState(() => {
    return localStorage.getItem('nova_current_floor_id') || '';
  });
  
  const currentLocation = useMemo(() => vendorLocations.find(l => l.id === currentLocationId) || vendorLocations[0], [currentLocationId, vendorLocations]);
  const currentFloor = useMemo(() => currentLocation?.floors.find(f => f.id === currentFloorId) || currentLocation?.floors[0], [currentFloorId, currentLocation]);

  useEffect(() => {
    if (currentLocationId) {
      // Refresh IDs if the current ones are no longer valid for the selected vendor
      const currentLoc = vendorLocations.find(l => l.id === currentLocationId);
      if (!currentLoc) {
          setCurrentLocationId(vendorLocations[0]?.id || '');
          setCurrentFloorId(vendorLocations[0]?.floors[0]?.id || '');
      }
    } else if (vendorLocations.length > 0) {
      setCurrentLocationId(vendorLocations[0].id);
      setCurrentFloorId(vendorLocations[0].floors[0]?.id || '');
    }
  }, [vendorLocations, currentLocationId]);

  const [activeTab, setActiveTab] = useState<'global_settings' | 'clock_in_access' | 'blueprint' | 'staff_registry' | 'staff_registry_approved' | 'staff_registry_cancelled' | 'property_config' | 'menu_config' | 'analytics' | 'profile' | 'my_bookings' | 'credits' | 'staff_management' | 'cancellation_policies' | 'socials_config' | 'service_menu' | 'clock_in' | 'staff_analytics' | 'store_analytics'>('blueprint');
  const [isClockInEnabled, setIsClockInEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('nova_clock_in_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('nova_clock_in_enabled', isClockInEnabled ? 'true' : 'false');
  }, [isClockInEnabled]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeInput, setTimeInput] = useState("09:00");
  const [timeOffsetSeconds, setTimeOffsetSeconds] = useState(0);
  const [timePeriod, setTimePeriod] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    setTimeOffsetSeconds(0);
  }, [selectedDate, timeInput, timePeriod]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOffsetSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const [bookingDuration, setBookingDuration] = useState(0);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [basketComments, setBasketComments] = useState<Record<string, string>>({});
  const [basketDeliveryTimes, setBasketDeliveryTimes] = useState<Record<string, string>>({});
  const [totalOrderComment, setTotalOrderComment] = useState("");
  const [isReviewMenuOpen, setIsReviewMenuOpen] = useState(false);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [activeServiceCategory, setActiveServiceCategory] = useState<string | null>(null);
  const [menuSource, setMenuSource] = useState<{ type: 'global' | 'branch' | 'room', id?: string }>({ type: 'global' });
  const [branchCredentialsSearchQuery, setBranchCredentialsSearchQuery] = useState("");

  useEffect(() => {
    if (selectedVendor) {
      localStorage.setItem('nova_selected_vendor_id', selectedVendor.id);
    } else {
      localStorage.removeItem('nova_selected_vendor_id');
    }
  }, [selectedVendor]);

  useEffect(() => {
    localStorage.setItem('nova_is_location_confirmed', isLocationConfirmed ? 'true' : 'false');
  }, [isLocationConfirmed]);

  useEffect(() => {
    if (currentLocationId) {
      localStorage.setItem('nova_current_location_id', currentLocationId);
    } else {
      localStorage.removeItem('nova_current_location_id');
    }
  }, [currentLocationId]);

  useEffect(() => {
    if (currentFloorId) {
      localStorage.setItem('nova_current_floor_id', currentFloorId);
    } else {
      localStorage.removeItem('nova_current_floor_id');
    }
  }, [currentFloorId]);

  useEffect(() => {
    setBasket({});
    setBasketComments({});
    setBasketDeliveryTimes({});
    setTotalOrderComment("");
  }, [currentLocationId]);

  useEffect(() => {
    if (userRole === 'employee') setActiveTab('staff_registry');
    else if (userRole === 'owner') setActiveTab('property_config');
    else if (userRole === 'manager') setActiveTab('menu_config');
    else setActiveTab('blueprint');
  }, [userRole]);

  const selectedTime24h = useMemo(() => {
    const parts = timeInput.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    if (isNaN(hours)) hours = 9; if (isNaN(minutes)) minutes = 0;
    let h24 = hours % 12;
    if (timePeriod === "PM") h24 += 12;
    if (timePeriod === "AM" && hours === 12) h24 = 0;
    return `${h24.toString().padStart(2, '0')}:${(minutes || 0).toString().padStart(2, '0')}`;
  }, [timeInput, timePeriod]);

  const simulatedTimeMs = useMemo(() => {
    try {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const [hour, min] = selectedTime24h.split(':').map(Number);
      return new Date(year, month - 1, day, hour, min).getTime();
    } catch {
      return Date.now();
    }
  }, [selectedDate, selectedTime24h]);

  const displayTime12h = useMemo(() => {
    const parts = timeInput.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    if (isNaN(hours)) hours = 9; if (isNaN(minutes)) minutes = 0;
    let hDisplay = hours;
    if (hDisplay === 0) hDisplay = 12;
    if (hDisplay > 12) hDisplay = hDisplay % 12 || 12;
    return `${hDisplay}:${(minutes || 0).toString().padStart(2, '0')} ${timePeriod}`;
  }, [timeInput, timePeriod]);

  const deliveryTimeOptions = useMemo(() => {
    const options = ["At start of reservation"];
    for (let i = 15; i < bookingDuration * 60; i += 15) {
      if (i < 60) {
        options.push(`${i} mins into reservation`);
      } else {
        const hours = Math.floor(i / 60);
        const mins = i % 60;
        const hourText = hours === 1 ? "1h" : `${hours}h`;
        if (mins === 0) {
          options.push(`${hourText} into reservation`);
        } else {
          options.push(`${hourText} ${mins} min into reservation`);
        }
      }
    }
    options.push("At end of reservation");
    return options;
  }, [bookingDuration]);

  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
  const [reservationTimer, setReservationTimer] = useState<number | null>(null);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  // Reservation Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (reservationTimer !== null && reservationTimer > 0) {
      interval = setInterval(() => {
        setReservationTimer(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (reservationTimer === 0) {
      setSelectedRoomIds([]);
      setReservationTimer(null);
      setBookingError("Reservation time expired. Please re-select.");
      setTimeout(() => setBookingError(null), 5000);
    }
    return () => clearInterval(interval);
  }, [reservationTimer]);

  useEffect(() => {
    if (selectedRoomIds.length > 0 && userRole === 'customer') {
      if (reservationTimer === null) {
        setReservationTimer(60); // 1 minute
      }
    } else {
      setReservationTimer(null);
    }
  }, [selectedRoomIds, userRole]);

  useEffect(() => {
    if (selectedRoomIds.length === 1) {
      setMenuSource({ type: 'room', id: selectedRoomIds[0] });
    } else {
      setMenuSource({ type: 'branch', id: currentLocationId });
    }
  }, [selectedRoomIds, currentLocationId]);

  const floorsWithExpiringRooms = useMemo(() => {
    if (!currentLocation) return [];
    const selectedSeconds = timeToMinutes(selectedTime24h) * 60 + timeOffsetSeconds;
    const expiringFloorIds = new Set<string>();
    
    allReservations.forEach(r => {
      if (r.locationId !== currentLocation.id) return;
      if (r.status === 'declined') return;
      if (r.date !== selectedDate) return;
      
      const resStartSeconds = timeToMinutes(r.time) * 60;
      const resEndSeconds = resStartSeconds + (r.duration * 3600);
      const remainingSeconds = resEndSeconds - selectedSeconds;
      
      if (remainingSeconds > 0 && remainingSeconds <= 300) {
        expiringFloorIds.add(r.floorId);
      }
    });
    return Array.from(expiringFloorIds);
  }, [currentLocation, allReservations, selectedDate, selectedTime24h, timeOffsetSeconds]);

  const roomsForCurrentView = useMemo(() => {
    if (!currentFloor) return [];
    const selectedSeconds = timeToMinutes(selectedTime24h) * 60 + timeOffsetSeconds;

    return (currentFloor.rooms || []).map(room => {
      const overlappingReservations = allReservations.filter(r => {
        if (r.floorId !== currentFloor.id || r.roomId !== room.id || r.date !== selectedDate) return false;
        if (r.status === 'declined') return false;
        const resStartSeconds = timeToMinutes(r.time) * 60;
        const resEndSeconds = resStartSeconds + (r.duration * 3600);
        return selectedSeconds >= resStartSeconds && selectedSeconds < resEndSeconds;
      });

      let status = RoomStatus.AVAILABLE;
      let remainingSeconds = null;
      let occupiedSeats = 0;

      if (overlappingReservations.length > 0) {
        if (room.type === 'SharedDesk' && room.totalSeats) {
          occupiedSeats = overlappingReservations.length;
          if (occupiedSeats >= room.totalSeats) {
            status = RoomStatus.OCCUPIED;
          } else {
            status = RoomStatus.AVAILABLE;
          }
          // For remaining seconds, maybe track the one that expires soonest?
          const resEnds = overlappingReservations.map(r => timeToMinutes(r.time) * 60 + (r.duration * 3600));
          const soonestEnd = Math.min(...resEnds);
          remainingSeconds = soonestEnd - selectedSeconds;
        } else {
          const res = overlappingReservations[0];
          status = res.status === 'pending' ? RoomStatus.RESERVED : RoomStatus.OCCUPIED;
          const resStartSeconds = timeToMinutes(res.time) * 60;
          const resEndSeconds = resStartSeconds + (res.duration * 3600);
          remainingSeconds = resEndSeconds - selectedSeconds;
        }
      }

      return { 
        ...room, 
        status, 
        activeReservation: overlappingReservations[0], 
        remainingSeconds, 
        occupiedSeats,
        overlappingReservations 
      };
    });
  }, [currentFloor, allReservations, selectedDate, selectedTime24h, timeOffsetSeconds]);

  const handleBook = (roomsToBook: Room[], duration: number, paymentMethod: string, targetUser?: UserProfile, selectedMenuItems?: { itemId: string; quantity: number; comment?: string }[], totalPriceOverride?: number, totalOrderComment?: string) => {
    if (!selectedVendor) return;
    const finalUser = targetUser || userProfile;

    const totalPrice = totalPriceOverride !== undefined ? totalPriceOverride : (roomsToBook.reduce((sum, r) => sum + r.pricePerHour, 0) * duration);

    if (paymentMethod === 'credits') {
      if (targetUser) {
        const currentUser = allUsers.find(u => u.email === targetUser.email) || targetUser;
        if (currentUser.credits < totalPrice) {
           // We might not have a way to show error to staff easily here, but handleBook can return.
           // MenuConfig handles disabled state anyway.
           setBookingError("Insufficient credits");
           setTimeout(() => setBookingError(null), 3000);
           return;
        }
        setAllUsers(prev => prev.map(u => u.email === targetUser.email ? { ...u, credits: u.credits - totalPrice } : u));
      } else {
        if ((userProfile?.credits || 0) < totalPrice) {
          setBookingError("Insufficient credits");
          setTimeout(() => setBookingError(null), 3000);
          return;
        }
        handleUpdateProfile({ ...userProfile, credits: (userProfile?.credits || 0) - totalPrice });
      }
    }

    const newStart = timeToMinutes(selectedTime24h);
    const newEnd = newStart + (duration * 60);
    const conflicting = roomsToBook.filter(room => {
      const overlapping = allReservations.filter(res => {
        if (res.floorId !== currentFloorId || res.roomId !== room.id || res.date !== selectedDate) return false;
        if (res.status === 'declined') return false;
        const resStart = timeToMinutes(res.time);
        const resEnd = resStart + (res.duration * 60);
        return Math.max(newStart, resStart) < Math.min(newEnd, resEnd);
      });
      if (room.type === 'SharedDesk' && room.totalSeats) {
        return overlapping.length >= room.totalSeats;
      }
      return overlapping.length > 0;
    });

    if (conflicting.length > 0) {
      setBookingError(`Conflict in ${conflicting.map(r => r.name).join(', ')}`);
      setTimeout(() => setBookingError(null), 5000);
      return;
    }

    if (targetUser && !allUsers.find(u => u.email === targetUser.email)) {
      setAllUsers(prev => [...prev, targetUser]);
    }

    const now = Date.now();

    if (roomsToBook.length === 0) {
      const newRes: Reservation = {
        id: `res-${now}-takeaway`,
        roomId: 'none',
        locationId: currentLocationId,
        floorId: 'none',
        vendorId: selectedVendor.id,
        date: selectedDate,
        time: selectedTime24h,
        duration: 0,
        userId: finalUser?.uid || finalUser?.email || `user-${now}`,
        userName: finalUser.name,
        userEmail: finalUser.email,
        status: 'approved',
        createdAt: now,
        selectedMenuItems: selectedMenuItems?.map(item => ({
          ...item,
          comment: basketComments?.[item.itemId] || item.comment,
          deliveryTime: basketDeliveryTimes?.[item.itemId] || (item as any).deliveryTime
        })),
        totalOrderComment: totalOrderComment,
        totalPrice: totalPrice,
        paymentMethod,
        origin: isStaff ? 'instore' : 'app',
        hasInstorePurchases: true
      };

      const newTransactions: any[] = [{
        id: `tx-${now}-takeaway`,
        date: new Date().toISOString().split('T')[0],
        amount: totalPrice,
        type: paymentMethod === 'credits' ? 'debit' : 'debit',
        description: `Order at ${selectedVendor.name}`,
        vendorId: selectedVendor.id
      }];

      setTransactions(prev => [...newTransactions, ...prev]);
      setAllReservations(prev => [...prev, newRes]);
      setShowBookingSuccess(true);
      setTimeout(() => setShowBookingSuccess(false), 3000);
      if (paymentMethod === 'instapay') {
        setActiveTab('my_bookings');
      }
      return;
    }

    const newRes: Reservation[] = roomsToBook.map(room => {
      let roomLocId = currentLocationId;
      let roomFloorId = currentFloorId;

      for (const loc of vendorLocations) {
        for (const floor of loc.floors) {
          if (floor.rooms.some(r => r.id === room.id)) {
            roomLocId = loc.id;
            roomFloorId = floor.id;
            break;
          }
        }
      }

      return {
        id: `res-${now}-${room.id}`, roomId: room.id, locationId: roomLocId, floorId: roomFloorId, vendorId: selectedVendor.id,
        date: selectedDate, time: selectedTime24h, duration: duration, 
        userId: finalUser?.uid || finalUser?.email || `user-${now}`,
        userName: finalUser.name, 
        userEmail: finalUser.email,
        status: userRole === 'employee' ? 'approved' : 'pending',
        createdAt: now,
        selectedMenuItems: selectedMenuItems?.map(item => ({
          ...item,
          comment: basketComments[item.itemId] || item.comment,
          deliveryTime: basketDeliveryTimes[item.itemId] || (item as any).deliveryTime
        })),
        totalOrderComment: totalOrderComment,
        totalPrice: totalPrice / roomsToBook.length, // Distribute total price among rooms in batch
        paymentMethod,
        origin: isStaff ? 'instore' : 'app'
      };
    });

    const newTransactions: any[] = roomsToBook.map(room => {
      let roomFloorName = currentFloor?.name;
      let roomLocName = currentLocation?.name;

      for (const loc of vendorLocations) {
        for (const floor of loc.floors) {
          if (floor.rooms.some(r => r.id === room.id)) {
            roomFloorName = floor.name;
            roomLocName = loc.name;
            break;
          }
        }
      }

      return {
        id: `tx-${now}-${room.id}`,
        type: 'debit' as const,
        amount: totalPrice / roomsToBook.length,
        description: `Reservation: ${room.name}`,
        date: new Date(now).toISOString(),
        isReservation: true,
        roomName: room.name,
        locationName: roomLocName,
        floorName: roomFloorName,
        duration: duration,
        paymentMethod: paymentMethod,
        hasInstorePurchases: selectedMenuItems && selectedMenuItems.length > 0
      };
    });

    setTransactions(prev => [...newTransactions, ...prev]);
    setAllReservations(prev => [...prev, ...newRes]);
    setSelectedRoomIds([]);
    setShowBookingSuccess(true);
    setTimeout(() => setShowBookingSuccess(false), 3000);
    if (paymentMethod === 'instapay') {
      setActiveTab('my_bookings');
    }
  };

  const handleUpdateVendor = (vendorId: string, updates: Partial<Vendor>) => {
    setAllVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...updates } : v));
    if (selectedVendor?.id === vendorId) {
      setSelectedVendor(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleUpdateLocationMeta = (locId: string, updates: Partial<LocationData> | ((prev: LocationData) => Partial<LocationData>)) => {
    setAllLocations(prev => prev.map(l => {
      if (l.id === locId) {
        const actualUpdates = typeof updates === 'function' ? updates(l) : updates;
        return { ...l, ...actualUpdates };
      }
      return l;
    }));
  };

  const handleAddLocation = () => {
    if (!selectedVendor) return;
    const newId = `loc-${Date.now()}`;
    const catId = `cat-new-loc-${Date.now()}`;
    const categoryName = 'Branch Specialty Feed';
    const price1 = Math.floor(Math.random() * 21) + 30; // 30-50
    const price2 = Math.floor(Math.random() * 31) + 50; // 50-80
    const price3 = Math.floor(Math.random() * 41) + 80; // 80-120

    const newLoc: LocationData = {
      id: newId,
      vendorId: selectedVendor.id,
      name: 'New Branch Location',
      description: 'Describe this new workspace branch...',
      address: 'Enter physical address here',
      categories: [{ id: catId, name: categoryName, description: 'Catering for the new branch' }],
      menu: [
        { id: `m-loc1-${Date.now()}`, name: 'Signature Brewed Espresso', price: price1, description: 'Premium rich barista blend.', category: categoryName, image: 'https://picsum.photos/200/200?seed=sig-esp' },
        { id: `m-loc2-${Date.now()}`, name: 'Butter Glazed Croissant', price: price2, description: 'Warm and flaky fresh oven bake.', category: categoryName, image: 'https://picsum.photos/200/200?seed=butter-cro' },
        { id: `m-loc3-${Date.now()}`, name: 'Exotic Sliced Fruits', price: price3, description: 'Platter of sweet tropical organic fruits.', category: categoryName, image: 'https://picsum.photos/200/200?seed=exo-fru' }
      ],
      floors: [
        {
          id: `floor-${Date.now()}`,
          name: 'Main Floor',
          rooms: []
        }
      ]
    };
    setAllLocations(prev => [...prev, newLoc]);
    setCurrentLocationId(newId);
    setCurrentFloorId(newLoc.floors[0].id);
  };

  const handleCodeLogin = async (code: string) => {
    if (code.toLowerCase() === 'global access') {
      await signIn('owner');
      setCodeLoginType('global');
      setActiveTab('property_config');
      setPostLoginAction('global_gateway');
      return true;
    }

    const codeUpper = code.toUpperCase();
    
    let isOwnerAll = false;
    let isOwnerSingle = false;
    
    let loc = allLocations.find(l => l.ownerAllAccessCode?.toUpperCase() === codeUpper);
    if (loc) {
      isOwnerAll = true;
    } else {
      loc = allLocations.find(l => l.ownerAccessCode?.toUpperCase() === codeUpper);
      if (loc) {
        isOwnerSingle = true;
      } else {
        loc = allLocations.find(l => l.staffAccessCode?.toUpperCase() === codeUpper);
      }
    }
    if (loc) {
      const vendor = allVendors.find(v => v.id === loc.vendorId);
      if (vendor) {
        if (isOwnerAll) {
          setIsLocationConfirmed(false);
          setSelectedVendor(vendor);
          await signIn('owner');
          setCodeLoginType('all');
          setActiveTab('payment_analytics');
          setPostLoginAction(null);
          return true;
        } else if (isOwnerSingle) {
          setIsLocationConfirmed(true);
          setSelectedVendor(vendor);
          setCurrentLocationId(loc.id);
          setCurrentFloorId(loc.floors[0]?.id || '');
          await signIn('owner');
          setCodeLoginType('single');
          setActiveTab('payment_analytics');
          setPostLoginAction(null);
          return true;
        } else {
          setIsLocationConfirmed(true);
          setSelectedVendor(vendor);
          setCurrentLocationId(loc.id);
          setCurrentFloorId(loc.floors[0]?.id || '');
          await signIn('employee');
          setCodeLoginType('single');
          return true;
        }
      }
    }
    return false;
  };

  const handleLogout = async () => { 
    await signOut(); 
    setSelectedVendor(null); 
    setIsLocationConfirmed(false); 
    setCurrentLocationId('');
    setCurrentFloorId('');
    setSelectedRoomIds([]); 
    setPostLoginAction(null); 
    setCodeLoginType(null);
    setBasket({}); 
    setBasketComments({}); 
    setBasketDeliveryTimes({}); 
    setTotalOrderComment(""); 
    localStorage.removeItem('nova_selected_vendor_id');
    localStorage.removeItem('nova_is_location_confirmed');
    localStorage.removeItem('nova_current_location_id');
    localStorage.removeItem('nova_current_floor_id');
    localStorage.removeItem('nova_code_login_type');
  };

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpStep, setTopUpStep] = useState<'amount' | 'checkout'>('amount');
  const [topUpCardDetails, setTopUpCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [topUpSavedCardId, setTopUpSavedCardId] = useState<string | 'new' | null>(null);
  const [topUpReceipt, setTopUpReceipt] = useState('');
  const [topUpPayer, setTopUpPayer] = useState('');
  
  const [topUpAmount, setTopUpAmount] = useState<number>(200);
  const [topUpPaymentMethod, setTopUpPaymentMethod] = useState<'card' | 'instapay'>('card');

  useEffect(() => {
    if (isTopUpOpen) {
      if (userProfile?.paymentMethods && userProfile.paymentMethods.length > 0) {
        const defaultCard = userProfile.paymentMethods.find(c => c.isDefault) || userProfile.paymentMethods[0];
        setTopUpSavedCardId(defaultCard.id);
      } else {
        setTopUpSavedCardId('new');
      }
      
      if (selectedVendor?.acceptedPaymentMethods) {
        if (selectedVendor.acceptedPaymentMethods.card === false && topUpPaymentMethod === 'card') {
          setTopUpPaymentMethod('instapay');
        } else if (selectedVendor.acceptedPaymentMethods.instapay === false && topUpPaymentMethod === 'instapay') {
          setTopUpPaymentMethod('card');
        }
      }
    }
  }, [isTopUpOpen, currentLocation, topUpPaymentMethod, userProfile?.paymentMethods]);

  const [transactions, setTransactions] = useState<{ 
    id: string, 
    type: 'credit' | 'debit', 
    amount: number, 
    description: string, 
    date: string,
    isReservation?: boolean,
    roomName?: string,
    locationName?: string,
    floorName?: string,
    duration?: number,
    paymentMethod?: string,
    hasInstorePurchases?: boolean
  }[]>([
    { id: 'tx-1', type: 'credit', amount: 2500, description: 'Initial Balance', date: '2026-03-25T10:00:00Z' },
    { id: 'tx-2', type: 'debit', amount: 150, description: 'Coffee & Snack', date: '2026-03-28T14:30:00Z' }
  ]);

  const handleTopUp = () => {
    if (topUpAmount < 200) {
      setBookingError("Minimum deposit is 200 EGP");
      setTimeout(() => setBookingError(null), 3000);
      return;
    }
    if (topUpStep === 'amount') {
      setTopUpStep('checkout');
      return;
    }
    
    // Process checkout
    if (topUpPaymentMethod === 'card') {
      if (topUpSavedCardId === 'new') {
        if (!topUpCardDetails.number || !topUpCardDetails.expiry || !topUpCardDetails.cvc || !topUpCardDetails.name) {
          setBookingError("Please fill all card details");
          setTimeout(() => setBookingError(null), 3000);
          return;
        }
      }
    } else {
      if (!topUpPayer || !topUpReceipt) {
        setBookingError("Please provide sender address and receipt");
        setTimeout(() => setBookingError(null), 3000);
        return;
      }
    }

    const newBalance = (userProfile?.credits || 0) + topUpAmount;
    handleUpdateProfile({ ...userProfile, credits: newBalance });
    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      type: 'credit',
      amount: topUpAmount,
      description: 'Account Top-Up',
      date: new Date().toISOString().split('T')[0]
    }, ...prev]);
    setIsTopUpOpen(false);
    setTopUpStep('amount');
    setShowBookingSuccess(true);
    setTimeout(() => setShowBookingSuccess(false), 3000);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setAllUsers(prev => prev.map(u => u.email === userProfile.email ? newProfile : u));
    if (newProfile.name !== userProfile.name) {
      setAllReservations(prev => prev.map(r => r.userName === userProfile.name ? { ...r, userName: newProfile.name } : r));
    }
    setUserProfile(newProfile);
  };

  const handleCancelReservation = (id: string) => {
    setAllReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  };

  const handleResolveCancellation = (id: string) => {
    const reservation = allReservations.find(r => r.id === id);
    if (!reservation) return;

    // Refund logic
    if (reservation.paymentMethod === 'credits' && reservation.totalPrice) {
      const userToRefund = allUsers.find(u => u.email === reservation.userEmail);
      if (userToRefund) {
        const updatedUser = { ...userToRefund, credits: userToRefund.credits + reservation.totalPrice };
        setAllUsers(prev => prev.map(u => u.email === userToRefund.email ? updatedUser : u));
        if (userToRefund.email === userProfile.email) {
          setUserProfile(updatedUser);
        }
        
        // Add refund transaction if it's the current user
        if (userToRefund.email === userProfile.email) {
          const roomName = allLocations.flatMap(l => l.floors).flatMap(f => f.rooms).find(r => r.id === reservation.roomId)?.name || 'Unknown Space';
          setTransactions(prev => [{
            id: `tx-refund-${Date.now()}`,
            type: 'credit',
            amount: reservation.totalPrice!,
            description: `Refund: ${roomName}`,
            date: new Date().toISOString(),
            isReservation: true,
            roomName: roomName,
            locationName: allLocations.find(l => l.id === reservation.locationId)?.name,
            floorName: allLocations.flatMap(l => l.floors).find(f => f.id === reservation.floorId)?.name,
            duration: reservation.duration,
            paymentMethod: reservation.paymentMethod,
            hasInstorePurchases: reservation.selectedMenuItems && reservation.selectedMenuItems.length > 0
          }, ...prev]);
        }
      }
    }

    setAllReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
  };

  const handleFinalizeInstapay = (id: string, payerAddress: string, receiptImage: string, ownerInstapayAccount: string) => {
    setAllReservations(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          instapayDetails: {
            payerAddress,
            receiptImage,
            ownerInstapayAccount,
            submittedAt: Date.now()
          }
        };
      }
      return r;
    }));
  };

  const handleAppendToReservation = (reservationId: string, menuItems: { itemId: string; quantity: number; comment?: string; deliveryTime?: string }[], totalPrice: number, orderComment?: string, paymentMethod?: string) => {
    setAllReservations(prev => prev.map(r => {
      if (r.id === reservationId) {
        if (paymentMethod === 'credits' && r.userEmail) {
           setAllUsers(users => users.map(u => u.email === r.userEmail ? { ...u, credits: Math.max(0, u.credits - totalPrice) } : u));
           if (userProfile.email === r.userEmail) {
             setUserProfile(p => ({ ...p, credits: Math.max(0, p.credits - totalPrice) }));
           }
        }
        return {
           ...r, 
           selectedMenuItems: [...(r.selectedMenuItems || []), ...menuItems],
           totalOrderComment: r.totalOrderComment ? `${r.totalOrderComment}\n${orderComment || ''}` : (orderComment || ''),
           hasInstorePurchases: true,
           totalPrice: r.totalPrice + totalPrice
        };
      }
      return r;
    }));
  };

  const currentMenuData = useMemo(() => {
    if (menuSource.type === 'room' && menuSource.id) {
      const room = roomsForCurrentView.find(r => r.id === menuSource.id);
      if (room?.menu && room.menu.length > 0) return { categories: room.categories || [], menu: room.menu };
    }
    // If it's a branch or room fallback, use the location's menu
    if (menuSource.type === 'branch' || (menuSource.type === 'room' && menuSource.id)) {
      return { categories: currentLocation?.categories || [], menu: currentLocation?.menu || [] };
    }
    // Global fallback (vendor level)
    return { categories: selectedVendor?.categories || [], menu: selectedVendor?.menu || [] };
  }, [menuSource, roomsForCurrentView, currentLocation, selectedVendor]);

  const getMenuItemById = (id: string) => {
    let item = currentMenuData.menu?.find(i => i.id === id);
    if (item) return item;
    item = selectedVendor?.menu?.find(i => i.id === id);
    if (item) return item;
    item = currentLocation?.menu?.find(i => i.id === id);
    if (item) return item;
    for (const floor of currentLocation?.floors || []) {
      for (const room of floor.rooms || []) {
        item = room.menu?.find(i => i.id === id);
        if (item) return item;
      }
    }
    return undefined;
  };

  const basketTotal = Object.entries(basket).reduce((sum, [id, qty]) => {
    const item = getMenuItemById(id);
    return sum + (item?.price || 0) * (qty as number);
  }, 0);

  const basketCount = Object.entries(basket).reduce((sum, [id, qty]) => {
    const itemExists = !!getMenuItemById(id);
    return sum + (itemExists ? (qty as number) : 0);
  }, 0);

  const handleUpdateRoom = (roomId: string, updates: Partial<Room>) => {
    setAllLocations(prev => prev.map(loc => ({
      ...loc,
      floors: loc.floors.map(floor => ({
        ...floor,
        rooms: floor.rooms.map(room => room.id === roomId ? { ...room, ...updates } : room)
      }))
    })));
  };

  const allSelectedRooms = useMemo(() => {
    if (!selectedVendor) return [];
    const rooms: Room[] = [];
    for (const loc of vendorLocations) {
      for (const floor of loc.floors) {
        for (const room of floor.rooms) {
          if (selectedRoomIds.includes(room.id)) {
            rooms.push(room);
          }
        }
      }
    }
    return rooms;
  }, [selectedVendor, vendorLocations, selectedRoomIds]);

  
  const renderCredits = (isModal: boolean = false, onClose?: () => void) => (
      <div className={isModal ? "w-full max-w-5xl mx-auto p-10" : "flex-1 bg-slate-50/30 overflow-y-auto p-10 font-['Inter']"}>
        <div className="max-w-5xl mx-auto relative">
          <header className="mb-12">
            {!isModal && (
            <button onClick={() => setActiveTab('blueprint')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors mb-6">
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
            )}
            {isModal && onClose && (
              <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            )}
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">My Balance</h2>
            <p className="text-slate-500 font-medium italic">Manage your digital currency for bookings and in-store purchases.</p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-100">
                      <Wallet size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Balance</p>
                      <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{(userProfile?.credits || 0).toLocaleString()} <span className="text-2xl text-blue-600">EGP</span></h3>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <button onClick={() => { setIsTopUpOpen(true); setTopUpStep('amount'); }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">TOP UP BALANCE</button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl relative overflow-hidden">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Transaction History</h3>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 font-bold">No transactions yet.</p>
                    </div>
                  ) : (
                    transactions.map(tx => (
                      <div key={tx.id} className="flex flex-col p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {tx.type === 'credit' ? <Plus size={20} /> : <X size={20} />}
                            </div>
                            <div>
                              <p className="text-base font-black text-slate-900">{tx.description}</p>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                {new Date(tx.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                          </div>
                          <p className={`text-lg font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} EGP
                          </p>
                        </div>
                        {tx.isReservation && (
                          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space</span>
                              <span className="font-semibold text-slate-700">{tx.roomName}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch</span>
                              <span className="font-semibold text-slate-700">{tx.locationName}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
                              <span className="font-semibold text-slate-700">{tx.duration} Hour{tx.duration !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</span>
                              <span className="font-semibold text-slate-700">{tx.paymentMethod === 'credits' ? 'Nova Credit' : tx.paymentMethod}</span>
                            </div>
                            {tx.hasInstorePurchases && (
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In-Store Purchases</span>
                                <span className="font-semibold text-slate-700">Yes</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
                  <Coins size={160} />
                </div>
                <h3 className="text-lg font-black tracking-tight mb-4 uppercase">Why use EGP?</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={14} /></div>
                    <p className="text-xs font-medium text-slate-300">Instant in-store payments at any NovaSpace location.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={14} /></div>
                    <p className="text-xs font-medium text-slate-300">Discounted rates on meeting rooms and day passes.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={14} /></div>
                    <p className="text-xs font-medium text-slate-300">No need to carry cards or Instapay during your workday.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        {/* Top Up Modal */}
        {isTopUpOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => { setIsTopUpOpen(false); setTopUpStep('amount'); }} />
            <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2 text-center">Top Up Balance</h3>
              <p className="text-slate-500 font-bold mb-8 text-center">Minimum deposit is 200 EGP</p>
              
              {topUpStep === 'amount' ? (
                <>
                  <div className="space-y-6 mb-10">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (EGP)</label>
                      <div className="relative group">
                        <Coins className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input 
                          type="number" 
                          min="200"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(Number(e.target.value))}
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-black text-2xl text-slate-900"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {[200, 500, 1000].map(amt => (
                        <button 
                          key={amt} 
                          onClick={() => setTopUpAmount(amt)}
                          className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${topUpAmount === amt ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'}`}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 pb-6 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 text-center">Payment Method</label>
                    <div className="flex justify-center gap-3 w-full">
                      {selectedVendor?.acceptedPaymentMethods?.card !== false && (
                      <button 
                        onClick={() => setTopUpPaymentMethod('card')}
                        className={`w-28 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${topUpPaymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-black shadow-lg shadow-blue-100' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-white'}`}
                      >
                        <CreditCard size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center mt-1">Card</span>
                      </button>
                      )}
                      {selectedVendor?.acceptedPaymentMethods?.instapay !== false && (
                      <button 
                        onClick={() => setTopUpPaymentMethod('instapay')}
                        className={`w-28 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${topUpPaymentMethod === 'instapay' ? 'border-amber-500 bg-amber-50 text-amber-600 font-black shadow-lg shadow-amber-100' : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-white'}`}
                      >
                        <Banknote size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center mt-1">Instapay</span>
                      </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => { setIsTopUpOpen(false); setTopUpStep('amount'); }} className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                    <button onClick={handleTopUp} className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-blue-100">Continue to Checkout</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                      <p className="text-2xl font-black text-slate-900">{topUpAmount.toLocaleString()} EGP</p>
                    </div>
                    {topUpPaymentMethod === 'card' ? (
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><CreditCard size={24} /></div>
                    ) : (
                      <div className="bg-amber-100 text-amber-600 p-3 rounded-xl"><Banknote size={24} /></div>
                    )}
                  </div>
                  
                  {topUpPaymentMethod === 'card' ? (
                    <div className="space-y-4 mb-8">
                      {userProfile?.paymentMethods && userProfile.paymentMethods.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Saved Cards</label>
                          {userProfile.paymentMethods.map(card => (
                            <button
                              key={card.id}
                              onClick={() => setTopUpSavedCardId(card.id)}
                              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${topUpSavedCardId === card.id ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${topUpSavedCardId === card.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                  <CreditCard size={16} />
                                </div>
                                <div className="text-left">
                                  <p className={`text-sm font-black ${topUpSavedCardId === card.id ? 'text-blue-900' : 'text-slate-700'}`}>{card.type} •••• {card.last4}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.name || 'Saved Card'} {card.isDefault && '• DEFAULT'}</p>
                                </div>
                              </div>
                              {topUpSavedCardId === card.id && <CheckCircle2 size={18} className="text-blue-600" />}
                            </button>
                          ))}
                          <button
                            onClick={() => setTopUpSavedCardId('new')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${topUpSavedCardId === 'new' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${topUpSavedCardId === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                <Plus size={16} />
                              </div>
                              <div className="text-left">
                                <p className={`text-sm font-black ${topUpSavedCardId === 'new' ? 'text-blue-900' : 'text-slate-700'}`}>Use a new card</p>
                              </div>
                            </div>
                            {topUpSavedCardId === 'new' && <CheckCircle2 size={18} className="text-blue-600" />}
                          </button>
                        </div>
                      )}
                      
                      {(!userProfile?.paymentMethods || userProfile.paymentMethods.length === 0 || topUpSavedCardId === 'new') && (
                        <div className="space-y-4 pt-2">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.number} onChange={e => setTopUpCardDetails({...topUpCardDetails, number: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Expiry</label>
                              <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.expiry} onChange={e => setTopUpCardDetails({...topUpCardDetails, expiry: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">CVC</label>
                              <input type="text" placeholder="123" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.cvc} onChange={e => setTopUpCardDetails({...topUpCardDetails, cvc: e.target.value})} />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Cardholder Name</label>
                            <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-black text-slate-900" value={topUpCardDetails.name} onChange={e => setTopUpCardDetails({...topUpCardDetails, name: e.target.value})} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 mb-8">
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/50 mb-4">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Send payment to</p>
                        <p className="text-lg font-black text-amber-700 font-mono">{selectedVendor?.instapayAccount || 'novaspace@instapay'}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Your Instapay Address / Phone</label>
                        <input type="text" placeholder="e.g. user@instapay or 01xxxxxxxxx" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-mono text-sm" value={topUpPayer} onChange={e => setTopUpPayer(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Transfer Receipt Image</label>
                        <label className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all">
                          <Upload className="text-slate-400 mb-2" size={20} />
                          <span className="text-xs font-bold text-slate-500">{topUpReceipt ? 'Receipt uploaded!' : 'Click to upload receipt'}</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            if (e.target.files?.[0]) setTopUpReceipt(URL.createObjectURL(e.target.files[0]));
                          }} />
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button onClick={() => setTopUpStep('amount')} className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-xs">Back</button>
                    <button onClick={handleTopUp} className={`flex-[2] py-4 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl ${topUpPaymentMethod === 'card' ? 'bg-blue-600 shadow-blue-100 hover:bg-blue-700' : 'bg-amber-500 shadow-amber-100 hover:bg-amber-600'}`}>Complete Top Up</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}


        </div>
      </div>
  );

  const renderContent = () => {
    if (activeTab === 'blueprint') {
      return (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col bg-slate-50/30 overflow-auto">
            <div className="p-10 pb-0 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Live View Portal</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
                      <select value={currentFloorId} onChange={e => setCurrentFloorId(e.target.value)} className="bg-transparent border-none outline-none text-xs font-black text-slate-900 cursor-pointer">
                        {currentLocation?.floors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
                    {isStaff && floorsWithExpiringRooms.some(fid => fid !== currentFloorId) && (
                      <>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping pointer-events-none"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white pointer-events-none"></div>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedDate} @ {displayTime12h}</p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    {currentLocation?.name}
                  </div>
               </div>
              </div>
            </div>
            <div className="flex-1 relative bg-white border-t border-slate-200 blueprint-grid overflow-hidden mt-6" onClick={() => setSelectedRoomIds([])}>
              {roomsForCurrentView.map(room => (
                <div 
                  key={room.id} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (room.type === 'Service') return;
                    if (!isStaff && (room.status === RoomStatus.OCCUPIED || room.status === RoomStatus.RESERVED)) return;
                    setSelectedRoomIds(prev => prev.includes(room.id) ? prev.filter(id => id !== room.id) : [...prev, room.id]); 
                  }} 
                  className={`group absolute transition-all duration-300 cursor-pointer border-2 rounded-xl flex flex-col items-center justify-center text-center shadow-md p-2 ${room.type === 'SharedDesk' ? (selectedRoomIds.includes(room.id) ? 'bg-white border-blue-600 text-slate-900 ring-4 ring-blue-100' : 'bg-white border-slate-200 text-slate-900') : ROOM_COLORS[selectedRoomIds.includes(room.id) ? RoomStatus.SELECTED : room.status]} ${(!isStaff && favoritedRooms.includes(room.id)) ? 'ring-4 ring-amber-400 border-transparent' : ''} ${isStaff && room.remainingSeconds !== undefined && room.remainingSeconds !== null && room.remainingSeconds <= 300 && room.remainingSeconds > 0 ? 'animate-pulse ring-4 ring-rose-500 border-rose-500' : ''}`}
                  style={{ left: `${room.x}%`, top: `${room.y}%`, width: `${room.width}%`, height: `${room.height}%` }}
                >
                  {room.type === 'SharedDesk' && room.totalSeats !== undefined && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden z-0 pointer-events-none">
                      <div className="absolute inset-y-0 left-0 transition-all duration-500 opacity-30" style={{ 
                        width: `${(room.occupiedSeats || 0) / room.totalSeats * 100}%`, 
                        backgroundColor: (room.occupiedSeats || 0) > 0 ? `rgb(${Math.round(234 + (244 - 234) * ((room.occupiedSeats || 0) / room.totalSeats))}, ${Math.round(179 + (63 - 179) * ((room.occupiedSeats || 0) / room.totalSeats))}, ${Math.round(8 + (94 - 8) * ((room.occupiedSeats || 0) / room.totalSeats))})` : 'transparent'
                      }}></div>
                    </div>
                  )}
                  <span className="uppercase tracking-tighter font-black text-xs leading-none z-10">{room.name}</span>
                  {room.type === 'SharedDesk' ? (
                    <span className="text-[8px] font-black uppercase mt-1 opacity-60 z-10">{room.occupiedSeats || 0}/{room.totalSeats}</span>
                  ) : (
                    room.type !== 'Service' && <span className="text-[8px] font-black uppercase mt-1 opacity-60 z-10">{room.status}</span>
                  )}
                  
                  {isStaff && room.remainingSeconds !== undefined && room.remainingSeconds !== null && room.remainingSeconds > 0 && (
                    <div className="absolute -top-8 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {Math.floor(room.remainingSeconds / 60)}:{(Math.floor(room.remainingSeconds) % 60).toString().padStart(2, '0')} left
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                  )}

                  {room.type !== 'Service' && !isStaff && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavoritedRooms(prev => prev.includes(room.id) ? prev.filter(id => id !== room.id) : [...prev, room.id]);
                      }}
                      className={`absolute top-1 right-1 p-1 rounded-full transition-opacity ${
                        favoritedRooms.includes(room.id) ? 'text-amber-400 opacity-100' : 'text-slate-400/50 opacity-0 group-hover:opacity-100 hover:text-amber-400'
                      }`}
                    >
                      <Star size={12} className={favoritedRooms.includes(room.id) ? "fill-amber-400 text-amber-400" : ""} />
                    </button>
                  )}
                </div>
              ))}
              <div className="absolute bottom-8 left-8 text-[11px] font-black text-slate-300 uppercase tracking-widest">{currentLocation?.name} • {currentFloor?.name}</div>
            </div>
          </div>
          <AnimatePresence>
            {selectedRoomIds.length > 0 && (
              <motion.aside 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 420, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="border-l border-slate-200 bg-white flex flex-col overflow-y-auto overflow-x-hidden shrink-0"
              >
                <div className="w-[420px] h-full">
                  <RoomDetail 
                    rooms={allSelectedRooms} 
                    onBook={(rooms, duration, paymentMethod, user, menuItems, totalPrice, totalComment) => {
                      handleBook(rooms, duration, paymentMethod, user, menuItems, totalPrice, totalComment);
                      setBasket({}); // Clear basket after booking
                      setBasketComments({});
                      setBasketDeliveryTimes({});
                      setTotalOrderComment("");
                    }} 
                    selectedDate={selectedDate} 
                    selectedTime={displayTime12h} 
                    selectedTime24={selectedTime24h} 
                    isStaff={isStaff}
                    allUsers={allUsers}
                    userProfile={userProfile}
    onAddLocation={handleAddLocation}
                    onUpdateProfile={handleUpdateProfile}
                    reservationTimer={reservationTimer}
                    cancellationPolicy={selectedVendor?.cancellationPolicy}
                    vendor={selectedVendor!}
                    currentLocation={currentLocation}
                    basket={basket}
                    basketComments={basketComments}
                    basketDeliveryTimes={basketDeliveryTimes}
                    totalOrderComment={totalOrderComment}
                    menuPrice={basketTotal}
                    currentMenu={currentMenuData.menu}
                    getBasketItemDetails={getMenuItemById}
                    onRemoveRoom={(roomId) => setSelectedRoomIds(prev => prev.filter(id => id !== roomId))}
                    bookingDuration={bookingDuration}
                    onDurationChange={setBookingDuration}
                  />
                </div>
              </motion.aside>
            )}
          
        </AnimatePresence>

        </div>
      );
    }
    if (isStaff) {
      const activeLocations = (codeLoginType === 'single' || userRole === 'employee') ? (currentLocation ? [currentLocation] : []) : vendorLocations;
      if (activeTab === 'clock_in') return (
        <ClockInPage 
          userProfile={userProfile} 
          allEmployees={allEmployees}
          setAllEmployees={setAllEmployees}
          isClockInEnabled={isClockInEnabled}
        />
      );
      if (activeTab === 'staff_registry' || activeTab === 'staff_registry_approved' || activeTab === 'staff_registry_cancelled') return (
        <EmployeeDashboard 
          selectedVendor={selectedVendor} 
          reservations={allReservations.filter(r => r.vendorId === selectedVendor?.id && ((codeLoginType === 'single' || userRole === 'employee') ? r.locationId === currentLocationId : true))} 
          locations={activeLocations} 
          currentLocationId={currentLocationId} 
          onCancelReservation={handleCancelReservation}
          onResolveCancellation={handleResolveCancellation} 
          onApproveReservation={id => setAllReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))} 
          onUpdateOrderStatus={(ids, status) => setAllReservations(prev => prev.map(r => ids.includes(r.id) ? { ...r, orderStatus: status } : r))}
          onVerifyInstapay={(ids) => setAllReservations(prev => prev.map(r => ids.includes(r.id) && r.instapayDetails ? { ...r, instapayDetails: { ...r.instapayDetails, verifiedAt: Date.now() } } : r))}
          userProfile={userProfile}
          onAddLocation={handleAddLocation} 
          allUsers={allUsers} 
          cancellationPolicy={selectedVendor?.cancellationPolicy} 
          filterStatus={activeTab === 'staff_registry' ? 'pending' : activeTab === 'staff_registry_approved' ? 'approved' : 'cancelled'}
        />
      );
      if (activeTab === 'global_settings' && userRole === 'owner' && (codeLoginType === 'global' || !codeLoginType)) {
        if (!selectedVendor) return null;
        return (
          <GlobalConfigPage 
            userRole={userRole} 
            vendor={selectedVendor} 
            locations={activeLocations} 
            allVendors={allVendors}
            allLocations={allLocations}
            onUpdateVendor={handleUpdateVendor} 
            onUpdateLocation={handleUpdateLocationMeta} 
          />
        );
      }
      if (activeTab === 'clock_in_access' && userRole === 'owner' && (codeLoginType === 'global' || !codeLoginType)) {
        return (
          <ClockInAccessPage 
            isClockInEnabled={isClockInEnabled}
            onToggleClockIn={setIsClockInEnabled}
            allEmployees={allEmployees}
          />
        );
      }
      if (activeTab === 'property_config' && userRole === 'owner' && (codeLoginType === 'global' || !codeLoginType)) {
        if (!currentLocation) return <div className="flex-1 flex flex-col items-center justify-center pt-20"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4"><AlertCircle size={24} /></div><p className="font-bold text-slate-500">No Branch Selected / Available</p></div>;
        return <PropertyConfig userRole={userRole as any} location={currentLocation} activeFloorId={currentFloorId} locations={activeLocations} vendor={selectedVendor!} onUpdateRooms={(newRooms) => setAllLocations(prev => prev.map(l => l.id === currentLocationId ? {...l, floors: l.floors.map(f => f.id === currentFloorId ? {...f, rooms: newRooms} : f)} : l))} onSwitchLocation={setCurrentLocationId} onSwitchFloor={setCurrentFloorId} onUpdateVendor={handleUpdateVendor} onUpdateLocationMeta={handleUpdateLocationMeta} onAddLocation={handleAddLocation} view={configView} onViewChange={setConfigView} allReservations={allReservations} />;
      }
      if (activeTab === 'working_times' && (userRole === 'owner' || userRole === 'manager')) {
        return (
          <WorkingTimesPage 
            vendor={selectedVendor}
            onUpdateVendor={handleUpdateVendor}
            isGlobalAccess={userRole === 'owner' && codeLoginType === 'global'}
          />
        );
      }
      if (activeTab === 'menu_config') {
        if (!currentLocation) return <div className="flex-1 flex flex-col items-center justify-center pt-20"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4"><AlertCircle size={24} /></div><p className="font-bold text-slate-500">No Branch Selected / Available</p></div>;
        return (
          <MenuConfig 
            userRole={userRole as any}
            vendor={selectedVendor!} 
            onUpdateVendor={v => handleUpdateVendor(selectedVendor!.id, v)} 
            location={currentLocation}
            onUpdateLocation={l => handleUpdateLocationMeta(currentLocation.id, l)}
            allUsers={allUsers}
            onBook={handleBook}
            allReservations={allReservations}
            onAppendToReservation={handleAppendToReservation}
          />
        );
      }
      if (activeTab === 'analytics' && (userRole === 'owner' || userRole === 'manager')) return (
        <AnalyticsDashboard 
          locations={activeLocations}
          reservations={allReservations}
          selectedVendor={selectedVendor!}
          userRole={userRole as any}
          currentLocationId={currentLocationId}
        />
      );
      if (activeTab === 'payment_analytics' && (userRole === 'owner' || userRole === 'manager')) return (
        <PaymentAnalytics 
          locations={activeLocations}
          reservations={allReservations}
          userRole={userRole as any}
          currentLocationId={currentLocationId}
        />
      );
      if (activeTab === 'staff_analytics' && (userRole === 'owner' || userRole === 'manager')) return (
        <StaffAnalytics 
          allEmployees={allEmployees}
          setAllEmployees={setAllEmployees}
          isGlobalAccess={userRole === 'owner' && codeLoginType === 'global'}
        />
      );
      if (activeTab === 'store_analytics' && (userRole === 'owner' || userRole === 'manager')) return (
        <StoreAnalytics 
          locations={activeLocations}
          reservations={allReservations}
          userRole={userRole as any}
          currentLocationId={currentLocationId}
          vendors={allVendors}
        />
      );
      if (activeTab === 'shift_summary' && (userRole === 'owner' || userRole === 'manager' || userRole === 'employee')) return (
        <ShiftRegistryDashboard 
          allEmployees={allEmployees}
          setAllEmployees={setAllEmployees}
          reservations={allReservations.filter(r => r.vendorId === selectedVendor?.id && ((codeLoginType === 'single' || userRole === 'employee') ? r.locationId === currentLocationId : true))}
          isGlobalAccess={userRole === 'owner' && codeLoginType === 'global'}
          clockedInEmployeeIds={[]}
          setClockedInEmployeeIds={() => {}}
          viewMode={userRole === 'employee' ? undefined : "analytics"}
        />
      );
      if (activeTab === 'staff_management' && (userRole === 'owner' || userRole === 'manager')) return (
        <ShiftRegistryDashboard 
          allEmployees={allEmployees}
          setAllEmployees={setAllEmployees}
          reservations={allReservations.filter(r => r.vendorId === selectedVendor?.id && (codeLoginType === 'single' ? r.locationId === currentLocationId : true))}
          isGlobalAccess={userRole === 'owner' && codeLoginType === 'global'}
          clockedInEmployeeIds={[]}
          setClockedInEmployeeIds={() => {}}
          viewMode="management"
        />
      );
      if (activeTab === 'cancellation_policies' && userRole === 'owner' && (codeLoginType === 'global' || !codeLoginType)) return (
        <CancellationPoliciesPage 
          locations={activeLocations}
          vendor={selectedVendor!}
          onUpdateLocationMeta={handleUpdateLocationMeta}
          onUpdateVendor={handleUpdateVendor}
        />
      );
      if (activeTab === 'socials_config' && (userRole === 'owner' || userRole === 'manager')) return (
        <SocialsConfig
          vendor={selectedVendor!}
          locations={activeLocations}
          onUpdateVendor={handleUpdateVendor}
          onUpdateLocation={handleUpdateLocationMeta}
        />
      );
    }
        if (activeTab === 'service_menu') {
      return (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/40 p-10 font-['Inter']">
          <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                    Service Menu
                  </h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                    Browse and order items to your workspace
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Basket Total ({basketCount} items)</p>
                <p className="text-3xl font-black text-slate-900">{basketTotal.toLocaleString()} <span className="text-sm text-blue-600">EGP</span></p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              {/* Horizontal Category Bar */}
                  {(currentMenuData.categories || []).length > 0 && (
                    <div className="px-10 py-6 bg-white border-b border-slate-50 sticky top-0 z-10">
                      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {(currentMenuData.categories || []).map(category => (
                          <button 
                            key={typeof category === 'string' ? category : category.name}
                            onClick={() => setActiveServiceCategory(typeof category === 'string' ? category : category.name)}
                            className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                              (activeServiceCategory === (typeof category === 'string' ? category : category.name) || (!activeServiceCategory && (currentMenuData.categories?.[0] === category || (currentMenuData.categories?.[0] as any)?.name === (typeof category === 'string' ? category : category.name))))
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600'
                            }`}
                          >
                            {typeof category === 'string' ? category : category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-10 flex-1 flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(() => {
                    const categories = currentMenuData.categories || [];
                    if (categories.length === 0) {
                      return (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                          <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-6">
                            <Utensils size={40} />
                          </div>
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">No Menu Available</h4>
                          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">This location hasn't set up their service menu yet.</p>
                        </div>
                      );
                    }

                    const selectedCat = activeServiceCategory || (typeof categories[0] === 'string' ? categories[0] : categories[0].name);
                    const filteredItems = (currentMenuData.menu?.filter(i => i.category === selectedCat) || []).filter(item => item.isAvailable !== false);
                      
                    if (filteredItems.length === 0) {
                      return (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mb-4">
                            <Utensils size={32} />
                          </div>
                          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No items found in this category</p>
                        </div>
                      );
                    }

                    return filteredItems.map(item => (
                      <div key={item.id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 flex flex-col group hover:shadow-xl transition-all shadow-sm">
                        <div className="relative mb-6">
                          <img src={item.image || `https://picsum.photos/400/400?seed=${item.id}`} className="w-full aspect-square object-cover rounded-3xl shadow-md" referrerPolicy="no-referrer" />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest border border-slate-100">{item.category}</div>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-1">{item.name}</h4>
                        <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-2">{item.description}</p>
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100/50">
                          <span className="text-xl font-black text-blue-600">{item.price} <span className="text-xs">EGP</span></span>
                          <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
                            <button 
                              onClick={() => setBasket(prev => ({ ...prev, [item.id]: Math.max(0, (prev[item.id] || 0) - 1) }))}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-black text-sm text-slate-900">{basket[item.id] || 0}</span>
                            <button 
                              onClick={() => setBasket(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>


          </div>
        </div>
      );
    }

    if (activeTab === 'profile') return <ProfilePage user={userProfile} reservations={allReservations} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} onNavigateToCredits={() => setShowCreditsModal(true)} />;
    if (activeTab === 'my_bookings') return <MyBookingsPage reservations={allReservations} locations={allLocations} vendors={allVendors} userName={userProfile.name} onCancel={handleCancelReservation} onFinalizeInstapay={handleFinalizeInstapay} simulatedTimeMs={simulatedTimeMs} />;
    if (activeTab === 'credits') return renderCredits();
    return null;
  };

  if (postLoginAction === 'privacy') {
    return <PrivacyPage onBack={() => setPostLoginAction(isLoggedIn ? (selectedVendor ? 'select_network' : null) : null)} sections={privacySections} />;
  }

  if (postLoginAction === 'terms') {
    return <TermsPage onBack={() => setPostLoginAction(isLoggedIn ? (selectedVendor ? 'select_network' : null) : null)} sections={termsSections} />;
  }

  if (postLoginAction === 'support') {
    return <SupportPage onBack={() => setPostLoginAction(isLoggedIn ? (selectedVendor ? 'select_network' : null) : null)} faqs={faqs} />;
  }

  if (postLoginAction === 'api_status') {
    return <APIStatusPage onBack={() => setPostLoginAction(isLoggedIn ? (selectedVendor ? 'select_network' : null) : null)} />;
  }

  if (loading || (isLoggedIn && !userProfile)) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500">Loading profile...</p></div>;
  }

  if (!isLoggedIn) return (
    <LandingPage 
      onLogin={async (role) => {
        await signIn(role);
        setIsLocationConfirmed(false);
        if (role === 'owner') {
          setPostLoginAction(null);
        } else {
          setPostLoginAction('welcome');
        }
      }} 
      onCodeLogin={handleCodeLogin}
      onShowPrivacy={() => setPostLoginAction('privacy')}
      onShowTerms={() => setPostLoginAction('terms')}
      onShowSupport={() => setPostLoginAction('support')}
    />
  );


  if (postLoginAction === 'global_gateway') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-['Inter'] relative">
        <div className="absolute top-6 left-6">
          <button onClick={handleLogout} className="flex items-center gap-2 p-3 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm hover:shadow-md transition-all">
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Crown size={40} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Global Access Gateway</h1>
            <p className="text-slate-500 font-medium">Where would you like to go?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => setPostLoginAction('select_network')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Access Network</h2>
              <p className="text-slate-500 font-medium">Log into working spaces and manage operations</p>
            </button>
            <button onClick={() => setPostLoginAction('code_credentials')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <KeyRound size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Credentials</h2>
              <p className="text-slate-500 font-medium">View branch access codes</p>
            </button>
            <button onClick={() => setPostLoginAction('edit_faq')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-rose-200 transition-all group flex flex-col items-center text-center md:col-span-2">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LifeBuoy size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">FAQ Management</h2>
              <p className="text-slate-500 font-medium">Edit, add, or delete frequently asked questions</p>
            </button>
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
            <button onClick={() => { setActiveTab('staff_registry_cancelled'); setPostLoginAction('select_network'); }} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-orange-200 transition-all group flex flex-col items-center text-center md:col-span-2">
              <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Ban size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Cancelled Tracking</h2>
              <p className="text-slate-500 font-medium">Track cancelled reservations across all spaces</p>
            </button>

          </div>
        </div>
      </div>
    );
  }

  
  
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

  if (postLoginAction === 'edit_faq') {
    return (
      <FAQManagement 
        faqs={faqs}
        setFaqs={setFaqs}
        onBack={() => setPostLoginAction('global_gateway')}
      />
    );
  }

  if (postLoginAction === 'code_credentials') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-6 font-['Inter'] overflow-y-auto">
        <div className="max-w-5xl w-full mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setPostLoginAction('global_gateway')} className="p-3 bg-white rounded-full text-slate-400 hover:text-slate-900 shadow-sm hover:shadow-md transition-all">
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Branch Credentials</h1>
                <p className="text-slate-500 font-medium">Manage access codes across all coworking spaces</p>
              </div>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search branches..." 
                value={branchCredentialsSearchQuery}
                onChange={(e) => setBranchCredentialsSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300 shadow-sm"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
            {allVendors.map((vendor, vIndex) => {
              const vendorLocations = allLocations.filter(loc => 
                loc.vendorId === vendor.id && 
                loc.name.toLowerCase().includes(branchCredentialsSearchQuery.toLowerCase())
              );
              if (vendorLocations.length === 0) return null;
              
              return (
                <div key={vendor.id} className={`flex flex-col ${vIndex !== allVendors.length - 1 ? 'border-b border-slate-200' : ''}`}>
                  <div className="flex items-center gap-4 p-6 bg-slate-50/80">
                    <img src={vendor.logo} alt={vendor.name} className="w-10 h-10 rounded-xl object-contain bg-white p-1.5 shadow-sm border border-slate-200" />
                    <h2 className="text-xl font-black text-slate-900">{vendor.name}</h2>
                  </div>
                  
                  <div className="flex flex-col pb-6 px-6">
                    {vendorLocations.map((loc, lIndex) => (
                      <div key={loc.id} className="flex relative items-center py-4 pl-8 group">
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" style={{ height: lIndex === vendorLocations.length - 1 ? '50%' : '100%' }}></div>
                        <div className="absolute left-4 top-1/2 w-4 h-px bg-slate-200"></div>
                        
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between w-full gap-4 xl:gap-8 ml-2 p-4 rounded-2xl group-hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <img src={loc.image} alt={loc.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                            <div>
                              <h3 className="font-black text-slate-900">{loc.name}</h3>
                              <p className="text-xs font-bold text-slate-400">{loc.city}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                            <div className="flex flex-col">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Employee</label>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  value={loc.staffAccessCode || ''}
                                  onChange={(e) => setAllLocations(prev => prev.map(l => l.id === loc.id ? {...l, staffAccessCode: e.target.value} : l))}
                                  className="w-32 px-3 py-2 bg-white rounded-lg text-xs font-black text-slate-900 border border-slate-200 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-center placeholder:text-slate-300"
                                  placeholder="e.g. NS-SF-89"
                                />
                                <Edit size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                              </div>
                            </div>
                            
                            <div className="flex flex-col">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Owner</label>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  value={loc.ownerAccessCode || ''}
                                  onChange={(e) => setAllLocations(prev => prev.map(l => l.id === loc.id ? {...l, ownerAccessCode: e.target.value} : l))}
                                  className="w-40 px-3 py-2 bg-white rounded-lg text-xs font-black text-emerald-700 border border-emerald-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all text-center placeholder:text-slate-300"
                                  placeholder="e.g. OWNER-NS-SF-88"
                                />
                                <Edit size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 pointer-events-none" />
                              </div>
                            </div>
                            
                            <div className="flex flex-col">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Owner All</label>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  value={loc.ownerAllAccessCode || ''}
                                  onChange={(e) => setAllLocations(prev => prev.map(l => l.id === loc.id ? {...l, ownerAllAccessCode: e.target.value} : l))}
                                  className="w-44 px-3 py-2 bg-white rounded-lg text-xs font-black text-blue-700 border border-blue-100 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-center placeholder:text-slate-300"
                                  placeholder="e.g. OWNER-ALL-NS-SF-88"
                                />
                                <Edit size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (postLoginAction === 'edit_profile' && userRole !== 'employee') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter'] relative">
        <div className="p-6">
          <button onClick={() => setPostLoginAction('welcome')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
            <ChevronLeft size={20} /> Back to Welcome Page
          </button>
        </div>
        <ProfilePage user={userProfile} reservations={allReservations} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} onClose={() => setPostLoginAction('welcome')} onNavigateToCredits={() => setShowCreditsModal(true)} />
        {showCreditsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden">
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95">
              {renderCredits(true, () => setShowCreditsModal(false))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (postLoginAction === 'create_space' && isStaff) {
    return (
      <CreateSpacePage 
        onBack={() => setPostLoginAction(null)} 
        onCreate={(newVendor) => {
          setAllVendors([...allVendors, newVendor]);
          
          // Automatically add a single branch (location)
          const newLocation: LocationData = {
            id: `${newVendor.id}-hq`,
            vendorId: newVendor.id,
            name: `${newVendor.name} HQ`,
            description: `Main headquarters for ${newVendor.name}`,
            image: newVendor.logo,
            address: '123 Main St, City, Country',
            floors: [
              {
                id: `${newVendor.id}-hq-f1`,
                name: 'Ground Floor',
                rooms: []
              }
            ]
          };
          setAllLocations([...allLocations, newLocation]);
          
          setPostLoginAction(null);
        }} 
      />
    );
  }

  if (userRole === 'employee' && (!selectedVendor || !isLocationConfirmed)) {
    setTimeout(() => handleLogout(), 0);
    return null;
  }

  if (!selectedVendor) {
    if (userRole === 'customer' && postLoginAction !== 'workspaces') {
      return (
        <>
          <WelcomePage 
            userProfile={userProfile}
            onOpenProfile={() => setPostLoginAction('edit_profile')}
            onOpenWorkspaces={() => setPostLoginAction('workspaces')}
            onLogout={handleLogout}
            onOpenBalance={() => setShowCreditsModal(true)}
          />
          {showCreditsModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden">
              <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95">
                {renderCredits(true, () => setShowCreditsModal(false))}
              </div>
            </div>
          )}
        </>
      );
    }

    return (
      <VendorSelection 
        vendors={allVendors.map(v => ({ ...v, locationCount: allLocations.filter(loc => loc.vendorId === v.id).length > 0 ? allLocations.filter(loc => loc.vendorId === v.id).length : v.locationCount }))} 
        locations={allLocations}
        onSelect={setSelectedVendor} 
        onBack={() => { 
          if (postLoginAction === 'select_network') {
            setPostLoginAction('global_gateway');
          } else if (userRole === 'customer') {
            setPostLoginAction('welcome');
          } else {
            handleLogout();
          }
        }} 
        userRole={userRole || 'customer'} 
        onCreateSpace={() => setPostLoginAction('create_space')}
        onDeleteVendor={(id) => {
          setAllVendors(prev => prev.filter(v => v.id !== id));
          setAllLocations(prev => prev.filter(l => l.vendorId !== id));
        }}
        onShowPrivacy={() => setPostLoginAction('privacy')}
        onShowTerms={() => setPostLoginAction('terms')}
        onShowSupport={() => setPostLoginAction('support')}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        selectedCities={selectedCities}
        setSelectedCities={setSelectedCities}
        allTags={allGlobalTags}
        allCities={allGlobalCities}
        userName={userProfile?.name}
        userProfile={userProfile}
        onAddLocation={handleAddLocation}
      />
    );
  }
  if (!isLocationConfirmed) return <LocationSelection 
    vendor={selectedVendor} 
    locations={vendorLocations} 
    onSelect={id => { 
      setCurrentLocationId(id); 
      const loc = vendorLocations.find(l => l.id === id);
      if (loc && loc.floors.length > 0) {
        setCurrentFloorId(loc.floors[0].id);
      }
      setIsLocationConfirmed(true); 
    }} 
    onBack={() => { 
      if (codeLoginType === 'all') {
        handleLogout();
      } else {
        setSelectedVendor(null); 
        setIsLocationConfirmed(false); 
      }
    }} 
    activeLocationId={currentLocationId} 
    userRole={userRole || 'customer'} 
    onDeleteLocation={(id) => setAllLocations(prev => prev.filter(l => l.id !== id))}
    allReservations={allReservations}
    selectedTags={selectedTags}
    setSelectedTags={setSelectedTags}
    selectedCities={selectedCities}
    setSelectedCities={setSelectedCities}
    allTags={allGlobalTags}
    allCities={allGlobalCities}
    userName={userProfile?.name}
    userProfile={userProfile}
    onAddLocation={handleAddLocation}
  />;

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden font-['Inter']">
      <aside className="w-20 lg:w-72 bg-white border-r border-slate-200 flex flex-col items-center lg:items-stretch py-8 px-6 shadow-xl z-30">
        <div className="flex items-center gap-3 px-2 mb-16"><div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg"><Building2 size={24} /></div><h1 className="text-2xl font-black text-slate-900 hidden lg:block tracking-tighter">NovaSpace</h1></div>
        <nav className="flex-1 space-y-2">
          {!isStaff ? (
            <>
              <button onClick={() => setActiveTab('blueprint')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'blueprint' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><MapIcon size={20} /><span className="font-black text-sm hidden lg:block">Blueprint</span></button>
              <div className="flex flex-col w-full">
                <button 
                  onClick={() => { 
                    setActiveServiceCategory(null);
                    setMenuSource({ type: 'branch', id: currentLocationId });
                    setActiveTab('service_menu'); 
                  }}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${activeTab === 'service_menu' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50 group'}`}
                >
                  <div className="flex items-center gap-4">
                    <Utensils size={20} className={activeTab === 'service_menu' ? '' : 'group-hover:text-blue-600 transition-colors'} />
                    <span className="font-black text-sm hidden lg:block">Service Menu</span>
                  </div>
                </button>
                <AnimatePresence>
                  {basketCount > 0 && (
                    <motion.button
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setIsReviewMenuOpen(true)}
                      className="w-full flex items-center justify-between px-4 py-3 pl-12 rounded-2xl transition-all text-slate-400 hover:bg-slate-50 group overflow-hidden"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCart size={16} className="group-hover:text-blue-600 transition-colors" />
                        <span className="font-black text-sm hidden lg:block">My Basket</span>
                      </div>
                      <span className="hidden lg:block text-[10px] font-black px-2 py-0.5 rounded-lg bg-blue-100 text-blue-600">
                        {basketCount}
                      </span>
                    </motion.button>
                  )}
                
        </AnimatePresence>

              </div>
              <button onClick={() => setActiveTab('my_bookings')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'my_bookings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Calendar size={20} /><span className="font-black text-sm hidden lg:block">My Bookings</span></button>
              <button onClick={() => setShowCreditsModal(true)} className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${activeTab === 'credits' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                <div className="flex items-center gap-4">
                  <Coins size={20} />
                  <span className="font-black text-sm hidden lg:block">Balance</span>
                </div>
                <span className={`hidden lg:block text-[10px] font-black px-2 py-0.5 rounded-lg ${activeTab === 'credits' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
                  {(userProfile?.credits || 0).toLocaleString()} EGP
                </span>
              </button>
            </>
          ) : (userRole === 'owner' || userRole === 'manager') ? (
            <>
              {activeTab !== 'staff_registry_cancelled' && (
                <>
                  {userRole === 'owner' && (codeLoginType === 'global' || !codeLoginType) && (
                    <>
                      <div className="px-4 py-2 mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Owner Access</p>
                      </div>
                      <button onClick={() => { setActiveTab('global_settings'); }} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'global_settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><CreditCard size={20} /><span className="font-black text-sm hidden lg:block">Branch Payments</span></button>
                      <button onClick={() => { setActiveTab('clock_in_access'); }} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'clock_in_access' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Clock size={20} /><span className="font-black text-sm hidden lg:block">Clock In Access</span></button>
                      <button onClick={() => { setActiveTab('property_config'); setConfigView('layout'); }} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'property_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Layout size={20} /><span className="font-black text-sm hidden lg:block">Space Architecture</span></button>
                      <button onClick={() => setActiveTab('cancellation_policies')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'cancellation_policies' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Ban size={20} /><span className="font-black text-sm hidden lg:block">Cancellation Policies</span></button>
                    </>
                  )}
                  
                  <div className="px-4 py-2 mb-4 mt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{userRole === 'owner' ? 'Branch Management' : 'Manager Access'}</p>
                  </div>
                  
                  <button onClick={() => setActiveTab('working_times')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'working_times' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Clock size={20} /><span className="font-black text-sm hidden lg:block">Working Times</span></button>
                  <button onClick={() => setActiveTab('menu_config')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'menu_config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Utensils size={20} /><span className="font-black text-sm hidden lg:block">Menu Management</span></button>
                  <button onClick={() => setActiveTab('staff_analytics')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'staff_analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Clock size={20} /><span className="font-black text-sm hidden lg:block">Staff Analytics</span></button>
                  <button onClick={() => setActiveTab('store_analytics')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'store_analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Store size={20} /><span className="font-black text-sm hidden lg:block">Store Analytics</span></button>
                  <button onClick={() => setActiveTab('payment_analytics')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'payment_analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><div className="flex items-center -space-x-1"><BarChart3 size={20} /><DollarSign size={14} /></div><span className="font-black text-sm hidden lg:block">Payment Analytics</span></button>
                  
                  {userRole === 'owner' && (codeLoginType === 'global' || !codeLoginType) && (
                    <button onClick={() => setActiveTab('staff_management')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'staff_management' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><User size={20} /><span className="font-black text-sm hidden lg:block">Staff Management</span></button>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <div className="px-4 py-2 mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Staff Portal</p>
              </div>
              <button onClick={() => setActiveTab('clock_in')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'clock_in' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Clock size={20} /><span className="font-black text-sm hidden lg:block">Clock In</span></button>
              <button onClick={() => setActiveTab('staff_registry')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'staff_registry' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><ShieldCheck size={20} /><span className="font-black text-sm hidden lg:block">Registry</span></button>
              <button onClick={() => setActiveTab('staff_registry_approved')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'staff_registry_approved' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><CheckCircle2 size={20} /><span className="font-black text-sm hidden lg:block">Approved</span></button>
              <button onClick={() => setActiveTab('blueprint')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'blueprint' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Eye size={20} /><span className="font-black text-sm hidden lg:block">Live View</span></button>
              <button onClick={() => setActiveTab('menu_config')} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'menu_config' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Utensils size={20} /><span className="font-black text-sm hidden lg:block">Menu</span></button>
            </>
          )}
        </nav>
        <div className="mt-auto space-y-2">
          {(!isStaff || codeLoginType === 'all' || (userRole === 'owner')) && (
            <button 
              onClick={() => setIsLocationConfirmed(false)}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-all"
            >
              <ChevronLeft size={20} />
              <span className="font-black text-sm hidden lg:block">Return to Branches</span>
            </button>
          )}
          {(!isStaff || codeLoginType === 'all' || (userRole === 'owner')) && (
            <button 
              onClick={() => { setSelectedVendor(null); setIsLocationConfirmed(false); }} 
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-all"
            >
              <Building size={20} />
              <span className="font-black text-sm hidden lg:block">Return to Coworking Spaces</span>
            </button>
          )}
          <button 
            onClick={handleLogout} 
            className="mt-auto w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 transition-all"
          >
            <LogOut size={20} />
            <span className="font-black text-sm hidden lg:block">Exit Network</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden bg-white/50 relative">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 z-20">
          <div className="flex items-center gap-6">


            <div className="flex items-center gap-4">
              {(userRole !== 'owner' && userRole !== 'manager') && (
                <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <div className="flex flex-col px-4 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="text-xs font-black text-slate-900 bg-transparent outline-none" /></div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="flex flex-col"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time Slot</label><select value={timeInput} onChange={e => setTimeInput(e.target.value)} className="text-xs font-black text-slate-900 bg-transparent outline-none w-16 appearance-none cursor-pointer"><option value="01:00">01:00</option><option value="02:00">02:00</option><option value="03:00">03:00</option><option value="04:00">04:00</option><option value="05:00">05:00</option><option value="06:00">06:00</option><option value="07:00">07:00</option><option value="08:00">08:00</option><option value="09:00">09:00</option><option value="10:00">10:00</option><option value="11:00">11:00</option><option value="12:00">12:00</option></select></div>
                    <div className="flex flex-col gap-0.5"><button onClick={() => setTimePeriod("AM")} className={`text-[8px] font-black px-1.5 py-0.5 rounded ${timePeriod === "AM" ? "bg-blue-600 text-white" : "text-slate-400"}`}>AM</button><button onClick={() => setTimePeriod("PM")} className={`text-[8px] font-black px-1.5 py-0.5 rounded ${timePeriod === "PM" ? "bg-blue-600 text-white" : "text-slate-400"}`}>PM</button></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">

 
             <div className="flex items-center gap-4 px-6 py-3 rounded-2xl border border-transparent text-left">
                <img src={selectedVendor?.logo} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                <div className="flex flex-col items-start"><span className="text-sm font-black text-slate-900">{selectedVendor?.name}</span></div>
             </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0 relative">
          {renderContent()}
        </div>
      </main>

      {showBookingSuccess && <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-6 rounded-3xl shadow-2xl flex items-center gap-5 z-[150] animate-in fade-in slide-in-from-bottom-6"><div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center"><Check size={24} /></div><div><p className="font-black text-xl">Reservation Confirmed!</p></div></div>}
      {bookingError && <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-10 py-6 rounded-3xl shadow-2xl z-[150] font-black animate-in fade-in slide-in-from-bottom-6">{bookingError}</div>}
        
      {/* Basket/Review Modal */}
      <AnimatePresence>
        {isReviewMenuOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsReviewMenuOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <ShoppingCart size={24} />
                  </div>
                  My Basket
                </h3>
                <button onClick={() => setIsReviewMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                {basketCount === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mb-6">
                      <ShoppingCart size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Your basket is empty</h4>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Add some items from the service menu first</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6 mb-10">
                      {Object.entries(basket).filter(([_, qty]) => (qty as number) > 0).map(([id, itemsQty]) => {
                        const qty = itemsQty as number;
                        const item = getMenuItemById(id);
                        if (!item) return null;
                        return (
                          <div key={id} className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                                <div>
                                  <h5 className="font-black text-slate-900">{item.name}</h5>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{qty} x {item.price} EGP</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-black text-slate-900">{item.price * qty} EGP</span>
                                <button 
                                  onClick={() => {
                                    const newBasket = { ...basket };
                                    delete newBasket[id];
                                    setBasket(newBasket);
                                    const newComments = { ...basketComments };
                                    delete newComments[id];
                                    setBasketComments(newComments);
                                    const newDeliveryTimes = { ...basketDeliveryTimes };
                                    delete newDeliveryTimes[id];
                                    setBasketDeliveryTimes(newDeliveryTimes);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-200/50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                >
                                  <X size={16} strokeWidth={3} />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes for this item</label>
                                <input 
                                  type="text"
                                  value={basketComments[id] || ""}
                                  onChange={(e) => setBasketComments(prev => ({ ...prev, [id]: e.target.value }))}
                                  placeholder="e.g. Extra sugar, no ice..."
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-400 transition-all"
                                />
                              </div>
                              <div className="space-y-2 pt-2 pb-1">
                                {(() => {
                                  let selectedIndex = basketDeliveryTimes[id] ? deliveryTimeOptions.indexOf(basketDeliveryTimes[id]) : 0;
                                  if (selectedIndex === -1) selectedIndex = 0;
                                  return (
                                    <>
                                      <div className="flex items-center justify-between ml-1 mb-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">Delivery Time</label>
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{deliveryTimeOptions[selectedIndex]}</span>
                                      </div>
                                      <div className="relative py-2 mt-1 group">
                                        <div className="absolute top-1/2 -mt-1 left-3 right-3 h-2 bg-slate-100 rounded-full pointer-events-none overflow-hidden">
                                          <div className={`h-full transition-all duration-75 ${bookingDuration === 0 ? 'bg-slate-300' : 'bg-blue-500'}`} style={{ width: `${(selectedIndex / Math.max(1, deliveryTimeOptions.length - 1)) * 100}%`, borderRadius: '9999px' }} />
                                        </div>
                                        <div className="absolute top-1/2 left-3 right-3 flex justify-between pointer-events-none z-10" style={{ transform: 'translateY(-50%)' }}>
                                          {deliveryTimeOptions.map((_, i) => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${selectedIndex >= i ? (bookingDuration === 0 ? 'bg-slate-400' : 'bg-white/90') : 'bg-slate-300'}`} />
                                          ))}
                                        </div>
                                        {bookingDuration === 0 && (
                                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md pointer-events-none whitespace-nowrap z-50">
                                            Select duration of stay first to use the slider
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                                          </div>
                                        )}
                                        <input 
                                          type="range"
                                          disabled={bookingDuration === 0}
                                          min={0}
                                          max={Math.max(1, deliveryTimeOptions.length - 1)}
                                          step={1}
                                          value={selectedIndex}
                                          onChange={(e) => setBasketDeliveryTimes(prev => ({ ...prev, [id]: deliveryTimeOptions[parseInt(e.target.value, 10)] }))}
                                          className={`relative w-full appearance-none bg-transparent z-20 focus:outline-none 
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                                            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
                                            [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.15)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-slate-100 ${bookingDuration === 0 ? 'cursor-not-allowed [&::-webkit-slider-thumb]:bg-slate-200 [&::-webkit-slider-thumb]:shadow-none' : 'cursor-pointer'}`}
                                        />
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                      <h5 className="font-black text-blue-900 mb-4 flex items-center gap-2">
                         <Mail size={18} /> Order Comment
                      </h5>
                      <textarea 
                        value={totalOrderComment}
                        onChange={(e) => setTotalOrderComment(e.target.value)}
                        placeholder="Add any general notes for the staff regarding your entire order..."
                        rows={3}
                        className="w-full px-5 py-4 bg-white border border-blue-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-blue-400 transition-all resize-none shadow-inner"
                      />
                    </div>
                  </>
                )}
              </div>
              
              {basketCount > 0 && (
                <div className="p-10 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Basket Total ({basketCount} items)</p>
                    <p className="text-3xl font-black text-slate-900">{basketTotal.toLocaleString()} <span className="text-sm text-blue-600">EGP</span></p>
                  </div>
                  <button 
                    onClick={() => setIsReviewMenuOpen(false)}
                    className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:scale-105 transition-transform"
                  >
                    Confirm Selection
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      
        </AnimatePresence>


      {/* Access Code Modal */}
      <AnimatePresence>
        {showAccessCodeModal && currentLocation && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60 transition-all">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-10 flex flex-col items-center text-center"
            >
              <button onClick={() => setShowAccessCodeModal(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-300 hover:text-slate-600"><X size={24} /></button>
              
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                <ShieldCheck size={40} />
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Branch Information</h3>
              <p className="text-slate-500 font-bold mb-8">Essential connection details for <span className="text-slate-900 font-black">{currentLocation.name}</span>.</p>
                         <div className="w-full p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Staff Gateway Code</span>
                {userRole === 'owner' ? (
                  <input
                    type="text"
                    value={currentLocation.staffAccessCode || ''}
                    onChange={(e) => handleUpdateLocationMeta(currentLocation.id, { staffAccessCode: e.target.value })}
                    className="w-full text-center text-2xl font-black text-emerald-600 tracking-[0.1em] bg-transparent outline-none border-b-2 border-transparent focus:border-emerald-200 transition-colors"
                    placeholder="ENTER CODE"
                  />
                ) : (
                  <span className="text-3xl font-black text-emerald-600 tracking-[0.1em] select-all cursor-copy group-hover:scale-105 transition-transform">
                    {currentLocation.staffAccessCode || 'NOT SET'}
                  </span>
                )}
              </div>

              {userRole !== 'owner' && (
                <div className="w-full p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group mb-8">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Instapay Destination</span>
                  
                  {userRole === 'manager' ? (
                    <div className="flex flex-col w-full gap-3">
                      <select 
                        value={currentLocation.instapayType || 'account'} 
                        onChange={(e) => handleUpdateLocationMeta(currentLocation.id, { instapayType: e.target.value as any })}
                        className="w-full text-center text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl p-2 outline-none focus:border-emerald-300"
                      >
                        <option value="account">Instapay Account (@instapay)</option>
                        <option value="phone">Phone Number</option>
                        <option value="wallet">Mobile Wallet</option>
                      </select>
                      <input
                        type="text"
                        value={currentLocation.instapayAddress || ''}
                        onChange={(e) => handleUpdateLocationMeta(currentLocation.id, { instapayAddress: e.target.value })}
                        className="w-full text-center text-lg font-bold text-emerald-600 bg-transparent outline-none border-b-2 border-emerald-100 focus:border-emerald-400 transition-colors placeholder:text-emerald-200"
                        placeholder={currentLocation.instapayType === 'account' ? "example@instapay" : "Phone number"}
                      />
                      {(!currentLocation.instapayType || currentLocation.instapayType === 'account') && (
                        <div className="mt-2 text-center">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">QR Code</label>
                          {currentLocation.instapayQrCode ? (
                            <div className="relative inline-block group/qr">
                              <img src={currentLocation.instapayQrCode} alt="QR Code" className="w-32 h-32 object-contain bg-white rounded-xl shadow-sm border border-slate-100" />
                              <button onClick={() => handleUpdateLocationMeta(currentLocation.id, { instapayQrCode: undefined })} className="absolute top-1 right-1 p-1 bg-white/90 text-rose-500 rounded-lg opacity-0 group-hover/qr:opacity-100 transition-opacity shadow-sm"><X size={14} /></button>
                            </div>
                          ) : (
                             <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-xs font-bold shadow-sm">
                               <Upload size={14} /> Upload QR
                               <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   const reader = new FileReader();
                                   reader.onload = (e) => handleUpdateLocationMeta(currentLocation.id, { instapayQrCode: e.target?.result as string });
                                   reader.readAsDataURL(file);
                                 }
                               }} />
                             </label>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {currentLocation.instapayType && (
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-slate-100">
                          {currentLocation.instapayType === 'account' ? 'Instapay Account' : currentLocation.instapayType === 'wallet' ? 'Mobile Wallet' : 'Phone Number'}
                        </span>
                      )}
                      <span className="text-xl font-black text-emerald-600 select-all cursor-copy">
                        {currentLocation.instapayAddress || 'NOT SET'}
                      </span>
                      {(!currentLocation.instapayType || currentLocation.instapayType === 'account') && currentLocation.instapayQrCode && (
                        <div className="mt-3 p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                          <img src={currentLocation.instapayQrCode} alt="QR Code" className="w-40 h-40 object-contain" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-3 py-3 px-6 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100">
                <Check size={16} strokeWidth={3} />
                Synced & Active
              </div>
            </motion.div>
          </div>
        )}
      
        </AnimatePresence>


        {showCreditsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden">
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95">
              {renderCredits(true, () => setShowCreditsModal(false))}
            </div>
          </div>
        )}
    </div>
  );
};

export default App;
