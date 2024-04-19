import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import "../FahrtErstellen/fahrtErstellen.css";
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJWT, setJWT, getLoginInfo } from '../Contexte/Logincontext';
import { getFahrt, getUser, postFahrt, updateFahrt } from '../../Api/api';
import { FahrtResource, UserResource } from '../../util/Resources';
import Loading from '../../util/Components/LoadingIndicator';
import { Alert } from 'react-bootstrap';
import Navbar from '../Home/Navbar';

const Fahrtabschliessen = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [disableFields, setDisableFields] = useState(false);
    const [user, setUser] = useState<UserResource | null>(null)
    const [letzteFahrt, setLetzteFahrt] = useState<FahrtResource | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [success, setShowSuccess] = useState<boolean>(false);
    const [validated, setValidated] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State for showing confirmation modal

    const jwt = getJWT()
    const navigate = useNavigate()

    useEffect(() => {
        if (jwt) {
            setJWT(jwt)
        } else {
            navigate("/")
            return;
        }
    }, [jwt])

    async function load() {
        const id = getLoginInfo()
        const user = await getUser(id!.userID)
        setUser(user)
        setLoading(false)
        const x: FahrtResource[] = await getFahrt(id!.userID);
        setLetzteFahrt(x[x.length - 1]);
    }

    useEffect(() => { load() }, [])


    async function handleSubmit(e: any) {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }

        setValidated(true);

        if (letzteFahrt && !letzteFahrt.beendet) {
            setShowAlert(true);
            return;
        }

        const kilometerEnde = parseFloat((document.getElementById("formGridKilometerEnde") as HTMLInputElement)?.value);
        const ortFahrtbeendigung = (document.getElementById("formGridOrtFahrtbeendigung") as HTMLInputElement)?.value;

        if (!isNaN(kilometerEnde) && ortFahrtbeendigung) {
            if (user) {
                const fahrtResource: FahrtResource = {
                    id: letzteFahrt!._id!.toString(),
                    _id: letzteFahrt!._id!.toString(),
                    fahrerid: user.id!,
                    kilometerende: kilometerEnde,
                    endpunkt: ortFahrtbeendigung,
                    vollname: user.vorname + " " + user.name,
                    kennzeichen: letzteFahrt!.kennzeichen,
                    kilometerstand: letzteFahrt!.kilometerstand,
                    startpunkt: letzteFahrt!.startpunkt,
                    beendet: true
                };
                await updateFahrt(fahrtResource)
            }
            Object.keys(localStorage).forEach(key => {
                if (key !== 'jwt') {
                    localStorage.removeItem(key);
                }
            });
            setShowSuccess(true);
            setTimeout(() => { navigate("/home") }, 1000)
        }
    }

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const americanDateFormat = `${year}-${month}-${day}`;

    return (
        <><Navbar></Navbar>
            <br></br>
            <br></br>
            <div className="form-wrapper">
                <h2 className="form-header">Fahrt Abschließen</h2>
                {loading ? (
                    <Loading></Loading>
                ) : (
                    <><Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                        Sie können keine Fahrt erstellen. Bitte beenden Sie die laufende Fahrt in Fahrt verwalten.
                        <br></br>
                        <Button variant="primary" type="submit" onClick={() => { navigate("/verwalten"); }}>Fahrt verwalten</Button>
                    </Alert>
                        <Alert variant="success" show={success} onClose={() => setShowAlert(false)} dismissible>
                            Fahrt erfolgreich abgeschlossen!
                        </Alert>
                        <div className="form-container">
                            <Form className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
                                <Row className="mb-1">
                                    <Form.Group as={Col} controlId="formGridFahrer" className="form-group">
                                        <Form.Label className="form-label">Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Name"
                                            className={`form-control ${validated && !user ? 'is-invalid' : ''}`}
                                            value={user ? user.name : ""}
                                            disabled={true}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">Bitte geben Sie den Namen ein.</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridDatum" className="form-group">
                                        <Form.Label className="form-label">Datum</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Datum"
                                            className="form-control"
                                            value={americanDateFormat}
                                            disabled={true}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">Bitte geben Sie das Datum ein.</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridKilometerEnde" className="form-group">
                                        <Form.Label className="form-label">Kilometerstand bei Fahrtende</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Kilometerende"
                                            className={`form-control ${validated && !letzteFahrt ? 'is-invalid' : ''}`}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">Bitte geben Sie den Kilometerstand ein.</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-4">
                                    <Form.Group as={Col} controlId="formGridOrtFahrtbeendigung" className="form-group">
                                        <Form.Label className="form-label">Ort der Fahrtbeendigung</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ort der Fahrtbeendigung"
                                            className={`form-control ${validated && !letzteFahrt ? 'is-invalid' : ''}`}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">Bitte geben Sie den Ort der Fahrtbeendigung ein.</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Button variant="primary" type="button" className="submit-button" onClick={() => setShowConfirmationModal(true)}>
                                    Fahrt abschließen
                                </Button>
                            </Form>
                        </div></>
                )}
            </div>
            {/* Confirmation Modal */}
            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Fahrt abschließen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Sind Sie sicher, dass Sie die Fahrt abschließen möchten?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Abschließen
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Fahrtabschliessen;
