import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();

import { userRouter } from "./router/user.js";
import { ZapRouter } from "./router/zap.js";
import { triggerRouter } from "./router/trigger.js";
import { actionRouter } from "./router/action.js";

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", ZapRouter);

app.use("/api/v1/trigger", triggerRouter);

app.use("/api/v1/action", actionRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
