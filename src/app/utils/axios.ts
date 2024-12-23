import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: new AxiosHeaders({
    "Content-Type": "application/json",
    Accept: "application/json",
  }),
  // withCredentials: true,
});

// واجهة المستخدم التي تحتوي على التوكن
interface User {
  token: string;
}

// إضافة دالة request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // تحقق من بيئة المتصفح قبل الوصول إلى localStorage
    if (typeof window !== "undefined") {
      const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

      // إذا كان هناك توكن في بيانات المستخدم، نضيفه إلى الهيدر
      if (user?.token) {
        config.headers = new AxiosHeaders({
          ...config.headers.toJSON(),
          Authorization: `Bearer ${user.token}`,
        });
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// إضافة دالة response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error("Error Response:", error.response.data);
    } else if (error.request) {
      console.error("Error Request:", error.request);
    } else {
      console.error("Error Message:", error.message);
    }
    return Promise.reject(error);
  }
);

// دالة get
export const get = <T>(
  url: string,
  params: Record<string, object> = {},
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return axiosInstance.get(url, {
    params,
    ...config,
  });
};

/* export const get2 = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    console.log('Token:', user?.token); // Debugging line to check the token
    return axios.get('http://127.0.0.1:8000/api/v1/admin/quote/fetch_guotes', {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    });
}; */

export const post = <T>(
  url: string,
  data: object,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return axiosInstance.post(url, data, config);
};

export const put = <T>(
  url: string,
  data: object,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return axiosInstance.put(url, data, config);
};

export const del = <T>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return axiosInstance.delete(url, config);
};

export const patch = <T>(
  url: string,
  data: object,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return axiosInstance.patch(url, data, config);
};

export default axiosInstance;
