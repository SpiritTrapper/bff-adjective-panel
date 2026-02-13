import { type AxiosError } from "axios";
import { parse } from "cookie";
import type { Request, Response } from "express";
import { apiGateway } from "./gateway";

export async function getPromoListHandler(req: Request, res: Response) {
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await apiGateway.get("/promo/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: req.query,
    });

    return res.json(result.data);
  } catch (err) {
    const error = err as AxiosError;
    return res.status(500).json({ message: error.message });
  }
}
