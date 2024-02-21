import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import "./fahrtErstellen.css";
import { useState } from 'react';

const FahrtErstellen = () => {
    const [disableFields, setDisableFields] = useState(false);

    const handleCheckboxChange = (checkboxId: string) => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            if (checkbox.id !== checkboxId) {
                (checkbox as HTMLInputElement).checked = false;
            }
        });
        setDisableFields((document.getElementById(checkboxId) as HTMLInputElement).checked);
    };

    return (
        <div className="form-wrapper">
            <h2 className="form-header">Fahrt erstellen</h2>
            <div className="form-container">
                <Form>
                    <Row className="mb-1">
                        <Form.Group as={Col} controlId="formGridFahrer" className="form-group">
                            <Form.Label className="form-label">Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" className="form-control" disabled={disableFields} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridDatum" className="form-group">
                            <Form.Label className="form-label">Datum</Form.Label>
                            <Form.Control type="date" placeholder="Datum" className="form-control" />
                        </Form.Group>
                    </Row>

                    <Row className="mb-2">
                        <Form.Group as={Col} controlId="formGridKennzeichen" className="form-group">
                            <Form.Label className="form-label">Kennzeichen</Form.Label>
                            <Form.Control type="text" placeholder="Kennzeichen" className="form-control" disabled={disableFields} />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridKilometerstand" className="form-group">
                            <Form.Label className="form-label">Kilometerstand (Beginn)</Form.Label>
                            <Form.Control type="number" placeholder="Kilometerstand" className="form-control" disabled={disableFields} />
                        </Form.Group>
                    </Row>

                    <Row className="mb-4">
                        <Form.Group className="mb-4 form-group" controlId="formGridCheckbox1">
                            <Form.Check type="checkbox" label="Kein Fahrzeug geführt" className="checkbox-label1" onChange={() => handleCheckboxChange("formGridCheckbox1")} />
                        </Form.Group>

                        <Form.Group className="mb-4 form-group" controlId="formGridCheckbox2">
                            <Form.Check type="checkbox" label="Ich bin krank" className="checkbox-label2" onChange={() => handleCheckboxChange("formGridCheckbox2")} />
                        </Form.Group>

                        <Form.Group className="mb-4 form-group" controlId="formGridCheckbox3">
                            <Form.Check type="checkbox" label="Ich habe Urlaub" className="checkbox-label3" onChange={() => handleCheckboxChange("formGridCheckbox3")} />
                        </Form.Group>

                        <Form.Group className="mb-4 form-group" controlId="formGridCheckbox4">
                            <Form.Check type="checkbox" label="Ich habe frei" className="checkbox-label4" onChange={() => handleCheckboxChange("formGridCheckbox4")} />
                        </Form.Group>
                    </Row>

                    <Button variant="primary" type="submit" className="submit-button">
                        Fahrt beginnen
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default FahrtErstellen;
