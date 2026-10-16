import axios from "axios";
import { ENV } from "../config/env";
import { getAccessToken, removeAccessToken } from "../utils/token";

const axiosInstance = axios.create({
    baseURL: ENV.API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 120000,
});

// ─── Request Interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        // Don't treat a failed LOGIN attempt (wrong email/password) as an
        // "expired session" — only auto-redirect when a 401 comes back for an
        // already-authenticated request elsewhere in the app.
        const isAuthEndpoint = error.config?.url?.includes("/auth/login");

        if (status === 401 && !isAuthEndpoint) {
            // Token expired or invalid — clear token and redirect to login
            removeAccessToken();
            window.location.href = "/login";
        }

        // Normalize error message for UI consumption
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Something went wrong";

        return Promise.reject({ ...error, message });
    }
);

export default axiosInstance;