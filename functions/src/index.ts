import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "../../artifacts/api-server/src/routes/index";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

export const api = onRequest(
  { region: "asia-southeast1", cors: true, memory: "512MiB" },
  app,
);
