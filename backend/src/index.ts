import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./Router/UserRouter";
import fahrrouter from "./Router/FahrtRouter";
import loginRouter from "./Login/LoginRouter";
dotenv.config();

const PORT: number = 5000
const app = express()

app.use(cors({
    credentials: true
}));

app.use("*", cors({
    origin: ["http:localhost:3000", "http:localhost:5000"] // Frontend 
}));

app.use(function (request: any, response: any, next: any) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header("Access-Control-Expose-Headers", "Authorization");
    next();
});

app.use("*", express.json({ limit: "5mb" }));
app.use(bodyParser.json());

app.use("/api/user", userRouter)
app.use("/api/threadpage", fahrrouter)
app.use("/api/login", loginRouter);
app.use(bodyParser.json())
app.get("/", (_, res) => { res.send('SKM Server läuft') })

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Server runnig on http://localhost:${PORT}/`)
})

const MONGOURL = process.env.MONGO_URL

mongoose.Promise = Promise;
mongoose.connect(MONGOURL)
mongoose.connection.on("error", (error: Error) => console.log(error));
