import axios from "axios";

import type { TokensRefreshResponse } from "@lib/types";

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const proxyAPIGateway = axios.create({
  baseURL: "/api",
  ...axiosConfig,
});

proxyAPIGateway.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const {
          data: { accessToken },
        } = await proxyAPIGateway.post<TokensRefreshResponse>("/refresh");
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return proxyAPIGateway(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
