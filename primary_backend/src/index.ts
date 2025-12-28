import "dotenv/config";
import express from "express";
import { userRouter } from "./router/user.js";
const app = express();

import "dotenv/config";
app.use(express.json());


app.use("/api/v1/user", userRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
