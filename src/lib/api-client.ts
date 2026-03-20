import { useAuthStore } from "@/store/authStore";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  method?: RequestMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  auth?: boolean; // If true, automatically add Bearer token
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

async function fetchClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    body,
    query,
    auth = true,
    headers: customHeaders,
    ...customConfig
  } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (auth) {
    const token = useAuthStore.getState().token;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Handle Query Params
  let url = `${BASE_URL}${endpoint}`;
  if (query) {
    const queryString = Object.entries(query)
      .filter(([, value]) => value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      )
      .join("&");
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
    credentials: "include",
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401 && headers["Authorization"]) {
        console.warn("[API] 401 Unauthorized for request with token. Logging out...", url);
        useAuthStore.getState().logout();
      } else if (response.status === 401) {
        console.debug("[API] 401 Unauthorized (no token).", url);
      }
      // Try to parse error message from server
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData = null;
      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Ignore if json parsing fails
      }
      throw new ApiError(response.status, errorMessage, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors or other issues
    throw new ApiError(500, (error as Error).message || "Unknown Error");
  }
}

export default fetchClient;
