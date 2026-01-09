export interface AdminLoginRequest {
  email?: string;
  password?: string;
}

export interface AuthResponse {
  id: string; // session-uuid
  token: string; // jwt-token-string
  userId: string; // user-uuid
  expiresAt: string;
}

export interface CreateAdminRequest {
  email: string;
  name: string;
  password?: string;
}

export interface CreateAdminSubordinateRequest {
  email: string;
  name: string;
  password?: string;
}

export interface SendOtpResponse {
  message: string;
  isNewUser?: boolean;
}

export interface SendOtpRequest {
  phone: string;
  name?: string;
  type?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface SessionResponse {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    ipAddress?: string;
    userAgent?: string;
  };
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: string;
    updatedAt: string;
    image?: string | null;
    role?: string;
    banned?: boolean;
    banReason?: string;
    banExpires?: string;
    phoneNumber?: string | null;
    phoneVerified?: boolean;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}
