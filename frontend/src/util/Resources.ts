
export type UserResource = {
    id?:string;
    name: string;
    nachname: string;
    username: string;
    admin?: boolean;
    password?: string;
    createdAt?: Date;
    fahrzeuge?: {
        datum: string,
        kennzeichen: string;
    }[];
    abwesend?:boolean
}

export type FahrtResource = {
    id?:string
    fahrerid: string; // ID des Fahrers
    kennzeichen: string; // Kennzeichen des Fahrzeugs
    kilometerstand: number;
    kilometerende: number;
    lenkzeit: {
        start: Date;
        stop: Date;
    }[]; // Arbeit mit Fahren
    pause: {
        start: Date;
        stop: Date;
    }[] // Normal Pause
    arbeitszeit: {
        start: Date;
        stop: Date;
    }[]; // Arbeiten ohne Fahren
    // createdAt?: Date; // Datum der Fahrt
}




export type LoginResource = {
    /** The JWT */
    "access_token": string,
    /** Constant value */
    "token_type": "Bearer"
}