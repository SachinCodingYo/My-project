export interface ApiResponse<T> {
  success: boolean;
  statusCode: string;
  message: string;
  timestamp: string;
  data: T;
}

export interface LoginPayload {
  emailOrMobile: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface JwtPayload {
  id: string;
  role: "ADMIN" | "MR" | "USER";
  iat?: number;
  exp?: number;
}

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  image?: string;
  role: "MR";
  isActive?: boolean;
  isOnline?: boolean;
  createdAt?: string;
}

export type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "ESIM_ACTIVATED"
  | "FAILED"
  | "CANCELLED";

export type MRAllowedOrderStatus =
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "ESIM_ACTIVATED";

export interface MrEarningSummary {
  totalEarned: number;
  pendingPayout: number;
  paidAmount: number;
  totalDeliveries: number;
  totalDistanceTravelled: number;
}

export type PaymentMethod = "ONLINE" | "UPI" | "NETBANKING" | "COD";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface OrderAddress {
  _id: string;
  houseNo?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface OrderPlan {
  _id: string;
  price?: number;
  validity?: number;
  data?: string;
  calls?: string;
}

export interface OrderUser {
  _id?: string;
  fullName?: string;
  mobile?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;

  customer?: {
    fullName: string;
    mobile: string;
  };

  address?: OrderAddress;

  planId?: OrderPlan;

  assignedTo?: {
    _id: string;
    fullName: string;
    mobile: string;
  } | null;

  existingNumber?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryCharge: number;
  totalAmount: number;
  amountToCollect: number;
  planPriceAtPurchase?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MrLocationPayload {
  lat: number;
  lng: number;
  speed?: number;
  accuracy?: number;
  batteryLevel?: number;
}

export interface MrLiveLocation {
  userId: string;
  lat: number;
  lng: number;
  speed?: number;
  accuracy?: number;
  timestamp: number;
}

export interface ChangePasswordPayload {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  mobile?: string;
}

// KYC types
export type KycStep = 1 | 2 | 3 | 4 | 5;
export type KycStatus =
  | "not_submitted"
  | "initiated"
  | "aadhaar_verified"
  | "pan_verified"
  | "bank_verified"
  | "video_uploaded"
  | "pending"
  | "approved"
  | "rejected";

export type VideoKycStatus = "pending" | "verified" | "failed";

export interface KYCResponse {
  _id?: string;
  userId?: string;
  status: KycStatus;
  fullname?: string;
  aadhaarHolderName?: string;
  panHolderName?: string;
  bankHolderName?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  aadhaarRefId?: string | null;
  aadhaarVerified?: boolean;
  panVerified?: boolean;
  bankVerified?: boolean;
  isVideoVerified?: boolean;
  videoKycStatus?: VideoKycStatus;
  videoUploadedAt?: string;
  videoReviewedAt?: string;
  kycVideo?: string;
  isKycVerified?: boolean;
  rejectionReason?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AadhaarOtpResponse {
  message: string;
  refId: string;
}

export interface AadhaarOtpPayload {
  aadhaar: string;
}

export interface AadhaarVerifyPayload {
  refId: string;
  otp: string;
}

export interface PanVerificationData {
  pan: string;
  name?: string;
}

export interface BankVerificationData {
  account: string;
  ifsc: string;
  name?: string;
  phone: string;
}

export interface LocalKycState extends KYCResponse {
  aadhaar?: string;
  pan?: string;
  fullName?: string;
  phone?: string;
}

export type NotificationType =
  | "OTP"
  | "SIM_RENEWAL"
  | "LOW_BALANCE"
  | "PLAN_EXPIRY"
  | "SUPPORT_TICKET"
  | "SYSTEM"
  | "ORDER_PLACED"
  | "ORDER_ASSIGNED"
  | "MR_ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "SIM_DELIVERED"
  | "SIM_ACTIVATED"
  | "LOCATION_UPDATE";

export interface Notification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  sentVia: ("EMAIL" | "SMS" | "IN_APP")[];
  createdAt: string;
  updatedAt?: string;
}
