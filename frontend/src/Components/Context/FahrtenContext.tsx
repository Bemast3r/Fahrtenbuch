import React, { createContext, useState, ReactNode, useEffect, useContext } from "react"
import { getFahrt, getUser } from '../../Api/api'
import { FahrtResource } from "../../util/Resources"
import { useUser } from "./UserContext"
import { getJWT } from "./Logincontext"


type FahrtenContextValue = {
    fahrten: FahrtResource[] | null;
    setFahrten: React.Dispatch<React.SetStateAction<FahrtResource[] | null>>;
};

const defaultFahrtenContextValue: FahrtenContextValue = {
    fahrten: null,
    setFahrten: () => {} 
};

const FahrtenContext = createContext<FahrtenContextValue>(defaultFahrtenContextValue);

type FahrtProvider = {
    children: ReactNode
}

export const FahrtProvider: React.FC<FahrtProvider> = ({ children }) => {
    const [fahrten, setFahrten] = useState<FahrtResource[] | null>(null)
    const user = useUser()
    const jwt = getJWT()

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.id) {
                try {
                    const data = await getFahrt(user.id);
                    setFahrten(data);
                } catch (error) {
                    setFahrten(null);
                }
            } else {
                setFahrten(null);
            }
        };
    
        fetchData();
    }, [jwt, user]); 
    


    return (
        <FahrtenContext.Provider value={{fahrten, setFahrten}}>
            {children}
        </FahrtenContext.Provider>
    );
};

export const useFahrten = () : FahrtenContextValue | null => useContext(FahrtenContext);


