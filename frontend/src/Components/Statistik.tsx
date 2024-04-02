import "./statistiken.css"
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJWT, setJWT, getLoginInfo } from './Logincontext';
import { getAllFahrts, getAlleAdmin, getAlleUser, getCompletedTrips, getOngoingTrips, getUser } from '../Api/api';
import { FahrtResource, UserResource } from '../util/Resources';
import Navbar from './Navbar';
import { Accordion } from "./Accordion";
import ExpandFahrt from "./ExpandFahrt";
import Loading from "./LoadingIndicator";
import { Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import html2tocanvas from 'html2canvas'

const Statistik = () => {
    const [user, setUser] = useState<UserResource | null>(null);
    const [tripData, setTripData] = useState<{ completedTrips: number; ongoingTrips: number }>({ completedTrips: 0, ongoingTrips: 0 });
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [adminUsers, setAdminUsers] = useState<number>(0);
    const [fahrts, setFahrts] = useState<FahrtResource[] | null>(null);

    const jwt = getJWT();
    const navigate = useNavigate();

    useEffect(() => {
        if (jwt) {
            setJWT(jwt);
        } else {
            navigate("/");
            return;
        }
    }, [jwt]);

    useEffect(() => {
        loadInitialData();
        const intervalId = setInterval(() => {
            loadUser();
            loadTrips();
            loadAllFahrts();
        }, 60000); // Intervall von 60 Sekunden für regelmäßiges Laden der Benutzerdaten

        return () => clearInterval(intervalId);
    }, []);

    async function loadInitialData() {
        try {
            if (!user) {
                const id = getLoginInfo();
                const userserver = await getUser(id!.userID);
                setUser(userserver);
            }
            await loadTrips();
            await loadUser();
            await loadAllFahrts();
        } catch (error) {
            console.error("Fehler beim Laden der Daten:", error);
        }
    }

    async function loadTrips() {
        try {
            const completed = await getCompletedTrips();
            const ongoing = await getOngoingTrips();
            setTripData({ completedTrips: completed.length, ongoingTrips: ongoing.length });
        } catch (error) {
            console.error("Fehler beim Laden der Fahrten:", error);
        }
    }

    async function loadAllFahrts() {
        try {
            const fahrts = await getAllFahrts();
            setFahrts(fahrts);
        } catch (error) {
            console.error("Fehler beim Laden der Fahrten:", error);
        }
    }

    async function loadUser() {
        try {
            const alleUser = await getAlleUser();
            const alleAdmins = await getAlleAdmin();
            const totalUsers = alleUser.length;
            const adminUsers = alleAdmins.length;
            setTotalUsers(totalUsers);
            setAdminUsers(adminUsers);
        } catch (error) {
            console.error("Fehler beim Laden der User:", error);
        }
    }

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
                const doc = new jsPDF('p', 'mm', 'a4');
                const componetwidth = doc.internal.pageSize.getWidth()
                const componentheight = doc.internal.pageSize.getHeight()
                doc.addImage(imgdata, 'JPEG', 15, 0, componetwidth+50, componentheight);
                doc.save(`Fahrt_von_${fahrt.vollname}_am_${formatDateString(new Date(fahrt.createdAt!))}.pdf`);
            });
        } else {
            console.log("Nicht gefunden.");
        }
    };

    return (
        <>
            <Navbar></Navbar>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="row">
                <div className="col-md">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Gesamtanzahl der Fahrten</h5>
                            <p className="card-text">{tripData.completedTrips + tripData.ongoingTrips}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Beendete Fahrten</h5>
                            <p className="card-text">{tripData.completedTrips}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Laufende Fahrten</h5>
                            <p className="card-text">{tripData.ongoingTrips}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Gesamtzahl der Benutzer</h5>
                            <p className="card-text">{totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Admin-Benutzer</h5>
                            <p className="card-text">{adminUsers}</p>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>

            <h2 style={{ textAlign: "center", paddingTop: "35px", textDecoration: "underline" }}>Alle Fahrten</h2>
            <div className="fahrten">
                {fahrts && fahrts.length > 0 ? (
                    <>
                        {Object.entries(groupFahrtenByDate(fahrts)).map(([date, fahrten], index) => (
                            <section key={index} style={{ overflowY: "auto" }}>
                                <div>
                                    <h2 style={{ paddingLeft: "10px", marginTop: "20px" }}>{date}</h2>
                                    {fahrten.map((fahrt: FahrtResource) => (
                                        <Accordion key={fahrt.id} title={fahrt.abwesend ? fahrt.abwesend : fahrt.startpunkt}>
                                            <div className={`infos-${fahrt._id}`}>
                                                <ExpandFahrt fahrt={fahrt} />
                                            </div>
                                        </Accordion>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </>
                ) : (
                    !fahrts ? <Loading /> : fahrts.length === 0 ? <h2> Es gibt keine Fahrten</h2> : <h2> Es gibt keine Fahrten</h2>
                )}
            </div>
        </>
    );
}

export default Statistik;


