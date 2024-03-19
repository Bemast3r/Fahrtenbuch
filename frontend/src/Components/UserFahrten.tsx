import React, { useEffect, useState } from "react";
import { FahrtResource, UserResource } from "../util/Resources";
import { getLoginInfo } from "./Logincontext";
import { getFahrt, getUser } from "../Api/api";
import Loading from "./LoadingIndicator";
import ExpandFahrt from "./ExpandFahrt";
import { Accordion } from "./Accordion";

const UserFahrten: React.FC = () => {
    const [user, setUser] = useState<UserResource | null>(null);
    const [meineFahrten, setMeineFahrten] = useState<FahrtResource[] | []>([]);

    async function getU() {
        const id = getLoginInfo();
        const userData = await getUser(id!.userID);
        setUser(userData);
        const fahrten = await getFahrt(id!.userID);
        setMeineFahrten(fahrten);
    }

    useEffect(() => {
        getU();
    }, []);

    // Funktion zur Gruppierung der Fahrten nach Datum
    function groupFahrtenByDate(fahrten: FahrtResource[]) {
        return fahrten.slice().reverse().reduce((acc: { [date: string]: FahrtResource[] }, fahrt: FahrtResource) => {
            const date = new Date(fahrt.createdAt!).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(fahrt);
            return acc;
        }, {});
    }

    return (
        <>
            {user ? (
                <>
                    <div style={{padding:"10px"}}>
                        <h1>Hallo, {user.vorname ? user.vorname : "" + " "} {user.name ? user.name : ""}</h1>
                        <h3>Hier sind ihre Statistiken</h3>
                        {meineFahrten.length > 0 ? (
                            <>
                                {Object.entries(groupFahrtenByDate(meineFahrten)).map(([date, fahrten]) => (
                                    <div key={date}>
                                        <h2 style={{marginTop:"20px"}}>{date}</h2>
                                        {fahrten.map((fahrt: FahrtResource) => (
                                            <Accordion key={fahrt.id} title={fahrt.startpunkt}>
                                                <ExpandFahrt fahrt={fahrt}></ExpandFahrt>
                                            </Accordion>
                                        ))}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p>Keine Fahrten gefunden</p>
                        )}
                    </div>
                </>
            ) : (
                <Loading />
            )}
        </>
    );

};

export default UserFahrten;
