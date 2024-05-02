import React, { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import { getUser } from '../../Api/api';
import { getJWT, getLoginInfo } from './Logincontext';
import { UserResource } from '../../util/Resources';

// Definiere den Typ für den Context-Wert und die setUser-Funktion
type UserContextValue = {
    user: UserResource | null;
    setUser: Dispatch<SetStateAction<UserResource | null>>;
};

// Erstelle den UserContext
const UserContext = createContext<UserContextValue | null>(null);

// Definiere den Typ für die Props des UserProviders
type UserProviderProps = {
    children: ReactNode;
};

// Erstelle den UserProvider, der den Zustand für den aktuellen Benutzer verwaltet
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserResource | null>(null);
    const jwt = getJWT();

    useEffect(() => {
        const fetchData = async () => {
            const id = getLoginInfo();
            if (!user && id && jwt) {
                try {
                    const data = await getUser(id.userID);
                    setUser(data);
                } catch (error) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        fetchData();
    }, [jwt]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Erstelle eine benutzerdefinierte Hook, um auf den UserContext zuzugreifen
export const useUser = (): UserContextValue => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser muss innerhalb eines UserProviders verwendet werden');
    }
    return context;
};
