import { type AxiosError } from "axios";
import type { Request, Response } from "express";
import { apiGateway } from "./gateway";
import { jwtDecode } from "jwt-decode";
import { setTokenCookies } from "../lib/helpers";

export async function logInHandler(req: Request, res: Response) {
  try {
    const { data: tokenRes } = await apiGateway.post("/auth", req.body);

    const { accessToken, refreshToken, expiresIn } = tokenRes;
    const user = jwtDecode(accessToken);
    setTokenCookies(res, accessToken, refreshToken, expiresIn);

    return res.json({ accessToken, expiresIn, user, authenticated: true });
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 401) {
      return res
        .status(401)
        .json({ authenticated: false, message: "Invalid email or password" });
    }

    return res
      .status(500)
      .json({ authenticated: false, message: "Login failed" });
  }
}
