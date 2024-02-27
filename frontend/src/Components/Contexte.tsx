import React, { useContext, useEffect, useState } from "react";
import { getUser } from "../Api/api";
import { getLoginInfo } from "./Logincontext";
import { UserContext, UserInfo } from "./UserContext";
import { UserResource } from "../util/Resources";
import { FahrtContext, FahrtContextProvider, useFahrtContext } from "./FahrtenContext/FahrtContext";


const Contexte = () => {
    const [user, setUser] = useState<UserResource | null>(null);

    // Zugriff auf den UserContext
    const contexte = useContext(UserContext);
    const context = useFahrtContext()

    async function load() {
        const id = getLoginInfo();
        const userData = await getUser(id!.userID);
        setUser(userData);
    }

    useEffect(() => {
        load();
    }, []);

    const renderData = (data: any) => {
        if (Array.isArray(data) && data.length > 0) {
            return (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <tbody>
                        {data.map((item: any, index: number) => (
                            <tr key={index}>
                                <td>{renderData(item)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (Array.isArray(data) && data.length === 0) {
            return <span>keine Daten</span>;
        } else if (typeof data === "object" && data !== null) {
            return (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <tbody>
                        {Object.entries(data).map(([key, value]) => (
                            <tr key={key}>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{key}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{renderData(value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (typeof data === "boolean") {
            return data.toString();
        } else if (data === undefined) {
            return "keine Daten";
        } else {
            return data;
        }
    };

    useEffect(() => {
        console.log("User aus dem Context:", contexte);
        console.log("Fahrten : ")
    }, [contexte]);

    return (
        <div>
            <div>
                <h1>Daten in LoginContext</h1>
                {renderData(user)}
            </div>
            <div>
                <h1>Daten im UserContext</h1>
                {renderData(contexte)}
            </div>
            <div>
                <h1>Daten in FahrtContext</h1>
                {renderData(context)}
            </div>
        </div>
    );
};

export default Contexte;
