import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJWT, setJWT, getLoginInfo } from './Logincontext';
import { getFahrt, getUser, postFahrt } from '../Api/api';
import { FahrtResource, UserResource } from '../util/Resources';
import Loading from './LoadingIndicator';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import Navbar from './Navbar';

const FahrtErstellen = () => {
    const [loading, setLoading] = useState(true);
    const [disableFields, setDisableFields] = useState(false);
    const [user, setUser] = useState<UserResource | null>(null);
    const [letzteFahrt, setLetzteFahrt] = useState<FahrtResource | null>(null);
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
        const user = await getUser(id!.userID);
        setUser(user);
        setLoading(false);
        const x: FahrtResource[] = await getFahrt(id!.userID);
        setLetzteFahrt(x[x.length - 1]);
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
                    setTimeout(() => { navigate("/home") }, 1000)
                    return;
                }
            }
            return;
        }

        if (user) {

            let fahrtResource: FahrtResource = {
                fahrerid: user.id!,
                kennzeichen: kennzeichen.toString(),
                kilometerstand: kilometerstand,
                startpunkt: startpunkt.toString(),
                vollname: user.vorname + " " + user.name
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
    };

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const americanDateFormat = `${year}-${month}-${day}`;

    return (
        <>
            <Navbar />
            <br />
            <br />
            <div className="form-wrapper">
                <h2 className="form-header">Fahrt Erstellen</h2>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                            Sie können keine Fahrt erstellen. Bitte beenden Sie die laufende Fahrt in Fahrtverwalten.
                            <br />
                            <Button variant="primary" type="submit" onClick={() => { navigate("/verwalten"); }}>Fahrt Verwalten</Button>
                        </Alert>
                        <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible>
                            Fahrt erfolgreich erstellt!
                        </Alert>
                        <div className="form-container">
                            <Form className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
                                <Row className="mb-1">
                                    <Form.Group as={Col} controlId="formGridFahrer" className="form-group">
                                        <Form.Label className="form-label">Name</Form.Label>
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
                                        <Form.Label className="form-label">Datum</Form.Label>
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
                                        <Form.Label className="form-label">Kennzeichen</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Kennzeichen"
                                            className="form-control"
                                            disabled={disableFields}
                                            required
                                            isInvalid={validated}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie das Kennzeichen ein.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridKilometerstand" className="form-group">
                                        <Form.Label className="form-label">Kilometerstand</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Kilometerstand"
                                            className="form-control"
                                            disabled={disableFields}
                                            required
                                            isInvalid={validated}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie den Kilometerstand an.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-4">
                                    <Form.Group as={Col} controlId="formGridOrt" className="form-group">
                                        <Form.Label className="form-label">Ort der Fahrtaufnahme</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ort"
                                            className="form-control"
                                            disabled={disableFields}
                                            required
                                            isInvalid={validated}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Bitte geben Sie den Ort der Fahrtaufnahme an.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-5">
                                    <Form.Group className="checkbox1" controlId="formGridCheckbox1">
                                        <Form.Check
                                            type="checkbox"
                                            label="Kein Fahrzeug geführt"
                                            className="checkbox-label1"
                                            onChange={() => handleCheckboxChange("formGridCheckbox1")}
                                        />
                                    </Form.Group>
                                    <Form.Group className="checkbox2" controlId="formGridCheckbox2">
                                        <Form.Check
                                            type="checkbox"
                                            label="Ich bin krank"
                                            className="checkbox-label2"
                                            onChange={() => handleCheckboxChange("formGridCheckbox2")}
                                        />
                                    </Form.Group>
                                    <Form.Group className="checkbox3" controlId="formGridCheckbox3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Ich habe Urlaub"
                                            className="checkbox-label3"
                                            onChange={() => handleCheckboxChange("formGridCheckbox3")}
                                        />
                                    </Form.Group>
                                    <Form.Group className="checkbox4" controlId="formGridCheckbox4">
                                        <Form.Check
                                            type="checkbox"
                                            label="Ich habe frei"
                                            className="checkbox-label4"
                                            onChange={() => handleCheckboxChange("formGridCheckbox4")}
                                        />
                                    </Form.Group>
                                </Row>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="submit-button"
                                >
                                    Fahrt beginnen
                                </Button>
                            </Form>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default FahrtErstellen;