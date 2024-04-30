import { useEffect, useState } from 'react';
import { Form, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import { createUserWithAdmin, getUsers, updateUser } from '../../Api/api';
import { useNavigate } from 'react-router-dom';
import { UserResource } from '../../util/Resources';
import Navbar from '../Home/Navbar';
import { getJWT, setJWT } from '../Context/Logincontext';

const BenutzerBearbeiten = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [validated, setValidated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState<UserResource>({
        vorname: '',
        name: '',
        username: '',
        email: '',
        admin: false,
        mod: false,
    });
    const [selectedUser, setSelectedUser] = useState<UserResource | undefined>(undefined); // Speichert den ausgewählten Benutzer
    const [userList, setUserList] = useState<UserResource[]>([]); // Liste aller Benutzer

    const jwt = getJWT();
    const navigate = useNavigate();

    useEffect(() => {
        if (jwt) {
            setJWT(jwt);
            fetchUserList(); // Beim Laden der Komponente die Benutzerliste abrufen
        } else {
            navigate("/");
            return;
        }
    }, [jwt]);

    const fetchUserList = async () => {
        try {
            const response = await getUsers(); // Annahme: Funktion fetchUserList() ruft die Benutzerliste ab
            setUserList(response); 
        } catch (error) {
            console.error("Fehler beim Abrufen der Benutzerliste:", error);
        }
    };

    const handleUserClick = (user: UserResource) => {
        setSelectedUser(user); // Setzt den ausgewählten Benutzer
        setFormData(user); // Setzt die Daten des ausgewählten Benutzers in das Formular
    };

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

    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = e.currentTarget;

        // Manuelle Validierung für leere Felder
        const emptyFields = Object.values(formData).some(value => value === '');
        if (emptyFields) {
            setShowAlert(true);
            return;
        }

        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }
        setValidated(true);

        try {
            if (form.checkValidity() === true) {
                const response = await updateUser(formData);
                setShowSuccess(true);
                setValidated(false);
                fetchUserList(); 
            };

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
            <div className="form-wrapper-bearbeiten">
                <Navbar />
                <div className="form-container-loesch">
                    <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible className="custom-alert-gut">
                        Benutzer erfolgreich bearbeitet!
                    </Alert>
                    <Alert variant="alert alert-danger" role="alert" show={showAlert} onClose={() => setShowAlert(false)} dismissible className="custom-alert-gut">
                        {error}
                    </Alert>
                    <Row>
                        <Col sm={4}>
                            {/* Benutzerliste */}
                            <h2>Benutzerliste:</h2>
                            <ListGroup>
                                {userList.map((user, index) => (
                                    <ListGroup.Item
                                        key={index}
                                        action
                                        active={selectedUser && (selectedUser.username === user.username)}
                                        onClick={() => handleUserClick(user)}
                                    >
                                        {user.username}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                        <Col sm={8}>
                            {/* Benutzerformular */}
                            <Form className="row g-3" validated={validated} onSubmit={handleSubmit}>
                                <h2 className="form-header2">Benutzer bearbeiten</h2>
                                {/* Hier die Formularfelder für die Benutzerdaten einfügen */}
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
                                </Row>

                                <Row className="mb-3 justify-content-left">
                                    <Col md="auto" className="text-center">
                                        <Form.Group as={Col} controlId="formGridAdmin">
                                            <Form.Check type="checkbox" label="Benutzer ist Admin" name="admin" className="checkbox-label5" disabled={formData.mod} checked={formData.admin} onChange={(e) => setFormData(prevState => ({ ...prevState, admin: e.target.checked }))} />
                                        </Form.Group>
                                    </Col>
                                    <Col md="auto" className="text-center">
                                        <Form.Group as={Col} controlId="formGridAdmin">
                                            <Form.Check type="checkbox" label="Benutzer ist Mod" name="admin" className="checkbox-label5" disabled={formData.admin} checked={formData.mod} onChange={(e) => setFormData(prevState => ({ ...prevState, mod: e.target.checked }))} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <button type="submit" className="submit-button-beginnen">
                                    Benutzer bearbeiten
                                </button>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default BenutzerBearbeiten;
