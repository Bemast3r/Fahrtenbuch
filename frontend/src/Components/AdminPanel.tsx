import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { createUserWithAdmin } from '../Api/api';
import { useNavigate } from 'react-router-dom';
import { UserResource } from '../util/Resources';
import Navbar from './Navbar';

const AdminFormular = () => {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState<UserResource>({
        vorname: '',
        name: '',
        username: '',
        email: '',
        password: '',
        admin: false,
        fahrzeuge: [],
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        setValidated(true);

        try {
            if (form.checkValidity() === true) {
                await createUserWithAdmin(formData);
                setShowSuccess(true);
                setTimeout(() => { navigate("/home") }, 1500);
            }
        } catch (error) {
            console.error('Fehler beim Erstellen des Benutzers:', error);
        }
    };

    return (
        <div className="form-wrapper">
            <Navbar />
            <div className="form-container">
                <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible className="custom-alert-gut">
                    Benutzer erfolgreich registriert!
                </Alert>
                <Form className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
                    <h2 className="form-header2">Benutzer registrieren</h2>
                    <Row className="mb-1">
                        <Form.Group as={Col} controlId="formGridName" className="form-group">
                            <Form.Label className="form-label">Vorname*</Form.Label>
                            <Form.Control type="text" placeholder="Vorname" name="vorname" className={`form-control ${validated && !formData.vorname ? 'is-invalid' : ''}`} value={formData.vorname} onChange={handleChange} required />
                            <Form.Control.Feedback type="invalid" className="form-control-feedback">
                                Bitte geben Sie den Vornamen an.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNachname" className="form-group">
                            <Form.Label className="form-label">Nachname*</Form.Label>
                            <Form.Control type="text" placeholder="Nachname" name="name" className={`form-control ${validated && !formData.name ? 'is-invalid' : ''}`} value={formData.name} onChange={handleChange} required />
                            <Form.Control.Feedback type="invalid" className="form-control-feedback">
                                Bitte geben Sie den Nachnamen an.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridUsername" className="form-group">
                            <Form.Label className="form-label">Benutzername*</Form.Label>
                            <Form.Control type="text" placeholder="Benutzername" name="username" className={`form-control ${validated && !formData.username ? 'is-invalid' : ''}`} value={formData.username} onChange={handleChange} required />
                            <Form.Control.Feedback type="invalid" className="form-control-feedback">
                                Bitte geben Sie den Benutzernamen an.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-2">
                        <Form.Group as={Col} controlId="formGridEmail" className="form-group">
                            <Form.Label className="form-label">Email*</Form.Label>
                            <Form.Control type="email" placeholder="Email" name="email" className={`form-control ${validated && !formData.email ? 'is-invalid' : ''}`} value={formData.email} onChange={handleChange} required />
                            <Form.Control.Feedback type="invalid" className="form-control-feedback">
                                Bitte geben Sie die E-Mail-Adresse an.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword" className="form-group">
                            <Form.Label className="form-label">Passwort*</Form.Label>
                            <Form.Control type="password" placeholder="Passwort" name="password" className={`form-control ${validated && !formData.password ? 'is-invalid' : ''}`} value={formData.password} onChange={handleChange} required />
                            <Form.Control.Feedback type="invalid" className="form-control-feedback">
                                Bitte geben Sie das Passwort an.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3 justify-content-left">
                        <Col md="auto" className="text-center">
                            <Form.Group as={Col} controlId="formGridAdmin">
                                <Form.Check type="checkbox" label="Benutzer ist Admin" name="admin" className="checkbox-label5" checked={formData.admin} onChange={(e) => setFormData(prevState => ({ ...prevState, admin: e.target.checked }))} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="submit-button-beginnen">
                        Benutzer erstellen
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default AdminFormular;
