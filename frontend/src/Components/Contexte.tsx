import React, { useContext, useEffect, useState } from "react";
import { getUser } from "../Api/api";
import { getLoginInfo } from "./Logincontext";
import { UserContext, UserInfo } from "./UserContext";
import { UserResource } from "../util/Resources";

const Contexte = () => {
    const [user, setUser] = useState<UserResource | null>(null);

    // Zugriff auf den UserContext
    const contexte = useContext(UserContext);

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
                <ul>
                    {data.map((item: any, index: number) => (
                        <li key={index}>{renderData(item)}</li>
                    ))}
                </ul>
            );
        } else if (Array.isArray(data) && data.length === 0) {
            return <span>keine Daten</span>;
        } else if (typeof data === "object" && data !== null) {
            return Object.entries(data).map(([key, value]) => (
                <tr key={key}>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{key}</td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{renderData(value)}</td>
                </tr>
            ));
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
    }, [contexte]);

    return (
        <div>
            <div>
                <h1>Daten in User</h1>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Attribut</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Wert</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>ID</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.id || "keine ID"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>Name</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.name || "kein Name"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>Nachname</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.nachname || "Kein Nachname"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>Username</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.username || "Kein Username"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>Admin</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.admin?.toString() || "Keine Information"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>Created At</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Keine Information"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>Abwesend</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.abwesend?.toString() || "Keine Information"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h1>Daten im Context</h1>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <tbody>
                        {renderData(contexte)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Contexte;
