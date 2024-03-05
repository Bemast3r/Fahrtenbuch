export type UserResource = {
    id?: string;
<<<<<<< HEAD
=======
    vorname: string;
>>>>>>> 7d0482de5a8aa1bd58243445b139cd748181c8ba
    name: string;
    username: string;
    email: string;
    password?: string;
    admin?: boolean;
    createdAt?: Date;
    fahrzeuge?: {
        datum: string,
        kennzeichen: string;
    }[];
    abwesend?: string
}

export type FahrtResource = {
    id?: string
    fahrerid: string; // ID des Fahrers
    kennzeichen: string; // Kennzeichen des Fahrzeugs
    kilometerstand: number;
    kilometerende?: number;
    lenkzeit?: {
        start: Date;
        stop: Date;
    }[]; // Arbeit mit Fahren
    pause?: {
        start: Date;
        stop: Date;
    }[] // Normal Pause
    arbeitszeit?: {
        start: Date;
        stop: Date;
    }[]; // Arbeiten ohne Fahren
    createdAt?: Date; // Datum der Fahrt
    startpunkt: string
    beendet?: boolean
}

export type LoginResource = {
    /** The JWT */
    "access_token": string,
    /** Constant value */
    "token_type": "Bearer"
}