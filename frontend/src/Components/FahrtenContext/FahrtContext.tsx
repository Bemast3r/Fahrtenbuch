import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FahrtResource } from '../../util/Resources';

export type FahrtContextType = {
    fahrten: FahrtResource[];
    addFahrt: (fahrt: FahrtResource) => void;
};

export const FahrtContext = createContext<FahrtContextType>({
    fahrten: [],
    addFahrt: () => {}
});

export const useFahrtContext = () => useContext(FahrtContext);

export const FahrtContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [fahrten, setFahrten] = useState<FahrtResource[]>([]);

    const addFahrt = (fahrt: FahrtResource) => {
        setFahrten(prevFahrten => {
            const updatedFahrten = [...prevFahrten, fahrt];
            console.log("Updated Fahrten:", updatedFahrten);
            return updatedFahrten;
        });
    };

    useEffect(() => {
        console.log("Fahrten im UseEffect", fahrten);
    }, [fahrten]);

    return (
        <FahrtContext.Provider value={{ fahrten, addFahrt }}>
            {children}
        </FahrtContext.Provider>
    );
};
