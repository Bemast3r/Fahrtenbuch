import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoginInfo } from '../Context/Logincontext';
import { getAllFahrts, getAlleAdmin, getAlleUser, getCompletedTrips, getOngoingTrips, getUser } from '../../Api/api';
import { FahrtResource, UserResource } from '../../util/Resources';
import Navbar from '../Home/Navbar';
import Loading from "../../util/Components/LoadingIndicator";
import ProtectedComponent from '../../util/Components/PreotectComponent';
import { Modal } from 'react-bootstrap';
import ExpandFahrt from '../Statistiken/ExpandFahrt';

const Statistik = () => {
    const [user, setUser] = useState<UserResource | null>(null);
    const [tripData, setTripData] = useState<{ completedTrips: number; ongoingTrips: number }>({ completedTrips: 0, ongoingTrips: 0 });
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [adminUsers, setAdminUsers] = useState<number>(0);
    const [fahrts, setFahrts] = useState<FahrtResource[] | null>(null);
    const [counter, setCounter] = useState<number>(0);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedFahrt, setSelectedFahrt] = useState<FahrtResource | null>(null);

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

    async function removeFromFahrts(fahrtToRemove: FahrtResource): Promise<void> {
        try {
            // Entferne die Fahrt aus der Liste
            setFahrts(prevFahrts => prevFahrts!.filter(fahrt => fahrt._id !== fahrtToRemove._id));
            // Schließe das Modal
            handleCloseModal();
        } catch (error) {
            console.error('Fehler beim Entfernen der Fahrt:', error);
        }
    }

    const handleOpenModal = (fahrt: FahrtResource) => {
        setSelectedFahrt(fahrt);
        setShowConfirmationModal(true);
    };
    const handleCloseModal = () => {
        setSelectedFahrt(null);
        setShowConfirmationModal(false);
    };

    return (
        <>
            <Navbar></Navbar>
            <ProtectedComponent requiredRole="a">
                {/* 5 Statistiken */}
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
                                    {/* <div className="percentage">
                                        <p className="prozent">+81%</p>
                                    </div> */}
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
                                    {/* <div className="percentage">
                                        <p className="prozent">-48%</p>
                                    </div> */}
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
                                    {/* <div className="percentage">
                                        <p className="prozent">+21%</p>
                                    </div> */}
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
                                    {/* <div className="percentage">
                                        <p className="prozent">+11%</p>
                                    </div> */}
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
                                    {/* <div className="percentage">
                                        <p className="prozent">+72%</p>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Alle Fahrten */}
                <div className="fahrten">
                    {fahrts && fahrts.length > 0 ? (
                        <>
                            {Object.entries(groupFahrtenByDate(fahrts)).map(([date, fahrten], index) => (
                                <section key={index} style={{ overflowY: "auto" }}>
                                    <section id="content">
                                        <main>
                                            <div className="table-data">
                                                <div className="order">
                                                    <div className="head">
                                                        <h3>Fahrten vom {date}</h3>
                                                        {/* <i className='bx bx-search' ></i>
                                                        <i className='bx bx-filter' ></i> */}
                                                    </div>
                                                    <table style={{ width: "100%", tableLayout: "fixed" }}>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "33%" }}>Fahrer</th>
                                                                <th style={{ width: "33%" }}>Dauer der Fahrt</th>
                                                                <th style={{ width: "10%" }}>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {fahrten.map((fahrt, fahrtIndex) => {
                                                                const totalDuration = fahrt.totalArbeitszeit! + fahrt.totalLenkzeit! + fahrt.totalPause!;
                                                                const hours = Math.floor(totalDuration / 3600);
                                                                const minutes = Math.floor((totalDuration % 3600) / 60);
                                                                const seconds = totalDuration % 60;
                                                                const formattedSeconds = seconds.toFixed(0).padStart(2, '0');
                                                                const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${formattedSeconds}`;

                                                                return (
                                                                    <tr key={fahrtIndex} onClick={() => handleOpenModal(fahrt)} style={{ cursor: 'pointer' }}>
                                                                        <td style={{ width: "33%" }}>
                                                                            <p key={fahrtIndex}>{fahrt.vollname}</p>
                                                                        </td>
                                                                        <td style={{ width: "33%" }}>{formattedDuration}</td>
                                                                        <td style={{ width: "33%" }}>
                                                                            <span className={`status ${fahrt.beendet === true ? 'completed' : 'pending'}`}>
                                                                                {fahrt.beendet === true ? 'Beendet' : 'Läuft'}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </main>
                                    </section>
                                </section>
                            ))}
                        </>
                    ) : (
                        !fahrts ? <Loading /> : <h2 className='header'>Es gibt keine Fahrten</h2>
                    )}
                </div>

                {/* Modal */}
                <Modal show={showConfirmationModal} onHide={handleCloseModal} size='xl'>
                    <Modal.Header closeButton style={{ marginLeft: "20px", marginRight: "20px", fontSize: "16px" }}>
                        <Modal.Title>Fahrt Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedFahrt && (
                            <div>
                                <ExpandFahrt fahrt={selectedFahrt} user={user!} removeFromFahrt={removeFromFahrts} />
                            </div>
                        )}
                    </Modal.Body>
                </Modal>

            </ProtectedComponent>
        </>
    );
}

export default Statistik;
