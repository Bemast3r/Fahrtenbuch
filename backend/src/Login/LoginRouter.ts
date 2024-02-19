import express from "express";
import { verifyPasswordAndCreateJWT } from "./authentication/LoginService";
import { body, matchedData, validationResult } from "express-validator";


const loginRouter = express.Router();

loginRouter.post("/",
    body('username').isLength({ min: 2, max: 12 }).isString(),
    body('password').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            console.log("Hello")
            const data = matchedData(req);
            const jwtString = await verifyPasswordAndCreateJWT(data.email, data.password);
            if (!jwtString) {
                return res.status(401).json({ message: "Can't create a JWT." });
            } else {
                const LoginRes = { token_type: "Bearer", access_token: jwtString };
                return res.status(201).json(LoginRes);
            }
        } catch (error) {
            res.sendStatus(405);
            next(error);
        }
    }
);

export default loginRouter;
