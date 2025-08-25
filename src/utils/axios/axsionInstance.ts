import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import i18n from "../i18n";
import { getDecryptedToken } from "../functions/bufferedEncryptedToken";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
});

if(import.meta.env.VITE_API_AUTH !=="token"){
  axiosInstance.defaults.withXSRFToken = true;
  axiosInstance.defaults.withCredentials = true;
}


axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Set static headers first
  config.headers['Accept-Language'] = i18n.language || "en";
  config.headers["X-Api-Key"] = `${import.meta.env.VITE_API_KEY}`;
  config.headers["Platform-Api-Key"] = `${import.meta.env.VITE_PLATFORM_API_KEY}`;
  config.headers['market-scope'] = 'multi';
  config.headers['Accept'] = 'application/json';
  config.headers['Content-Type'] = 'application/json';

   try {
      const token = await getDecryptedToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } 
    } catch (error) {
      console.error('Failed to get token:', error);
    }

  return config;
});


// For Status Codes 
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // if (
    //   error.response.status === 401
    // ) {
    //       localStorage.clear();
    //       window.location.replace("/not-authenticated");
    // } 
    // else if (error.response.status === 403) {
    //   window.location.replace("/forbidden");
    // } else if (error.response.status === 404) {
    //   window.location.replace("/not-found");
    // }else if (error.response.status === 500) {
    //   window.location.replace("/missing-error");
    // }
    return Promise.reject(error);
  } 
);  

export default axiosInstance;