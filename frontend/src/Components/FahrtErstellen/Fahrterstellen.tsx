import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJWT, setJWT, getLoginInfo } from '../Context/Logincontext';
import { getFahrt, getUser, postFahrt } from '../../Api/api';
import { FahrtResource, UserResource } from '../../util/Resources';
import Loading from '../../util/Components/LoadingIndicator';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import Navbar from '../Home/Navbar';
import { useUser } from '../Context/UserContext';
import { useFahrten } from '../Context/FahrtenContext';

const FahrtErstellen = () => {
    const [loading, setLoading] = useState(true);
    const [disableFields, setDisableFields] = useState(false);
    const user = useUser()
    const [letzteFahrt, setLetzteFahrt] = useState<FahrtResource | null>(null);
    const FahrtenContext = useFahrten()
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [validated, setValidated] = useState(false);

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
        load();
    }, []);

    async function load() {
        const id = getLoginInfo();
        if (user && FahrtenContext) {
            const fahrten: FahrtResource[] = await getFahrt(id!.userID);
            FahrtenContext.setFahrten(fahrten);
            setLetzteFahrt(fahrten[fahrten.length - 1])
            setLoading(false);
        } else {
            navigate("/")
        }
    }

    const handleCheckboxChange = (checkboxId: string) => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            if (checkbox.id !== checkboxId) {
                (checkbox as HTMLInputElement).checked = false;
            }
        });
        setDisableFields((document.getElementById(checkboxId) as HTMLInputElement).checked);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        setValidated(true);

        if (letzteFahrt && !letzteFahrt.beendet && !letzteFahrt.kilometerende) {
            setShowAlert(true);
            return;
        }


        const kennzeichen = (document.getElementById("formGridKennzeichen") as HTMLInputElement)?.value;
        const kilometerstand = parseFloat((document.getElementById("formGridKilometerstand") as HTMLInputElement)?.value);
        const startpunkt = (document.getElementById("formGridOrt") as HTMLInputElement)?.value;

        // Überprüfen, ob die Checkboxen angekreuzt wurden
        const checkbox1Checked = (document.getElementById("formGridCheckbox1") as HTMLInputElement)?.checked;
        const checkbox2Checked = (document.getElementById("formGridCheckbox2") as HTMLInputElement)?.checked;
        const checkbox3Checked = (document.getElementById("formGridCheckbox3") as HTMLInputElement)?.checked;
        const checkbox4Checked = (document.getElementById("formGridCheckbox4") as HTMLInputElement)?.checked;



        // Wenn eine Checkbox angekreuzt wurde, Fahrt mit entsprechender Abwesenheit erstellen
        if (checkbox1Checked || checkbox2Checked || checkbox3Checked || checkbox4Checked) {
            if (!kennzeichen || !kilometerstand || !startpunkt) {
                if (!disableFields) {
                    return;
                }
                let abwesendText = '';
                if (checkbox1Checked) abwesendText = "Kein Fahrzeug geführt.";
                else if (checkbox2Checked) abwesendText = "Ich bin krank.";
                else if (checkbox3Checked) abwesendText = "Ich habe Urlaub.";
                else if (checkbox4Checked) abwesendText = "Ich habe frei.";

                if (user) {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const end = new Date()
                    end.setHours(23, 59, 59, 0)
                    const dayinMillis = 24 * (3600 * 1000) / 1000
                    const fahrtResource: FahrtResource = {
                        fahrerid: user.id!,
                        vollname: user.vorname + " " + user.name,
                        kennzeichen: "-",
                        kilometerstand: 0,
                        startpunkt: "-",
                        abwesend: abwesendText,
                        ruhezeit: [{ start: today, stop: end }],
                        beendet: true,
                        totalRuhezeit: dayinMillis
                    };
                    const fahrt = await postFahrt(fahrtResource);
                    setShowSuccess(true);
                    setTimeout(() => { navigate("/home") }, 1500)
                    return;
                }
            }
            return;
        }

        if (!isNaN(kilometerstand) && kennzeichen && startpunkt) {
            if (user) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                let fahrtResource: FahrtResource = {
                    fahrerid: user.id!,
                    kennzeichen: kennzeichen.toString(),
                    kilometerstand: kilometerstand,
                    startpunkt: startpunkt.toString(),
                    vollname: user.vorname + " " + user.name,
                    lenkzeit: [new Date(Date.now() + 1000)],
                    ruhezeit: [
                        { start: today, stop: new Date(Date.now()) },
                    ],
                    totalRuhezeit: (new Date(Date.now()).getTime() - today.getTime()) / 1000
                };
                const fahrt = await postFahrt(fahrtResource);
            }
            Object.keys(localStorage).forEach(key => {
                if (key !== 'jwt') {
                    localStorage.removeItem(key);
                }
            });
            setShowSuccess(true);
            setTimeout(() => {
                navigate("/verwalten");
            }, 1000);
        }
    };

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const americanDateFormat = `${year}-${month}-${day}`;

    return (
        <div className="wasgehtsiedasan">

            <Navbar />
            <div className="form-wrapper">
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="form-container">
                            <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible className="custom-alert-gut">
                                Fahrt erfolgreich erstellt!
                            </Alert>
                            <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible className="custom-alert">
                                Sie können keine Fahrt erstellen. Bitte beenden Sie zuerst die laufende Fahrt.
                                <Button variant="primary" type="submit" className="popup-button" onClick={() => { navigate("/verwalten"); }}>Fahrt verwalten</Button>
                            </Alert>
                            <Form className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
                                <h2 className="form-header">Fahrt erstellen</h2>
                                <Row className="mb-1">
                                    <Form.Group as={Col} controlId="formGridFahrer" className="form-group">
                                        <Form.Label className="form-label">Name*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Name"
                                            className="form-control"
                                            value={user ? user.name : ""}
                                            disabled
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridDatum" className="form-group">
                                        <Form.Label className="form-label">Datum*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Datum"
                                            className="form-control"
                                            value={americanDateFormat}
                                            disabled
                                            required
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-2">
                                    <Form.Group as={Col} controlId="formGridKennzeichen" className="form-group">
                                        <Form.Label className="form-label">Kennzeichen*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Kennzeichen"
                                            className={`form-control ${validated && !letzteFahrt ? 'is-invalid' : ''}`}
                                            disabled={disableFields}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid" className="form-control-feedback">
                                            Bitte geben Sie das Kennzeichen ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridKilometerstand" className="form-group">
                                        <Form.Label className="form-label">Kilometerstand*</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Kilometerstand"
                                            className={`form-control ${validated && !letzteFahrt ? 'is-invalid' : ''}`}
                                            disabled={disableFields}
                                            required
                                            min="0" // Setzen Sie das min-Attribut auf 0
                                            onKeyDown={(e) => {
                                                if (e.key === 'e' || e.key === 'E' || e.key === '-') {
                                                    e.preventDefault(); // Verhindern Sie die Eingabe von "e", "E" und "-"
                                                }
                                            }}
                                        />
                                        <Form.Control.Feedback type="invalid" className="form-control-feedback">
                                            Bitte geben Sie den Kilometerstand an.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                </Row>
                                <Row className="mb-4">
                                    <Form.Group as={Col} controlId="formGridOrt" className="form-group">
                                        <Form.Label className="form-label">Ort des Fahrtbeginns*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ort"
                                            className={`form-control ${validated && !letzteFahrt ? 'is-invalid' : ''}`}
                                            disabled={disableFields}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid" className="form-control-feedback">
                                            Bitte geben Sie den Ort des Fahrtbeginns an.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-5 justify-content-center">
                                    <Col md="auto" className="text-center">
                                        <Form.Group controlId="formGridCheckbox1">
                                            <Form.Check
                                                type="checkbox"
                                                label="Kein Fahrzeug geführt"
                                                className="checkbox-label1"
                                                onChange={() => handleCheckboxChange("formGridCheckbox1")}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md="auto" className="text-center">
                                        <Form.Group controlId="formGridCheckbox2">
                                            <Form.Check
                                                type="checkbox"
                                                label="Ich bin krank"
                                                className="checkbox-label2"
                                                onChange={() => handleCheckboxChange("formGridCheckbox2")}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md="auto" className="text-center">
                                        <Form.Group controlId="formGridCheckbox3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Ich habe Urlaub"
                                                className="checkbox-label3"
                                                onChange={() => handleCheckboxChange("formGridCheckbox3")}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md="auto" className="text-center">
                                        <Form.Group controlId="formGridCheckbox4">
                                            <Form.Check
                                                type="checkbox"
                                                label="Ich habe frei"
                                                className="checkbox-label4"
                                                onChange={() => handleCheckboxChange("formGridCheckbox4")}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <button type="submit" className="submit-button-beginnen">
                                    Fahrt beginnen
                                </button>
                            </Form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default FahrtErstellen;