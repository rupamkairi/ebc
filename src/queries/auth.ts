import { api } from "@/lib/axios";

export interface SendOtpPayload {
  phoneNumber: string;
}

export interface VerifyOtpPayload {
  phoneNumber: string;
  code: string;
}

export async function sendOtp(payload: SendOtpPayload) {
  const res = await api.post("/auth/phone-number/send-otp", payload);
  return res.data;
}

export async function verifyOtp(payload: VerifyOtpPayload) {
  const res = await api.post("/auth/phone-number/verify", payload);
  return res.data;
}

export async function fetchCurrentUser() {
  const res = await api.get("/user/me");
  return res.data?.user || null;
}
