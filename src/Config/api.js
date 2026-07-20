const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_URL = configuredApiUrl && configuredApiUrl.trim()
  ? configuredApiUrl.replace(/\/$/, "")
  : "http://localhost:5001";

export default API_URL;