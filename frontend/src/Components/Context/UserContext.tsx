import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getUser } from '../../Api/api';
import { getJWT, getLoginInfo } from './Logincontext';
import { UserResource } from '../../util/Resources';



// Erstelle den UserContext
const UserContext = createContext<UserResource | null>(null);

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
            if (id) {
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
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

// Erstelle eine benutzerdefinierte Hook, um auf den UserContext zuzugreifen
export const useUser = (): UserResource | null => useContext(UserContext);
