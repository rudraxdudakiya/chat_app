import axios from "axios";

const rawBaseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
// Ensure a protocol is present to avoid "Unsupported protocol" errors when the env is like "localhost:5000".
const baseURL = rawBaseURL.startsWith("http") ? rawBaseURL : `http://${rawBaseURL}`;

const axiosInstance = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true,
});

export { baseURL };
export default axiosInstance;