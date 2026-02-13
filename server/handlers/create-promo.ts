import { type AxiosError } from "axios";
import { parse } from "cookie";
import type { Request, Response } from "express";
import { apiGateway } from "./gateway";

export async function createPromoHandler(req: Request, res: Response) {
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data: response } = await apiGateway.post(
      "/promo/create",
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.status(201).json({ id: response.id });
  } catch (err) {
    console.error(err);
    const error = err as AxiosError;
    return res.status(500).json({ message: error.message });
  }
}
