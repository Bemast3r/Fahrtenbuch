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

// Diese Datei ging 


const PORT = 5000;
const MONGOURL = process.env.MONGO_URL;

const app = express();

const corsOptions = {
    origin: ["https://fahrtenbuch-frontend.vercel.app", "http://localhost:3000"],
    credentials: true, // Set to true if you're using cookies or sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.options("/api/*", cors(corsOptions));

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

server.listen(PORT, () => {
    console.log(`Server runnig on http://localhost:${PORT}/`)
})

mongoose.Promise = Promise;
mongoose.connect(MONGOURL);
mongoose.connection.on("error", (error) => console.log(error));
mongoose.connection.once("open", () => {
    console.log("Erfolgreich mit der Datenbank verbunden!");
});

moment.tz.setDefault("Europe/Berlin");

export default app;
