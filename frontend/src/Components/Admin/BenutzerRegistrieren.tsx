import { useEffect, useState } from 'react';
import { Form, Row, Col, Alert } from 'react-bootstrap';
import { createUserWithAdmin } from '../../Api/api';
import { useNavigate } from 'react-router-dom';
import { UserResource } from '../../util/Resources';
import Navbar from '../Home/Navbar';
import { getJWT, setJWT } from '../Context/Logincontext';

const BenutzerRegistrieren = () => {

    const [showSuccess, setShowSuccess] = useState(false);
    const [validated, setValidated] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState("")
    const [formData, setFormData] = useState<UserResource>({
        vorname: '',
        name: '',
        username: '',
        email: '',
        password: '',
        admin: false,
        fahrzeuge: [],
    });

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

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        let validatedValue = value;

        // Validierung für Vor- und Nachnamen
        if (name === 'vorname' || name === 'name') {
            validatedValue = value.replace(/[^a-zA-ZÄäÖöÜüß]/g, ''); // Entferne alle Zeichen außer Buchstaben
        } else if (name === 'username') {
            validatedValue = value.replace(/[^a-zA-Z0-9_.]/g, ''); // Erlaubt nur Buchstaben, Zahlen, Unterstriche (_) und Punkte (.)
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: validatedValue
        }));

        // Passwort validieren, während der Benutzer eingibt
        if (name === 'password') {
            validatePassword(value);
        }
    };

    const validatePassword = (password: string) => {
        // Mindestens 8 Zeichen
        const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

        if (!regex.test(password)) {
            setPasswordError("Das Passwort sollte 8 Buchstaben lang sein und mindestens eine Zahl und ein Sonderzeichen enthalten.");

        } else {
            setPasswordError(null)
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false || passwordError) {
            e.stopPropagation();
        }
        setValidated(true);

        try {
            if (form.checkValidity() === true && !passwordError) {
                await createUserWithAdmin(formData);
                setShowSuccess(true);
                setTimeout(() => { navigate("/home") }, 1500);
            } else {
                // Passwortfeld leeren, wenn das Passwort falsch ist
                setFormData(prevState => ({
                    ...prevState,
                    password: ''
                }));
            }
        } catch (error: any) {
            let errorMessage = "Es gab einen Fehler beim Erstellen des Benutzers.";
            if (error instanceof Error && error.message.includes("MongoServerError: E11000 duplicate key error")) {
                errorMessage = "Der Benutzername ist bereits vergeben.";
            }
            setError(errorMessage)
            setShowAlert(true)
        }
    };

    return (
        <>
            <div className="form-wrapper">
                <Navbar />
                <div className="form-container">
                    <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible className="custom-alert-gut">
                        Benutzer erfolgreich registriert!
                    </Alert>
                    <Alert variant="alert alert-danger" role="alert" show={showAlert} onClose={() => setShowAlert(false)} dismissible className="custom-alert-gut">
                        {error}
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
                                <Form.Control type="password" placeholder="Passwort" name="password" className={`form-control ${validated && formData.password && formData.password.length < 8 && !passwordError ? 'is-invalid' : ''}`} value={formData.password} onChange={handleChange} required />
                                {(passwordError || formData.password === "") && (
                                    <Form.Control.Feedback type="invalid" className="form-control-feedback">
                                        Das Passwort sollte 8 Buchstaben lang sein und mindestens eine Zahl und ein Sonderzeichen enthalten.
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 justify-content-left">
                            <Col md="auto" className="text-center">
                                <Form.Group as={Col} controlId="formGridAdmin">
                                    <Form.Check type="checkbox" label="Benutzer ist Admin" name="admin" className="checkbox-label5" checked={formData.admin} onChange={(e) => setFormData(prevState => ({ ...prevState, admin: e.target.checked }))} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <button type="submit" className="submit-button-beginnen">
                            Benutzer erstellen
                        </button>
                    </Form>
                </div>
            </div>
            
        </>
    );
}

export default BenutzerRegistrieren;
