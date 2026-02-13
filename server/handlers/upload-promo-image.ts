import { type AxiosError } from "axios";
import { parse } from "cookie";
import type { Request, Response } from "express";
import { apiGateway } from "./gateway";
import NodeFormData from "form-data";

export async function uploadPromoImageHandler(req: Request, res: Response) {
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const fd = new NodeFormData();

    fd.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      knownLength: req.file.size,
    });

    if (req.body.promoId) {
      fd.append("promoId", String(req.body.promoId));
    }

    await apiGateway.post("/image", fd, {
      headers: {
        ...fd.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return res.status(201).json({ success: "ok" });
  } catch (err) {
    const error = err as AxiosError;
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
