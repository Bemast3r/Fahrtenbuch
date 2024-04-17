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


const allowedOrigins = ['https://fahrtenbuch-frontend.vercel.app'];

// CORS-Optionen konfigurieren
const corsOptions = {
    origin: function (origin: string, callback: any) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// const corsOptions = {
//     origin: "*",
//     credential: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// };
app.options("", cors(corsOptions))

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header("Access-Control-Expose-Headers", "Authorization");
    next();
});

app.use(express.json({ limit: "5mb" }));
app.use(bodyParser.json());

app.use("*", cors(corsOptions));


app.use("/api/user", userRouter);
app.use("/api/fahrt", fahrrouter);
app.use("/api/login", loginRouter);


app.get("/", (_, res) => { res.send('SKM Server läuft'); });

const server = http.createServer(app);

mongoose.Promise = Promise;
mongoose.connect(MONGOURL);
mongoose.connection.on("error", (error) => console.log(error));
mongoose.connection.once("open", () => {
    console.log("Erfolgreich mit der Datenbank verbunden!");
});

moment.tz.setDefault("Europe/Berlin");

export default app;
