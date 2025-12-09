import { api } from "@/lib/axios";

export async function sendOtp(payload: { phone: string }) {
  const res = await api.post("/auth/phone-number/send-otp", payload);
  return res.data;
}

export async function verifyOtp(payload: { phone: string; code: string }) {
  const res = await api.post("/auth/phone-number/verify", payload);
  return res.data;
}

export async function fetchCurrentUser() {
  const res = await api.get("/user/me");
  return res.data?.user || null;
}
