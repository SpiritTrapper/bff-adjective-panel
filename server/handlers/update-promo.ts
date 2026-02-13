import { type AxiosError } from "axios";
import { parse } from "cookie";
import type { Request, Response } from "express";
import { apiGateway } from "./gateway";

export async function updatePromoHandler(req: Request, res: Response) {
  try {
    const { promotedId } = req.body;
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!promotedId) {
      return res.status(400).json({ error: "No promoted entity provided" });
    }

    await apiGateway.patch(`/promo/${promotedId}`, req.body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status(200).json({ success: "ok" });
  } catch (err) {
    const error = err as AxiosError;
    return res.status(500).json({ message: error.message });
  }
}
