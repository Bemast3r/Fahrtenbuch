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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://fahrtenbuch-frontend.vercel.app/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header("Access-Control-Expose-Headers", "Authorization");
    next();
});

const corsOptions = {
    origin: [
        "https://fahrtenbuch-frontend.vercel.app/"
    ], 
    methods: ['GET,PUT,PATCH,POST,DELETE'],
    credentials: true
};

app.use("*", cors(corsOptions));




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
