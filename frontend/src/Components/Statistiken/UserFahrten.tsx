import React, { useEffect, useState } from "react";
import { FahrtResource, UserResource } from "../../util/Resources";
import { getLoginInfo } from "../Context/Logincontext";
import { getFahrt, getUser } from "../../Api/api";
import Loading from "../../util/Components/LoadingIndicator";
import ExpandFahrt from "./ExpandFahrt";
import { Accordion } from "./Accordion";
import Navbar from "../Home/Navbar";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../Context/UserContext";
import { useFahrten } from "../Context/FahrtenContext";

const UserFahrten: React.FC = () => {
    const user = useUser()
    const fahrtContext = useFahrten()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate("/")
        }
    }, [])

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
                        {fahrtContext !== null && fahrtContext.fahrten && fahrtContext.fahrten.length > 0 ? (
                            <>
                                {Object.entries(groupFahrtenByDate(fahrtContext.fahrten)).map(([date, fahrten]) => (
                                    <div key={date}>
                                        <h2 style={{ marginTop: "20px", padding: "10px" }}>{date}</h2>
                                        {fahrten.map((fahrt: FahrtResource) => (
                                            <Accordion key={fahrt.id} title={fahrt.abwesend ? fahrt.abwesend : fahrt.startpunkt}>
                                                <div className={`infos-${fahrt._id}`}>
                                                    <ExpandFahrt fahrt={fahrt} user={user} />
                                                </div>

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
    )
}


export default UserFahrten;
