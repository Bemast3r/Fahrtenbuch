import React, { Children, createContext, useContext, useState } from "react";

interface FahrtInterface {
    id: string;
    fahrerid: string;
    kennzeichen: string;
    kilometerstand: number;
    kilometerstandende: number;
    startpunkt: string;
    lenkzeit?: { start: Date; stop: Date; }[];
    pause?: { start: Date; stop: Date; }[];
    arbeitszeit?: { start: Date; stop: Date; }[];
    isinFahrt: boolean
    setKilometerstand: (kilometerstand: number) => void;
    setLenkzeit: (lenkzeit: { start: Date; stop: Date; }[]) => void;
    setArbeitszeit: (arbeitszeit: { start: Date; stop: Date; }[]) => void;
    setKilometerstandende: (kilometerstandende: number) => void;
    setKennzeichen: (kennzeichen: string) => void;
    setStartpunkt: (startpunkt: string) => void;
    setisinFahrt: (isinFahrt: boolean) => void;
    setFahrtid: (fahrtid: string) => void;
    setPause: (pause: { start: Date; stop: Date; }[]) => void;
}

const FahrtContext = createContext<FahrtInterface>({
    id: "",
    fahrerid: "",
    kennzeichen: "",
    kilometerstand: 0,
    kilometerstandende: 0,
    startpunkt: "",
    isinFahrt:false,
    setKilometerstand: () => {},
    setLenkzeit: () => {},
    setArbeitszeit: () => {},
    setKilometerstandende: () => {},
    setKennzeichen: () => {},
    setStartpunkt: () => {},
    setisinFahrt: () => {},
    setFahrtid: () => {},
    setPause: () => {},
});

export const FahrtProvider: React.FC = (props) => {
    const [lenkzeit, setLenkzeit] = useState<{ start: Date; stop: Date; }[]>([]);
    const [arbeitszeit, setArbeitszeit] = useState<{ start: Date; stop: Date; }[]>([]);
    const [pause, setPause] = useState<{ start: Date; stop: Date; }[]>([]);
    const [fahrtid, setFahrtid] = useState<string | null>(null);
    const [kilometerstand, setKilometerstand] = useState<number>(0);
    const [kilometerstandende, setKilometerstandende] = useState<number>(0);
    const [kennzeichen, setKennzeichen] = useState<string>("");
    const [startpunkt, setStartpunkt] = useState<string>("");
    const [isinFahrt, setisinFahrt] = useState<boolean>(false);

    const value: FahrtInterface = {
        id: fahrtid || "",
        fahrerid: "",
        kennzeichen,
        kilometerstand,
        kilometerstandende,
        startpunkt,
        lenkzeit,
        pause,
        arbeitszeit,
        isinFahrt,
        setKilometerstand,
        setLenkzeit,
        setArbeitszeit,
        setKilometerstandende,
        setKennzeichen,
        setStartpunkt,
        setisinFahrt,
        setFahrtid,
        setPause,
    };

    return <FahrtContext.Provider value={value} {...props} />
};

export const useFahrt = () => useContext(FahrtContext);
export default FahrtProvider;
