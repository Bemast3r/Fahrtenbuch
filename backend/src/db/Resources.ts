
export type UserResource = {
    name: string;
    nachname: string;
    username: string;
    admin?: boolean;
    password?: string;
    createdAt?: Date;
    fahrzeuge?: {
        datum: Date;
        kennzeichen: string;
    }[];
}

export type LoginResource = {
    /** The JWT */
    "access_token": string,
    /** Constant value */
    "token_type": "Bearer"
}
