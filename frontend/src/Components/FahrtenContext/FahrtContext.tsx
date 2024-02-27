import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FahrtResource } from '../../util/Resources';

// Definieren Sie den Typ für den Fahrt-Context
export type FahrtContextType = {
    fahrten: FahrtResource[]; // Array von FahrtResource-Objekten
    addFahrt: (fahrt: FahrtResource) => void; // Funktion zum Hinzufügen einer Fahrt
};

// Erstellen Sie den Fahrt-Context
export const FahrtContext = createContext<FahrtContextType>({
    fahrten: [],
    addFahrt: () => { } // Standardfunktion, die keine Aktion ausführt
});

// Verwenden Sie diesen Hook in Ihren Komponenten, um auf den Fahrt-Context zuzugreifen
export const useFahrtContext = () => useContext(FahrtContext);

// FahrtContextProvider-Komponente, die den Fahrt-Context bereitstellt
export const FahrtContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [fahrten, setFahrten] = useState<FahrtResource[]>([]);

    // Funktion zum Hinzufügen einer Fahrt
    const addFahrt = (fahrt: FahrtResource) => {
        setFahrten(prevFahrten => [...prevFahrten, fahrt]);
    };

    // Werten Sie den Context-Wert aus
    const fahrtContextValue: FahrtContextType = {
        fahrten,
        addFahrt
    };

    return (
        <FahrtContext.Provider value={fahrtContextValue}>
            {children}
        </FahrtContext.Provider>
    );
};
