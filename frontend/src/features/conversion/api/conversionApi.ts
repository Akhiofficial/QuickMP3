const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

// ─── Auth API ───────────────────────────────────────────────────────────────

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  
  return data;
};

export const registerUser = async (email: string, password: string, name?: string) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  return data;
};

export const loginWithGoogleApi = async (code: string, redirectUri: string) => {
  const response = await fetch(`${BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, redirectUri }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Google authentication failed");
  
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  
  return data;
};

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to submit request");
  return data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to reset password");
  return data;
};

// ─── Conversion API ──────────────────────────────────────────────────────────

export const fetchMetadata = async (url: string) => {
  const response = await fetch(`${BASE_URL}/conversion/metadata`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ url }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch metadata");
  return data.data;
};

export const convertVideo = async (url: string, bitrate: string = "320") => {
  const response = await fetch(`${BASE_URL}/conversion/convert`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ url, bitrate }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Conversion failed");
  return data;
};

export const getStatus = async (jobId: string) => {
  const response = await fetch(`${BASE_URL}/conversion/status/${jobId}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch status");
  return data;
};

export const getDownloadUrl = async (jobId: string) => {
  const response = await fetch(`${BASE_URL}/conversion/download/${jobId}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch download URL");
  return data;
};

// ─── Downloads API ──────────────────────────────────────────────────────────

export const getDownloadHistory = async (page: number = 1, limit: number = 10) => {
  const response = await fetch(`${BASE_URL}/downloads?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch download history");
  return data;
};

export const getQuota = async () => {
  const response = await fetch(`${BASE_URL}/downloads/quota`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch quota information");
  return data;
};

// ─── Payments API ───────────────────────────────────────────────────────────

export const createOrder = async (plan: string) => {
  const response = await fetch(`${BASE_URL}/payments/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ plan }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to initiate payment");
  return data;
};

export const verifyPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const response = await fetch(`${BASE_URL}/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(paymentData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Payment verification failed");
  return data;
};

export const getTransactions = async () => {
  const response = await fetch(`${BASE_URL}/payments/transactions`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch billing history");
  return data.transactions;
};

// ─── Admin API ──────────────────────────────────────────────────────────────

export const getAdminStats = async () => {
  const response = await fetch(`${BASE_URL}/admin/stats`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch admin stats");
  return data.stats;
};

export const getAdminUsers = async (page: number = 1, limit: number = 20) => {
  const response = await fetch(`${BASE_URL}/admin/users?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch admin users");
  return data;
};

export const getAdminTransactions = async (page: number = 1, limit: number = 20) => {
  const response = await fetch(`${BASE_URL}/admin/transactions?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch admin transactions");
  return data;
};

export const getAdminDownloads = async (page: number = 1, limit: number = 20) => {
  const response = await fetch(`${BASE_URL}/admin/downloads?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch admin downloads");
  return data;
};
