
export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
  SELECTED = 'SELECTED'
}

export type RoomType = 'Private' | 'Meeting' | 'Lounge' | 'HotDesk' | 'Service' | 'SharedDesk';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  totalSeats?: number;
  occupiedSeats?: number;
  status: RoomStatus;
  amenities: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  pricePerHour: number;
  images?: string[];
  finishesAt?: string;
  categories?: Category[];
  menu?: MenuItem[];
}

export interface Floor {
  id: string;
  name: string;
  rooms: Room[];
}

export interface SocialLink {
  id: string;
  type: 'call' | 'whatsapp' | 'social';
  value: string; // phone number for call/whatsapp, URL for social
  name?: string; // name to display for social media URLs
}

export interface LocationData {
  id: string;
  vendorId: string;
  name: string;
  description?: string;
  image?: string;
  mapUrl?: string;
  address?: string;
  floors: Floor[];
  tags?: string[];
  city?: string;
  staffAccessCode?: string;
  ownerAccessCode?: string;
  ownerAllAccessCode?: string;
  cancellationPolicy?: string;
  categories?: Category[];
  menu?: MenuItem[];
  acceptedPaymentMethods?: { card: boolean; instapay: boolean; novaPoints: boolean };
  contactEmail?: string;
  contactPhone?: string;
  contactNotes?: string;
  socials?: SocialLink[];
  socialsEnabled?: boolean;
  instapayAddress?: string;
  instapayType?: 'account' | 'phone' | 'wallet';
  instapayQrCode?: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
  name?: string;
}

export interface UserProfile {
  uid?: string;
  name: string;
  role: string;
  email: string;
  pfp: string;
  phone?: string;
  credits: number; // In EGP
  paymentMethods?: PaymentMethod[];
  profession?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string; // This will still store the category ID or name for reference
  image?: string;
  isAvailable?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  description: string;
  color: string;
  locationCount: number;
  access?: string;
  cancellationPolicy?: string;
  categories?: Category[];
  menu?: MenuItem[];
  tags?: string[];
  acceptedPaymentMethods?: { card: boolean; instapay: boolean; novaPoints: boolean };
  staffGatewayCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactNotes?: string;
  socials?: SocialLink[];
  socialsEnabled?: boolean;
}

export interface Reservation {
  id: string;
  roomId: string;
  locationId: string;
  floorId: string;
  vendorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:00
  duration: number; // Hours
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'declined' | 'cancelled' | 'resolved';
  orderStatus?: 'pending' | 'confirmed' | 'cancelled';
  createdAt: number; // Unix timestamp for analytics
  selectedMenuItems?: { itemId: string; quantity: number; comment?: string; deliveryTime?: string }[];
  totalOrderComment?: string;
  totalPrice?: number;
  paymentMethod?: string;
  origin?: 'instore' | 'app';
  hasInstorePurchases?: boolean;
  instapayDetails?: {
    receiptImage?: string;
    payerAddress?: string;
    submittedAt?: number;
    ownerInstapayAccount?: string;
    verifiedAt?: number;
  };
  instapayCancelled?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'topup' | 'purchase' | 'refund';
  date: number;
  description: string;
  paymentMethod?: string;
  origin?: 'instore' | 'app';
  reservationId?: string;
}

export interface EmployeeShift {
  id: string;
  startTime: number;
  endTime: number | null;
  breaks: { start: number; end: number | null }[];
  clockOutPhoto?: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  pfp: string;
  pinCode: string;
  shifts: EmployeeShift[];
}

export interface AIRecommendation {
  roomId: string;
  reasoning: string;
}
