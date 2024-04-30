import { useEffect, useState } from 'react';
import { Form, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import { createUserWithAdmin, getUsers } from '../../Api/api';
import { useNavigate } from 'react-router-dom';
import { UserResource } from '../../util/Resources';
import Navbar from '../Home/Navbar';
import { getJWT, setJWT } from '../Context/Logincontext';

const BenutzerBearbeiten = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [validated, setValidated] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState<UserResource>({
        vorname: '',
        name: '',
        username: '',
        email: '',
        password: '',
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
            // Hier Fetch-Anfrage für Benutzerliste durchführen und Liste setzen
            const response = await getUsers(); // Annahme: Funktion fetchUserList() ruft die Benutzerliste ab
            setUserList(response); // Annahme: userListResponse ist ein Array von Benutzern
        } catch (error) {
            console.error("Fehler beim Abrufen der Benutzerliste:", error);
            // Behandlung des Fehlers, z.B. Anzeige einer Fehlermeldung
        }
    };

    const handleUserClick = (user: UserResource) => {
        setSelectedUser(user); // Setzt den ausgewählten Benutzer
        setFormData(user); // Setzt die Daten des ausgewählten Benutzers in das Formular
        console.log(user)
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
                setTimeout(() => {
                    setShowSuccess(false);
                    setFormData({
                        vorname: '',
                        name: '',
                        username: '',
                        email: '',
                        password: '',
                        admin: false,
                        mod: false,
                    });
                    setValidated(false);
                    fetchUserList(); // Aktualisiere die Benutzerliste nach dem Erstellen eines Benutzers
                }, 1000);
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
                        Benutzer erfolgreich bearbeitet!
                    </Alert>
                    <Alert variant="alert alert-danger" role="alert" show={showAlert} onClose={() => setShowAlert(false)} dismissible className="custom-alert-gut">
                        {error}
                    </Alert>
                    <Row>
                        <Col sm={4}>
                            {/* Benutzerliste */}
                            <h2>Benutzerliste</h2>
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
                            <Form className="row g-3" noValidate validated={validated} onSubmit={handleSubmit}>
                                <h2 className="form-header2">Benutzer bearbeiten</h2>
                                {/* Hier die Formularfelder für die Benutzerdaten einfügen */}
                            </Form>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default BenutzerBearbeiten;
