import fahrrouter from "../Router/FahrtRouter";
import loginRouter from "../Login/LoginRouter";
import userRouter from "../Router/UserRouter";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use("*", express.json());
app.use(bodyParser.json());
app.use(cors({ origin: "http://127.0.0.1:3000" }));
app.use("/api/login", loginRouter);
app.use("/api/user", userRouter);
app.use("/api/fahrt", fahrrouter);
export default app;