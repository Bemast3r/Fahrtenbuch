import dotenv from "dotenv";
dotenv.config()
import { JwtPayload , sign, verify } from "jsonwebtoken";

import { login } from "./AuthenticationService";


const mongoUrl = process.env.MONGO_URL;
const jwtSecret = process.env.JWT_SECRET;
const jwtTTL = process.env.JWT_TTL;

export async function verifyPasswordAndCreateJWT(email: string, password: string): Promise<string | undefined> {
    const secret = jwtSecret
    if (!secret) {
        console.log("secret")
        throw Error("JWT_SECRET not set.");
    }

    const ttl = jwtTTL
    if (!ttl) {
        console.log("tll")
        throw new Error("JWT_TTL not set.");
    }

    const loginResult = await login(email, password);
    if ((loginResult).success === false) {
        console.log("no success")
        return undefined;
    }

    const timeInSec = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
        sub: loginResult.id,
        iat: timeInSec, // Issued At
        role: loginResult.role
    };
    return sign(payload, secret, { algorithm: "HS512", expiresIn: ttl });
}

export function verifyJWT(jwtString: string | undefined): { userId: string, role: "u" | "a" } {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.log("verify secret")
        throw Error("JWT_SECRET not set.");
    }

    const ttl = process.env.JWT_TTL;
    if (!ttl) {
        console.log("verify ttl")
        throw new Error("JWT_TTL not set.");
    }

    if (!jwtString) {
        console.log("verify jwtstring")
        throw new Error("Invalid token.");
    }

    try {
        const payload = verify(jwtString, secret);
        if (
            typeof payload === 'object' &&
            "sub" in payload && payload.sub &&
            "role" in payload && payload.role
        ) {
            console.log(payload)
            return { userId: payload.sub, role: payload.role };
        }
    } catch (err: any) {
        console.log(err)
        throw new Error(err.message);
    }
    console.log("err")
    throw new Error("Invalid payload.");
}
