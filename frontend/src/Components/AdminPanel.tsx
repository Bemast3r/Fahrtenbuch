import { Form, Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { createUserWithAdmin } from '../Api/api';
import { useNavigate } from 'react-router-dom';
import { UserResource } from '../util/Resources';

const AdminFormular = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState<UserResource>({
        vorname: '',
        name: '',
        username: '',
        email: '',
        password: '',
        admin: true,
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
        try {
            await createUserWithAdmin(formData);
            navigate("/home");
        } catch (error) {
            console.error('Fehler beim Erstellen des Benutzers:', error);
        }
    };

    return (
        <div className="form-wrapper">
            <h2 className="form-header">Benutzer Registrieren</h2>
            <div className="form-container">
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridName">
                            <Form.Label>Vorname</Form.Label>
                            <Form.Control type="text" placeholder="Vorname" name="vorname" value={formData.vorname} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNachname">
                            <Form.Label>Nachname</Form.Label>
                            <Form.Control type="text" placeholder="Nachname" name="name" value={formData.name} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group as={Col} className="c" controlId="formGridUsername">
                            <Form.Label>Benutzername</Form.Label>
                            <Form.Control type="text" placeholder="Benutzername" name="username" value={formData.username} onChange={handleChange} required />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                        </Form.Group>

                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Passwort</Form.Label>
                            <Form.Control type="password" placeholder="Passwort" name="password" value={formData.password} onChange={handleChange} required />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridAdmin">
                            <Form.Check type="checkbox" label="Benutzer ist Admin" name="admin" checked={formData.admin} onChange={(e) => setFormData(prevState => ({ ...prevState, admin: e.target.checked }))} />
                        </Form.Group>
                    </Row>

                    <Button variant="primary" type="submit" className="submit-button">
                        Benutzer Registrieren
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default AdminFormular;
