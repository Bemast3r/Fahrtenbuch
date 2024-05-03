import express from "express";
import { verifyPasswordAndCreateJWT } from "./authentication/LoginService";
import { body, validationResult } from "express-validator";

const loginRouter = express.Router();

loginRouter.post("/",
    body('username').isString(),
    body('password').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { username, password } = req.body;
            const jwtString = await verifyPasswordAndCreateJWT(username, password);
            if (!jwtString) {
                return res.status(401).json({ message: "Can't create a JWT." });
            } else {
                const loginRes = { token_type: "Bearer", access_token: jwtString };
                return res.status(201).json(loginRes);
            }
        } catch (error) {
            return res.sendStatus(500);
        }
    }
);


loginRouter.get("/get", (_, res) => { res.send('Login läuft'); });


export default loginRouter;
