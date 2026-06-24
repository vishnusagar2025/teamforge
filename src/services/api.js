import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 70000, // 70s — handles Render free tier cold start (can take 30-60s)
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect on 401 if we have a token (avoids redirect loop on login page)
    if (err.response?.status === 401) {
      const hasToken = !!localStorage.getItem("tf_token");
      const onAuthPage = ["/login", "/register", "/forgot-password"].some(p =>
        window.location.pathname.startsWith(p)
      );
      if (hasToken && !onAuthPage) {
        localStorage.removeItem("tf_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
