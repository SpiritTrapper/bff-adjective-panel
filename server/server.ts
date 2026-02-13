import cookieParser from "cookie-parser";
import express from "express";
import * as process from "node:process";

import { refreshHandler } from "./handlers/refresh";
import { logInHandler } from "./handlers/login";
import { logOutHandler } from "./handlers/logout";
import { getPromoListHandler } from "./handlers/promo-list";
import { createPromoHandler } from "./handlers/create-promo";
import { uploadPromoImageHandler } from "./handlers/upload-promo-image";
import { updatePromoHandler } from "./handlers/update-promo";
import { getPromoHandler } from "./handlers/get-promo";
import { deletePromoHandler } from "./handlers/delete-promo";
import multer from "multer";
import { getNewsHandler } from "./handlers/get-news";
import { getEventsHandler } from "./handlers/get-events";
import { getComplexityHandler } from "./handlers/get-complexity";
import { getThemesHandler } from "./handlers/get-themes";
import { getTypesHandler } from "./handlers/get-types";

const app = express();
const PORT = process.env.PROXY_PORT || 3000;

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(cookieParser());

app.get("/api/promo-list", getPromoListHandler);
app.get("/api/get-promo", getPromoHandler);
app.get("/api/get-news", getNewsHandler);
app.get("/api/get-events", getEventsHandler);
app.get("/api/get-complexity", getComplexityHandler);
app.get("/api/get-themes", getThemesHandler);
app.get("/api/get-types", getTypesHandler);
app.post("/api/refresh", refreshHandler);
app.post("/api/login", logInHandler);
app.post("/api/logout", logOutHandler);
app.post("/api/create-promo", createPromoHandler);
app.post(
  "/api/upload-promo-image",
  upload.single("file"),
  uploadPromoImageHandler,
);
app.patch("/api/update-promo", updatePromoHandler);
app.delete("/api/delete-promo", deletePromoHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
