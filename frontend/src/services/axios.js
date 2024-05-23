import axios from "axios";
import { getLocalStorage } from "../utils";
import { BASE_URL } from "../../clientConfig";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use(
  (config) => {
    const token = getLocalStorage("accessToken");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
