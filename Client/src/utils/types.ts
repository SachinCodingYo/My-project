
export interface LoginPayload {
  emailOrMobile: string;
  password: string;
}


export interface LoginResponse {
  token: string;
  message?: string;
  user: {
    _id: string;
    fullName: string;
    mobile: string;
  };
}


export interface RegisterPayload {
  fullName: string;
  mobile: string;
  email?: string;
}


export interface RegisterResponse {
  success: boolean;
  statusCode: string;
  message: string;
  timestamp: string;
  data: {
    userId:  string;
  }
}




export interface VerifyOtpPayload {
  userId: string;
  otp: string;
  password: string;
  
}

export interface forgetPayload {
  userId: string;
  otp: string;
  newPassword: string;

}

export interface VerifyOtpResponse {
  token: string;
  message: string;
}



export interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;      // optional
  address?: string;    // optional
  avatarUrl?: string;  // optional
}
