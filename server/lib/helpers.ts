import type { Response } from "express";
import { serialize } from "cookie";
import process from "node:process";

export function setTokenCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  expiresIn: string,
) {
  res.setHeader("Set-Cookie", [
    serialize("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(+expiresIn * 1000),
      maxAge: 60 * 60 * 24 * 30,
    }),
    serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(+expiresIn * 1000),
      maxAge: 60 * 60 * 24 * 30,
    }),
    serialize("expiresIn", expiresIn, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(+expiresIn * 1000),
      maxAge: 60 * 60 * 24 * 30,
    }),
  ]);
}
