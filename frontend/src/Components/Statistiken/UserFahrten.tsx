import React, { useEffect, useState } from "react";
import { FahrtResource, UserResource } from "../../util/Resources";
import { getLoginInfo } from "../Contexte/Logincontext";
import { getFahrt, getUser } from "../../Api/api";
import Loading from "../../util/Components/LoadingIndicator";
import ExpandFahrt from "./ExpandFahrt";
import { Accordion } from "./Accordion";
import Navbar from "../Home/Navbar";
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';

import html2tocanvas from 'html2canvas'

const UserFahrten: React.FC = () => {
    const [user, setUser] = useState<UserResource | null>(null);
    const [meineFahrten, setMeineFahrten] = useState<FahrtResource[] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate()

    async function getU() {
        const id = getLoginInfo();
        if (id && id.userID) {
            const userData = await getUser(id!.userID);
            setUser(userData);
            const fahrten = await getFahrt(id!.userID);
            setMeineFahrten(fahrten);
            setLoading(false);
        } else {
            navigate("/")
        }
    }

    function formatDateString(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}.${month}.${year}`;
    }

    const downloadPDF = (fahrt: FahrtResource) => {
        const capture = document.querySelector(`.infos-${fahrt._id}`) as HTMLElement;
        if (capture) {
            html2tocanvas(capture).then((canvas) => {
                const imgdata = canvas.toDataURL('img/jpeg');
                const doc = new jsPDF('p', 'pt', 'letter');
                const componetwidth = doc.internal.pageSize.getWidth()
                const componentheight = doc.internal.pageSize.getHeight()
                doc.addImage(imgdata, 'JPEG', 0, 0, componetwidth + 150, componentheight);
                doc.save(`Fahrt_von_${fahrt.vollname}_am_${formatDateString(new Date(fahrt.createdAt!))}.pdf`);
            });
        } else {
            console.log("Nicht gefunden.");
        }
    };

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
            )}
        </>
    );
};

export default UserFahrten;
