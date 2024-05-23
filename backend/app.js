import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import gdriveRouter from "./routes/gdrive.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/gdrive", gdriveRouter);

export { app };
