import React, { useEffect, useState } from "react";
import { FahrtResource, UserResource } from "../util/Resources";
import { getLoginInfo } from "./Logincontext";
import { getFahrt, getUser } from "../Api/api";
import Loading from "./LoadingIndicator";
import ExpandFahrt from "./ExpandFahrt";
import { Accordion } from "./Accordion";
import Navbar from "./Navbar";


const UserFahrten: React.FC = () => {
    const [user, setUser] = useState<UserResource | null>(null);
    const [meineFahrten, setMeineFahrten] = useState<FahrtResource[] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function getU() {
        const id = getLoginInfo();
        const userData = await getUser(id!.userID);
        setUser(userData);
        const fahrten = await getFahrt(id!.userID);
        setMeineFahrten(fahrten);
        setLoading(false);
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
            {loading ? (
                <><h1 className="header">Statistiken werden geladen</h1><Loading /></>
            ) : (
                <>
                    {user && (
                        <>
                            <Navbar />
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <div style={{ padding: "10px" }}>
                                <h3 style={{ textAlign: "center", paddingTop: "35px", textDecoration: "underline" }}>Ihre letzten Fahrten</h3>
                                {meineFahrten.length > 0 ? (
                                    <>
                                        {Object.entries(groupFahrtenByDate(meineFahrten)).map(([date, fahrten]) => (
                                            <div key={date}>
                                                <h2 style={{ marginTop: "20px" , padding: "10px"}}>{date}</h2>
                                                {fahrten.map((fahrt: FahrtResource) => (
                                                    <Accordion key={fahrt.id} title={fahrt.abwesend ? fahrt.abwesend : fahrt.startpunkt}>
                                                        <ExpandFahrt fahrt={fahrt} />
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
                    )}
                </>
            )}
        </>
    );
};

export default UserFahrten;
