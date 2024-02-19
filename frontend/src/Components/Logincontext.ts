import { JwtPayload, jwtDecode } from "jwt-decode";
import React from "react";

export interface LoginInfo {
    userID: string;
    role: "u" | "a";
}

const JWT_NAME = "jwt";

export const LoginContext = React.createContext([] as any);

export function getLoginInfo(): LoginInfo | null {
    const jwt = localStorage.getItem(JWT_NAME);
    if (!jwt)
        return null;

    const payload: JwtPayload & { role: "u" | "a" } = jwtDecode(jwt);
    const exp: number = Number(payload.exp ?? 0);
    const userID: string | undefined = payload.sub;
    const role: "a" | "u" = payload.role;

    if (Date.now() >= exp * 1000) {
        removeJWT();
        alert("Melde dich erneut an.");
        return null;
    }

    if (!userID || !role)
        return null;

    return { userID: userID, role: role };
}

export function setJWT(jwt: string): void {
    if (!jwt)
        throw new Error("Invalid JWT");
    localStorage.setItem(JWT_NAME, jwt);
}

export function getJWT(): string | null {
    return localStorage.getItem(JWT_NAME);
}

export function removeJWT(): void {
    localStorage.removeItem(JWT_NAME);
}