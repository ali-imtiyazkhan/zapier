import "dotenv/config";
import express from "express";
const app = express();
import { userRouter } from "./router/user.js";
import { ZapRouter } from "./router/zap.js";
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", ZapRouter);
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
