import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./src/Router/UserRouter";
import fahrrouter from "./src/Router/FahrtRouter";
import loginRouter from "./src/Login/LoginRouter";
import moment from "moment-timezone";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

const app = express();

app.use(cors({
    origin: "https://fahrtenbuch-frontend.vercel.app",
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));



app.use(express.json({ limit: "5mb" }));
app.use(bodyParser.json());

app.use("/api/user", userRouter);
app.use("/api/fahrt", fahrrouter);
app.use("/api/login", loginRouter);

app.get("/", (_, res) => { res.send('SKM Server läuft'); });

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});

mongoose.Promise = Promise;
mongoose.connect(MONGOURL);
mongoose.connection.on("error", (error) => console.log(error));
mongoose.connection.once("open", () => {
    console.log("Erfolgreich mit der Datenbank verbunden!");
});

moment.tz.setDefault("Europe/Berlin");

export default app;
