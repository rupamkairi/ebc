import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// BetterAuth Token (NO BEARER!!!)
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = token;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}
