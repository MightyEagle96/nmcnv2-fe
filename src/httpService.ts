import axios from "axios";

export const baseURL = import.meta.env.PROD
  ? "/api"
  : `${window.location.origin.replace("5173", "4000")}/api`;

console.log(baseURL);
const httpService = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// No need to store or attach tokens manually anymore
httpService.interceptors.request.use(
  (config) => {
    // you can add custom headers here if needed
    return config;
  },
  (error) => Promise.reject(error),
);
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

httpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue failed requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => httpService(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try refresh
        await httpService.get("/account/refresh"); // 🚨 Make sure this matches your backend

        processQueue(null);
        return httpService(originalRequest);
      } catch (err: any) {
        processQueue(err, null);

        // 🚨 Both original + refresh failed with 401 → redirect
        if (err.response?.status === 401) {
          console.warn("Both tokens expired. Logging out...");
          window.location.href = "/"; // clear session
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Fallback error handling
    if (error.response) {
      return Promise.reject(error);
    }

    return Promise.reject(new Error("Network connection lost"));
  },
);

export { httpService };
