export type UserResource = {
    id?: string;
    vorname: string;
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

}

export type FahrtResource = {
    _id?: string;
    id?: string;
    fahrerid: string;
    kennzeichen: string;
    kilometerstand?: number;
    kilometerende?: number;
    lenkzeit?: Date[]; // Arbeit mit Fahren
    pause?: Date[]; // Normale Pause
    arbeitszeit?: Date[]; // Arbeiten ohne Fahren
    createdAt?: Date;
    startpunkt: string;
    beendet?: boolean;
    ruhezeit?: { start: Date; stop: Date }[];
    endpunkt?: string;
    abwesend?: string;
    totalArbeitszeit?: number;
    totalLenkzeit?: number;
    totalPause?: number;
    totalRuhezeit?: number;
    vollname?: string;
};

export type LoginResource = {
    /** The JWT */
    "access_token": string,
    /** Constant value */
    "token_type": "Bearer"
}