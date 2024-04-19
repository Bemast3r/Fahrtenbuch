<<<<<<< HEAD
import fahrrouter from "../../Router/FahrtRouter";
import loginRouter from "../../Login/LoginRouter";
=======
import loginRouter from "../Login/LoginRouter";
import fahrrouter from "../Router/FahrtRouter";
>>>>>>> 7d0482de5a8aa1bd58243445b139cd748181c8ba
import userRouter from "../../Router/UserRouter";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use("*", express.json());
app.use(bodyParser.json());
app.use(cors({ origin: "http://127.0.0.1:3000" }));
app.use("/api/login", loginRouter);
app.use("/api/user", userRouter);
<<<<<<< HEAD
app.use("/api/fahrt", fahrrouter);
=======
app.use("/api/fahrt", fahrrouter)

>>>>>>> 7d0482de5a8aa1bd58243445b139cd748181c8ba
export default app;