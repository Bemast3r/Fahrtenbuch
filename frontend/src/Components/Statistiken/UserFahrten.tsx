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
import ProtectedComponent from "../../util/Components/PreotectComponent";
import { Modal } from "react-bootstrap";

const UserFahrten: React.FC = () => {
    const { user } = useUser()
    const [meineFahrten, setMeineFahrten] = useState<FahrtResource[] | []>([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedFahrt, setSelectedFahrt] = useState<FahrtResource | null>(null);
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

    async function removeFromFahrts(fahrtToRemove: FahrtResource): Promise<void> {
        try {
            // Entferne die Fahrt aus der Liste
            setMeineFahrten(prevFahrts => prevFahrts!.filter(fahrt => fahrt._id !== fahrtToRemove._id));
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
            <ProtectedComponent requiredRole="u">
            <h1 className="uberschrift">Meine Fahrten</h1>

                {/* Meine Fahrten */}
                <div className="fahrten">
                    {meineFahrten && meineFahrten.length > 0 ? (
                        <>
                            {Object.entries(groupFahrtenByDate(meineFahrten)).map(([date, fahrten], index) => (
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
                        !meineFahrten ? <Loading /> : <h2 className='header'>Es gibt keine Fahrten</h2>
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

export default UserFahrten;