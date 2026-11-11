import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const REFRESH_URL = `${API_URL}/users/refresh`;
const apiClient = axios.create();

let refreshPromise;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest =
      /\/users\/(login|refresh|logout)(?:$|[?#])/.test(requestUrl);

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest ||
      !localStorage.getItem("accessToken")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(REFRESH_URL, {}, { withCredentials: true })
          .then(({ data }) => {
            if (typeof data.accessToken !== "string" || !data.accessToken) {
              throw new Error("The refresh response did not include an access token.");
            }
            localStorage.setItem("accessToken", data.accessToken);
            return data.accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const accessToken = await refreshPromise;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      if (refreshError.response?.status === 401) {
        localStorage.removeItem("accessToken");
        window.dispatchEvent(new Event("auth:session-expired"));
      }
      return Promise.reject(refreshError);
    }
  },
);

export default apiClient;
