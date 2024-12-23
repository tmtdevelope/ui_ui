import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Create Axios instance with default config
const axiosInstance = axios.create({
  baseURL: apiUrl, // Your API base URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor if you need to attach tokens
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Only access localStorage in the browser environment
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Error Response:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Error Request:", error.request);
    } else {
      // Something happened setting up the request
      console.error("Error Message:", error.message);
    }
    return Promise.reject(error);
  }
);

// Utility functions for HTTP methods
export const get = (url, params = {}, config = {}) => {
  return axiosInstance.get(url, {
    params, // For query parameters
    ...config, // Additional config if needed
  });
};

export const post = (url, data, config = {}) => {
  return axiosInstance.post(url, data, config);
};

export const put = (url, data, config = {}) => {
  return axiosInstance.put(url, data, config);
};

export const del = (url, config = {}) => {
  return axiosInstance.delete(url, config);
};

export const patch = (url, data, config = {}) => {
  return axiosInstance.patch(url, data, config);
};

export default axiosInstance;
