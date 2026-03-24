const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

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

export const registerUser = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  return data;
};

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
  return data.data; // Backend uses result.data for results normally? Let's check backend controller.
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
