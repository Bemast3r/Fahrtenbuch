import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoginInfo } from '../Contexte/Logincontext';
import { deleteFahrt, getAllFahrts, getAlleAdmin, getAlleUser, getCompletedTrips, getOngoingTrips, getUser } from '../../Api/api';
import { FahrtResource, UserResource } from '../../util/Resources';
import Navbar from '../Home/Navbar';
import { Accordion } from "../Statistiken/Accordion";
import ExpandFahrt from "../Statistiken/ExpandFahrt";
import Loading from "../../util/Components/LoadingIndicator";
import { Button } from "react-bootstrap";
import ProtectedComponent from '../../util/Components/PreotectComponent';

const Statistik = () => {
    const [user, setUser] = useState<UserResource | null>(null);
    const [tripData, setTripData] = useState<{ completedTrips: number; ongoingTrips: number }>({ completedTrips: 0, ongoingTrips: 0 });
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [adminUsers, setAdminUsers] = useState<number>(0);
    const [fahrts, setFahrts] = useState<FahrtResource[] | null>(null);
    const [counter, setCounter] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadInitialData();
        const intervalId = setInterval(() => {
            loadUser();
            loadTrips();
            loadAllFahrts();
        }, 60000); 

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        loadAllFahrts();
        console.log(counter)
    }, [counter])

    async function loadInitialData() {
        try {
            const id = getLoginInfo();
            if (!id) {
                navigate("/");
                return;
            }
            const userserver = await getUser(id.userID);
            setUser(userserver);
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

    async function handleDelete(fahrt: FahrtResource): Promise<void> {
        try {
            await deleteFahrt(fahrt);
            setCounter(prev => prev + 1);
        } catch (error) {
            console.error('Fehler beim Löschen der Fahrt:', error);
        }
    }

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
            <ProtectedComponent requiredRole="a">
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

                <h2 style={{ textAlign: "center", paddingTop: "35px", textDecoration: "underline", color: "#FFFF" }}>Alle Fahrten</h2>
                <div className="fahrten">

                    {fahrts && fahrts.length > 0 && user ? (
                        <>
                            {Object.entries(groupFahrtenByDate(fahrts)).map(([date, fahrten], index) => (
                                <section key={index} style={{ overflowY: "auto" }}>
                                    <div>
                                        <h2 style={{ paddingLeft: "10px", marginTop: "20px", color: "#FFFF" }}>{date}</h2>
                                        {fahrten.map((fahrt: FahrtResource) => (
                                            <Accordion key={fahrt.id} title={fahrt.abwesend ? fahrt.abwesend + " - " + fahrt.vollname : fahrt.vollname}>
                                                <div className={`infos-${fahrt._id}`}>
                                                    <ExpandFahrt fahrt={fahrt} user={user!} />
                                                    <span>{user.admin && <span><Button id={`deleteButton`} variant="danger" onClick={() => { handleDelete(fahrt); }}>FAHRT LÖSCHEN</Button></span>}</span>
                                                </div>
                                            </Accordion>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </>
                    ) : (
                        !fahrts ? <Loading /> : fahrts.length === 0 ? <h2 className='header'> Es gibt keine Fahrten</h2> : <h2 className='header'> Es gibt keine Fahrten</h2>
                    )}
                </div>
            </ProtectedComponent>
        </>
    );
}

export default Statistik;
