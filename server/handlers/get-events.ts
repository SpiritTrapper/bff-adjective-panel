import { type AxiosError } from "axios";
import type { Request, Response } from "express";
import { apiGateway } from "./gateway";

export async function getEventsHandler(req: Request, res: Response) {
  try {
    const result = await apiGateway.get("/search", {
      params: req.query,
    });

    return res.json(result.data);
  } catch (err) {
    const error = err as AxiosError;
    return res.status(500).json({ message: error.message });
  }
}
