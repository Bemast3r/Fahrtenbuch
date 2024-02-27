import React, { useContext, useEffect, useState } from "react";
import { getUser } from "../Api/api";
import { getLoginInfo } from "./Logincontext";
import { UserContext, UserInfo } from "./UserContext";
import { UserResource } from "../util/Resources";

const Contexte = () => {
    const [user, setUser] = useState<UserResource | null>(null);
    const [contX, setContX] = useState();

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
        if (typeof data === "object" && data !== null) {
            return (
                <ul>
                    {Object.entries(data).map(([key, value]) => (
                        <p key={key}>
                            <strong>{key}: </strong> {renderData(value)}
                        </p>
                    ))}
                </ul>
            );
        } else if (typeof data === "boolean") {
            return <span>{data.toString()}</span>; // Anzeigen von Boolean-Werten als Zeichenketten
        } else if (data === undefined) {
            return <span>keine Daten</span>;
        } else {
            return <span>{data}</span>;
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
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>ID</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Name</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Nachname</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Username</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Admin</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Created At</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Abwesend</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.id || "keine ID"}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.name || "kein Name"}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.nachname || "Kein Nachname"}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.username || "Kein Username "}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.admin?.toString()}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "kein Datum vorhanden."}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{user?.abwesend?.toString() || "nicht abwesend"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h1>Daten im Context</h1>
            {renderData(contexte)}

        </div>
    );
};

export default Contexte;
