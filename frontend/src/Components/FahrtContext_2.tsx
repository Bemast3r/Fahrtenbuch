import React, { createContext, useContext, useState } from 'react';

// Context erstellen
const FahrtContext = createContext<{
    fahrtInfo: { kennzeichen: string; kilometerstand: number; startpunkt: string; };
    setFahrtInformationen: (info: { kennzeichen: string; kilometerstand: number; startpunkt: string; }) => void;
}>({
    fahrtInfo: { kennzeichen: '', kilometerstand: 0, startpunkt: '' },
    setFahrtInformationen: () => { }
});

// Hook verwenden, um auf den Context zuzugreifen
export const useFahrtContext = () => {
    return useContext(FahrtContext);
}

// Provider-Komponente erstellen
export const FahrtProvider: React.FC = ({ children }: any) => {
    const [fahrtInfo, setFahrtInfo] = useState({
        kennzeichen: '',
        kilometerstand: 0,
        startpunkt: ''
    });

    const setFahrtInformationen = (info: { kennzeichen: string; kilometerstand: number; startpunkt: string; }) => {
        setFahrtInfo(info);
    }

    return (
        <FahrtContext.Provider value={{ fahrtInfo, setFahrtInformationen }}>
            {children}
        </FahrtContext.Provider>
    );
}
