import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import "./fahrtErstellen.css";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJWT, setJWT, getLoginInfo } from './Logincontext';
import { getUser, postFahrt } from '../Api/api';
import { FahrtResource, UserResource } from '../util/Resources';

const FahrtErstellen = () => {
    const [disableFields, setDisableFields] = useState(false);
    const [user, setUser] = useState<UserResource | null>(null)

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
    }

    useEffect(() => { load() }, [])

    const handleCheckboxChange = (checkboxId: string) => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            if (checkbox.id !== checkboxId) {
                (checkbox as HTMLInputElement).checked = false;
            }
        });
        setDisableFields((document.getElementById(checkboxId) as HTMLInputElement).checked);
    };

    async function handleSubmit() {
        const kennzeichen = (document.getElementById("formGridKennzeichen") as HTMLInputElement)?.value;
        const kilometerstand = parseFloat((document.getElementById("formGridKilometerstand") as HTMLInputElement)?.value);
        const stratpunkt = (document.getElementById("formGridOrt") as HTMLInputElement)?.value;

        if (user) {
            let fahrtResource: FahrtResource = {
                fahrerid: user.id!,
                kennzeichen: kennzeichen || "",
                kilometerstand: kilometerstand,
                startpunkt: stratpunkt
            };
            await postFahrt(fahrtResource)
        }
        navigate("/verwalten");
    }

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Monate sind nullbasiert
    const day = currentDate.getDate().toString().padStart(2, '0');

    const americanDateFormat = `${year}-${month}-${day}`;

    return (
        <div className="form-wrapper">
            <h2 className="form-header">Fahrt erstellen</h2>
            <div className="form-container">
                <Form>
                    <Row className="mb-1">
                        <Form.Group as={Col} controlId="formGridFahrer" className="form-group">
                            <Form.Label className="form-label">Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                className="form-control"
                                //disabled={disableFields}
                                value={user ? user.name : ""}
                                disabled={true}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridDatum" className="form-group">
                            <Form.Label className="form-label">Datum</Form.Label>
                            <Form.Control type="text" placeholder="Datum" className="form-control" value={americanDateFormat} disabled={true} required/>
                        </Form.Group>
                    </Row>

                    <Row className="mb-2">
                        <Form.Group as={Col} controlId="formGridKennzeichen" className="form-group">
                            <Form.Label className="form-label">Kennzeichen</Form.Label>
                            <Form.Control type="text" placeholder="Kennzeichen" className="form-control" disabled={disableFields} required/>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridKilometerstand" className="form-group" >
                            <Form.Label className="form-label">Kilometerstand (Beginn)</Form.Label>
                            <Form.Control type="number" placeholder="Kilometerstand" className="form-control" disabled={disableFields} required/>
                        </Form.Group>
                    </Row>

                    <Row className="mb-4">
                        <Form.Group as={Col} controlId="formGridOrt" className="form-group">
                            <Form.Label className="form-label">Ort der Fahrtaufnahme</Form.Label>
                            <Form.Control type="text" placeholder="Ort" className="form-control" disabled={disableFields} required/>
                        </Form.Group>
                    </Row>

                    <Row className="mb-5">
                        <Form.Group className="checkbox1" controlId="formGridCheckbox1">
                            <Form.Check type="checkbox" label="Kein Fahrzeug geführt" className="checkbox-label1" onChange={() => handleCheckboxChange("formGridCheckbox1")} />
                        </Form.Group>

                        <Form.Group className="checkbox2" controlId="formGridCheckbox2">
                            <Form.Check type="checkbox" label="Ich bin krank" className="checkbox-label2" onChange={() => handleCheckboxChange("formGridCheckbox2")} />
                        </Form.Group>

                        <Form.Group className="checkbox3" controlId="formGridCheckbox3">
                            <Form.Check type="checkbox" label="Ich habe Urlaub" className="checkbox-label3" onChange={() => handleCheckboxChange("formGridCheckbox3")} />
                        </Form.Group>

                        <Form.Group className="checkbox4" controlId="formGridCheckbox4">
                            <Form.Check type="checkbox" label="Ich habe frei" className="checkbox-label4" onChange={() => handleCheckboxChange("formGridCheckbox4")} />
                        </Form.Group>
                    </Row>

                    <Button variant="primary" type="submit" className="submit-button" onClick={handleSubmit}>
                        Fahrt beginnen
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default FahrtErstellen;
