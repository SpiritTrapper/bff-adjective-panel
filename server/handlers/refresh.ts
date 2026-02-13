import { type AxiosError } from "axios";
import { parse } from "cookie";
import type { Request, Response } from "express";
import { apiGateway } from "./gateway";
import { jwtDecode } from "jwt-decode";
import { setTokenCookies } from "../lib/helpers";

function isTokenExpired(expiry?: string): boolean {
  if (!expiry) {
    return true;
  }

  return new Date().getTime() >= parseInt(expiry, 10) * 1000;
}

export async function refreshHandler(req: Request, res: Response) {
  try {
    const cookies = parse(req.headers.cookie || "");
    const oldToken = cookies.refreshToken;
    const expiresIn = cookies.expiresIn;
    const isExpired = isTokenExpired(expiresIn);

    if (!oldToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (oldToken && isExpired) {
      const { data: tokenRes } = await apiGateway.post("/refresh", {
        refreshToken: oldToken,
      });

      const { accessToken, refreshToken, expiresIn } = tokenRes;
      const user = jwtDecode(accessToken);
      setTokenCookies(res, accessToken, refreshToken, expiresIn);

      return res.json({ accessToken, user, authenticated: true });
    }

    if (oldToken && !isExpired) {
      const user = jwtDecode(oldToken);
      return res.json({ accessToken: oldToken, user, authenticated: true });
    }
  } catch (err) {
    const error = err as AxiosError;
    if (error.status !== 401) {
      console.error("Refresh error:", error?.response?.data || error?.message);
      return res
        .status(500)
        .json({ authenticated: false, error: "Authorization failed" });
    }
  }
}
