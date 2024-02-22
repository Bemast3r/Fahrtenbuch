
export type UserResource = {
    id?: string;
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
    abwesend?: boolean
}

export type FahrtResource = {
    id?: string
    fahrerid: string; // ID des Fahrers
    kennzeichen: string; // Kennzeichen des Fahrzeugs
    kilometerstand: number;
    kilometerende: number;
    lenkzeit?: number; // Zeit, die der Fahrer am Steuer verbracht hat (in Minuten z.B.)
    arbeitszeit?: number; // Gesamte Arbeitszeit des Fahrers (in Minuten z.B.)
    pause?: number; // Dauer der Pause des Fahrers (in Minuten z.B.)
    // createdAt?: Date; // Datum der Fahrt
}




export type LoginResource = {
    /** The JWT */
    "access_token": string,
    /** Constant value */
    "token_type": "Bearer"
}