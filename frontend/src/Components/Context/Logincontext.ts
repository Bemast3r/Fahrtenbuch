import { JwtPayload, jwtDecode } from "jwt-decode";
import React from "react";

export interface LoginInfo {
    userID: string;
    role: "u" | "a" | "m";
}

const JWT_NAME = "jwt";

export const LoginContext = React.createContext([] as any);

export function getLoginInfo(): LoginInfo | null {

    const jwt = localStorage.getItem(JWT_NAME);
    if (!jwt)
        return null;

    const payload: JwtPayload & { role: "u" | "a" | "m" } = jwtDecode(jwt);
    const exp: number = Number(payload.exp ?? 0);
    const userID: string | undefined = payload.sub;
    const role: "a" | "u" | "m" = payload.role;

    if (Date.now() >= exp * 1000) {
        removeJWT();
        window.location.href = "/";
        return null;
    }

    if (!userID || !role){
        return null;
    }
    return { userID: userID, role: role };
}

export function setJWT(jwt: string): void {
    localStorage.setItem(JWT_NAME, jwt);
}

export function getJWT(): string | null {
    return localStorage.getItem(JWT_NAME);
}

export function removeJWT(): void {
    localStorage.removeItem(JWT_NAME);
}
