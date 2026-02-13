import type { Request, Response } from "express";

export async function logOutHandler(req: Request, res: Response) {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.clearCookie("expiresIn");
  return res.status(200).json({ authenticated: false });
}
