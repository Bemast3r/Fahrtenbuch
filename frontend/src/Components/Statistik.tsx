import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoginInfo } from './Logincontext';
import { deleteFahrt, getAllFahrts, getAlleAdmin, getAlleUser, getCompletedTrips, getOngoingTrips, getUser } from '../Api/api';
import { FahrtResource, UserResource } from '../util/Resources';
import Navbar from './Navbar';
import { Accordion } from "./Accordion";
import ExpandFahrt from "./ExpandFahrt";
import Loading from "./LoadingIndicator";
import { Button } from "react-bootstrap";
import ProtectedComponent from './PreotectComponent';

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
            <ProtectedComponent requiredRole="a">
                <main>
                    <h1 className="uberschrift">Statistiken</h1>
                    <div className="analyse">
                        <div className="sales">
                            <div className="status">
                                <div className="info">
                                    <h3 className="uberschrift-klein">Alle Fahrten</h3>
                                    <h1 className="zahlen">{tripData.completedTrips + tripData.ongoingTrips}</h1>
                                </div>
                                <div className="progresss">
                                    <svg>
                                        <circle cx="38" cy="38" r="36"></circle>
                                    </svg>
                                    <div className="percentage">
                                        <p className="prozent">+81%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="visits">
                            <div className="status">
                                <div className="info">
                                    <h3 className="uberschrift-klein">Laufende Fahrten</h3>
                                    <h1 className="zahlen">{tripData.ongoingTrips}</h1>
                                </div>
                                <div className="progresss">
                                    <svg>
                                        <circle cx="38" cy="38" r="36"></circle>
                                    </svg>
                                    <div className="percentage">
                                        <p className="prozent">-48%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="searches">
                            <div className="status">
                                <div className="info">
                                    <h3 className="uberschrift-klein">Beendete Fahrten</h3>
                                    <h1 className="zahlen">{tripData.completedTrips}</h1>
                                </div>
                                <div className="progresss">
                                    <svg>
                                        <circle cx="38" cy="38" r="36"></circle>
                                    </svg>
                                    <div className="percentage">
                                        <p className="prozent">+21%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="fahrer">
                            <div className="status">
                                <div className="info">
                                    <h3 className="uberschrift-klein">Benutzer</h3>
                                    <h1 className="zahlen">{totalUsers}</h1>
                                </div>
                                <div className="progresss">
                                    <svg>
                                        <circle cx="38" cy="38" r="36"></circle>
                                    </svg>
                                    <div className="percentage">
                                        <p className="prozent">+11%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="admins">
                            <div className="status">
                                <div className="info">
                                    <h3 className="uberschrift-klein">Admins</h3>
                                    <h1 className="zahlen">{adminUsers}</h1>
                                </div>
                                <div className="progresss">
                                    <svg>
                                        <circle cx="38" cy="38" r="36"></circle>
                                    </svg>
                                    <div className="percentage">
                                        <p className="prozent">+72%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>

                <div className="fahrten">
                    {fahrts && fahrts.length > 0 && user ? (
                        <>
                            {Object.entries(groupFahrtenByDate(fahrts)).map(([date, fahrten], index) => (
                                <section key={index} style={{ overflowY: "auto" }}>
                                    <div>
                                        <h2 style={{ paddingLeft: "10px", marginTop: "50px", color: "#FFFF" }}>{date}</h2>
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
