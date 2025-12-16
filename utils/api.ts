import axios, { AxiosInstance } from "axios";
import { usePathname } from "next/navigation";
import Router from "next/router"; // ✅ works in Next.js client-side

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const api: AxiosInstance = axios.create({
  baseURL: "/_/api", // your API prefix
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ✅ Request Interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ✅ Response Interceptor (Handle 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Remove token from memory/localStorage if needed
      accessToken = null;
      if (typeof window !== "undefined") {
        // optional: clear session/local storage tokens
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("accessToken");

        // ✅ redirect to sign-in page
        // if (usePathname().startsWith("/doctor")) {
        //   Router.push("/doctor/signin"); // change to your actual login route
        //   return Promise.reject(error);
        // } else {
        //   Router.push("/signin"); // change to your actual login route
        //   return Promise.reject(error);
        // }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
