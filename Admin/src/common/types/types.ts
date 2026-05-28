export interface LoginPayload {
  emailOrMobile: string;
  password: string;
}

export interface User {
  _id?: string;
  fullName: string;
  email: string;
  mobile?: string;
  image?: string;
  role: "ADMIN" | "MR" | "USER";
  createdAt?: string;
  isActive?: boolean;
  isRedFlagged?: boolean;
}

export type RedFlagUserRole = "ADMIN" | "MR" | "USER";

export interface RedFlagUser {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: RedFlagUserRole;
}

export interface RedFlag {
  _id: string;
  userId: string;
  fullName: string;
  mobile: string;
  email: string;
  role: RedFlagUserRole;
  reason: string;
  remarks: string;
  flaggedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RedFlagApiItem {
  _id: string;
  userId: RedFlagUser;
  reason: string;
  remarks: string;
  isActive: boolean;
  flaggedBy?: string | RedFlagUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface RedFlagFormData {
  identifier: string;
  reason: string;
  remarks: string;
}

export interface RedFlagSearchPayload {
  identifier: string;
}

export interface RedFlagAddPayload {
  identifier: string;
  reason: string;
  remarks: string;
}

export interface RedFlagAddResponse {
  _id: string;
  userId: string;
  reason: string;
  remarks: string;
  flaggedBy: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RemoveRedFlagResponse {
  _id: string;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  //   user: User;
}

export interface ErrorResponse {
  message?: string;
  error?: string;
  err?: string;
}

export interface Operator {
  _id: string;
  name: string;
  logo?: string;
  slug?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Plan {
  _id: string;
  operatorId?: {
    _id: string;
    name: string;
    logo?: string;
  };
  serviceId?: Service;
  planTypeId?: {
    _id: string;
    name: string;
  };
  vipCategoryId?: {
    _id: string;
    name: string;
  };
  planTagsId?: {
    _id: string;
    name: string;
  }[];
  price: number;
  salePrice: number;
  validity: number;
  data?: string;
  calls?: string;
  sms?: string;
  description?: string;
  networkType?: string;
  benefits?: string[];
  isActive: boolean;
  isBusinessSim: boolean;
  simTypes?: ("physical" | "esim")[];
  minQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlanFilters {
  search?: string;
  operatorId?: string;
  planTypeId?: string;
  planTagsId?: string;
  vipCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minValidity?: number;
  maxValidity?: number;
}

export interface PlanFormData {
  operatorId: string;
  serviceId: string;
  planTypeId: string;
  planTagId: string;
  price?: number;
  salePrice?: number;
  validity?: number;
  data?: string;
  calls?: string;
  sms?: string;
  description?: string;
  networkType?: string;
  benefits?: string;
  status: "active" | "inactive";
  isBusinessSim: boolean;
  simTypePhysical: boolean;
  simTypeEsim: boolean;
  minQuantity?: number;
}

export interface PlanPayload {
  operatorId: string;
  serviceId: string;
  planTypeId: string;
  planTagsId: string[];
  price: number;
  salePrice: number;
  validity: number;
  data?: string;
  calls?: string;
  sms?: string;
  description?: string;
  networkType?: string;
  benefits?: string[];
  isActive: boolean;
  isBusinessSim: boolean;
  simTypes?: ("physical" | "esim")[];
  minQuantity?: number;
}

export interface PlanType {
  _id: string;
  name: string;
  slug?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface PlanTypePayload {
  name: string;
  slug?: string;
  isActive: boolean;
}

export interface VipCategory {
  _id: string;
  name: string;
  slug?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface PlanTypeFormData {
  name: string;
  slug: string;
  status: "active" | "inactive";
}

export interface VipCategoryFormData {
  name: string;
  slug: string;
  status: "active" | "inactive";
}

export interface VipCategoryPayload {
  name: string;
  slug: string;
  isActive: boolean;
}

export interface UpdateVipCategoryPayload {
  id: string;
  data: VipCategoryPayload;
}

export interface UpdatePlanTypePayload {
  id: string;
  data: PlanTypePayload;
}

export interface UpdatePlanPayload {
  id: string;
  data: PlanPayload;
}

// export interface OperatorFormData {
//   name: string;
//   slug: string;
//   logo?: string;
//   status: "active" | "inactive";
// }

export interface OperatorFormInputs {
  name: string;
  slug: string;
  status: "active" | "inactive";
  logo?: FileList;
}

export interface UpdateOperatorPayload {
  id: string;
  data: FormData;
}

export interface CursorPaginationResponse<T> {
  results: T[];
  nextCursor?: string | null;
  hasMore: boolean;
}

export interface MR {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  isOnline?: boolean;
  isRedFlagged?: boolean;
  createdAt?: string;
}

export interface MRFormData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  isActive?: boolean;
}

export interface UpdateMRPayload {
  id: string;
  data: Partial<MRFormData>;
}

export interface MRLocation {
  userId: string;
  lat: number;
  lng: number;
  speed?: number;
  accuracy?: number;
  timestamp: number;
}

export interface MRPathPoint {
  lat: number;
  lng: number;
  speed?: number;
  timestamp: number;
}

export interface MRPath {
  mrId: string;
  path: MRPathPoint[];
}
// export interface MR {
//   _id: string;
//   name: string;
//   fullName: string;
//   email: string;
//   mobile: string;
//   role?: string;
//   isVerified?: boolean;
//   createdAt?: string;
//   status?: "active" | "inactive";
// }

// export interface MRFormData {
//   fullName: string;
//   email: string;
//   mobile: string;
//   password: string;
// }
// export interface MRFormData {
//   name: string;
//   email: string;
//   mobile: string;
//   password: string;
//   status: "active" | "inactive";
// }

// export interface UpdateMRPayload {
//   id: string;
//   data: MRFormData;
// }

// export interface UpdateMRPayload {
//   id: string;
//   data: MRFormData;
// }

export interface TicketReply {
  message: string;

  repliedBy: {
    fullName: string;
    role: string;
  };

  createdAt: string;
}

export interface SupportTicket {
  _id: string;
  title: string;
  description: string;

  status: "OPEN" | "IN_PROGRESS" | "CLOSED";

  createdBy: {
    fullName: string;
    email: string;
    role: string;
  };

  replies: TicketReply[];

  createdAt: string;
}

export interface DashboardOrder {
  _id: string;
  orderNumber: string;

  userId: string;
  planId: string;
  serviceId: string;

  planPriceAtPurchase: number;
  deliveryCharge: number;
  totalAmount: number;

  addressId: string;

  status: "PENDING" | "ASSIGNED" | string;
  assignedTo: string | null;

  paymentMethod: "COD" | "ONLINE" | string;
  paymentStatus: "PENDING" | "PAID" | string;

  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  role: string;

  totalUsers: number;
  totalUserRole: number;
  totalMR: number;
  totalServices: number;
  totalOperators: number;
  totalVipCategories: number;
  totalPlanTypes: number;
  totalPlanTags: number;

  recentUsers: DashboardUser[];
  recentOrders: DashboardOrder[];
  assignedOrders: DashboardOrder[];
}

export interface DashboardUser {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: "ADMIN" | "MR" | "USER";
  isVerified?: boolean; // optional (API may not always send)
  isActive?: boolean;   // optional for safety
  createdAt: string;
}

export type PlanTag = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

export type PlanTagFormData = {
  name: string;
  slug: string;
  status: "active" | "inactive";
};

export type PlanTagPayload = {
  name: string;
  slug: string;
  isActive: boolean;
};

export type UpdatePlanTagPayload = {
  id: string;
  data: PlanTagPayload;
};

// ✅ Service Entity (from backend model)
export interface Service {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Form Inputs (React Hook Form)
export interface ServiceFormInputs {
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive";
}

// ✅ Create Payload
export interface CreateServicePayload {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

// ✅ Update Payload
export interface UpdateServicePayload {
  id: string;
  data: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
  };
}
// ✅ Pagination Meta
export interface CursorPagination {
  nextCursor: string | null;
  hasMore: boolean;
}

// ✅ Generic Cursor Response
export interface CursorResponse<T> {
  data: {
    results: T[];
  } & CursorPagination;
}

// 🔥 ORDER STATUS
export type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "ESIM_ACTIVATED"
  | "FAILED"
  | "CANCELLED"
  | "INQUIRY_RECEIVED";

// 🔥 PAYMENT
export type PaymentMethod =
  | "ONLINE"
  | "UPI"
  | "NETBANKING"
  | "COD";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED";

// 🔹 ADDRESS (not in your main types)
export interface Address {
  _id: string;
  houseNo?: string;
  street?: string;
  city?: string;
}

// 🔹 ORDER

export interface Order {
  _id: string;
  orderNumber: string;

  userId: string;

  planId: {
    _id: string;
    price: number;
    validity?: number;
    data?: string;
  };

  serviceId: {
    _id: string;
    name: string;
  };

  addressId: Address;

  assignedTo?: {
    _id: string;
    fullName: string;
    mobile: string;
  } | null;

  status: OrderStatus;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  totalAmount: number;
  deliveryCharge: number;

  createdAt: string;
  updatedAt: string;
}

// 🔹 FILTERS
export interface OrderFilters {
  status?: OrderStatus;
  assignedTo?: string;
  cursor?: string;
}

export interface FancyNumber {
  _id: string;
  number: string;
  price: number;
  salePrice: number;
  isActive: boolean;
  isAvailable: boolean;
  operatorId?: {
    _id: string;
    name: string;
    slug?: string;
    logo?: string;
  };
  vipCategoryId?: {
    _id: string;
    name: string;
    slug?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FancyNumberFilters {
  operatorId?: string;
  vipCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  cursor?: string | null;
  limit?: number;
}

export interface FancyNumberFormData {
  number: string;
  operatorId: string;
  vipCategoryId: string;
  price?: number;
  salePrice?: number;
  status: "active" | "inactive";
  availability: "available" | "unavailable";
}

export interface FancyNumberPayload {
  number: string;
  operatorId: string;
  vipCategoryId?: string | null;
  price: number;
  salePrice: number;
  isActive: boolean;
}

export interface UpdateFancyNumberPayload {
  id: string;
  data: {
    number?: string;
    operatorId?: string;
    vipCategoryId?: string | null;
    price?: number;
    salePrice?: number;
    isActive?: boolean;
    isAvailable?: boolean;
  };
}

export interface AssignedMR {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  isOnline?: boolean;
  isActive?: boolean;
}

export interface ServicePincode {
  _id: string;
  pincode: string;
  isActive: boolean;
  assignedMRs: AssignedMR[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicePincodeFormData {
  pincode: string;
  status: "active" | "inactive";
}

export interface ServicePincodePayload {
  pincode: string;
  isActive: boolean;
}

export interface UpdateServicePincodePayload {
  id: string;
  data: Partial<ServicePincodePayload>;
}

export interface AssignMRToServicePincodePayload {
  pincodeId: string;
  mrId: string;
}

export interface NearbyMRResult {
  mrId: string;
  distance: string;
}

export interface KycUser {
  _id: string;
  fullName?: string;
  fullname?: string;
  email?: string;
  mobile?: string;
}

export interface KycApproval {
  _id: string;
  userId: string | KycUser;
  fullname?: string;
  fatherName?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  aadhaarHolderName?: string;
  panHolderName?: string;
  bankHolderName?: string;
  bankAccount?: string;        // legacy field name
  bankIfsc?: string;           // legacy field name
  bankAccountNumber?: string;  // new field name from updated model
  ifscCode?: string;           // new field name from updated model
  bankName?: string;
  bankPhone?: string;
  status:
    | "not_submitted"
    | "initiated"
    | "aadhaar_verified"
    | "pan_verified"
    | "bank_verified"
    | "video_uploaded"
    | "video_pending"
    | "video_verified"
    | "video_rejected"
    | "pending"
    | "approved"
    | "rejected";
  kycVideo?: string;
  isVideoVerified?: boolean;
  videoKycStatus?: "pending" | "verified" | "failed";
  videoUploadedAt?: string;
  videoReviewedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}
