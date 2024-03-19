import React from "react";

export interface UserInfo {
    id: string,
    name: string
    nachname: string
    username:string
    password: string
    admin?: boolean
    createdAt?: Date
    fahrzeuge: {
        datum: string;
        kennzeichen: string;
    }[];
}

// const USERINFO_NAME = "userinfo";

export const UserContext = React.createContext([] as any);
