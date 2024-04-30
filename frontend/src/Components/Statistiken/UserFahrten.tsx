import React, { useEffect, useState } from "react";
import { FahrtResource, UserResource } from "../../util/Resources";
import { getFahrt, getUser } from "../../Api/api";
import Loading from "../../util/Components/LoadingIndicator";
import ExpandFahrt from "./ExpandFahrt";
import { Accordion } from "./Accordion";
import Navbar from "../Home/Navbar";
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';
import html2tocanvas from 'html2canvas'
import { getLoginInfo } from "../Context/Logincontext";
import { useUser } from "../Context/UserContext";

const UserFahrten: React.FC = () => {
    const { user } = useUser()
    const [meineFahrten, setMeineFahrten] = useState<FahrtResource[] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate()

    async function getU() {
        const id = getLoginInfo();
        if (id && id.userID) {
            const fahrten = await getFahrt(id!.userID);
            setMeineFahrten(fahrten);
            setLoading(false);
        } else {
            navigate("/")
        }
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
                <><h1 className="header" style={{ color: "white", paddingTop: "35px", textAlign: "center" }}>Statistiken werden geladen</h1><Loading /></>
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
                                <h3 style={{ textAlign: "center", paddingTop: "35px", textDecoration: "underline", color: "white" }}>Ihre letzten Fahrten</h3>
                                {meineFahrten.length > 0 ? (
                                    <>
                                        {Object.entries(groupFahrtenByDate(meineFahrten)).map(([date, fahrten]) => (
                                            <div key={date}>
                                                <h2 style={{ marginTop: "20px", padding: "10px", color: "white" }}>{date}</h2>
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
                                    <h2 style={{ color: "white" }}>Keine Fahrten gefunden</h2>
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