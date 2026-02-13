import axios from "axios";

export const apiGateway = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: process.env.NODE_ENV === "production",
  headers: {
    "Content-Type": "application/json",
  },
});
