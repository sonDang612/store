import axios, { AxiosRequestConfig } from "axios";

import getTokenClient from "@/utils/getTokenClient";

const config: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
};
const configAdmin: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
};
const axiosInstance = axios.create(config);
const axiosInstanceAdmin = axios.create(configAdmin);
axiosInstance.interceptors.request.use(
  async (request) => {
    request.headers.Authorization = `Bearer ${getTokenClient()}`;
    // request.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    // request.paramsSerializer = (params) => qs.stringify(params);
    return request;
  },
  (error) => Promise.reject(error),
);
axiosInstanceAdmin.interceptors.request.use(
  async (request) => {
    request.headers.Authorization = `Bearer ${getTokenClient(true)}`;
    // request.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    // request.paramsSerializer = (params) => qs.stringify(params);
    return request;
  },
  (error) => Promise.reject(error),
);
axiosInstance.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (err) => {
    const errorMessage = err.response?.data?.message;
    const errorStatus = err.response?.status;
    if (errorMessage) {
      err.message = errorMessage;
    }
    if (errorStatus) {
      err.status = errorStatus;
    }
    return Promise.reject(err);
  },
);
axiosInstanceAdmin.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (err) => {
    const errorMessage = err.response?.data?.message;
    const errorStatus = err.response?.status;
    if (errorMessage) {
      err.message = errorMessage;
    }
    if (errorStatus) {
      err.status = errorStatus;
    }
    return Promise.reject(err);
  },
);
export { axiosInstance, axiosInstanceAdmin };
