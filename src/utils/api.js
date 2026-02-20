
export const getApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanUrl}${cleanEndpoint}`;
};