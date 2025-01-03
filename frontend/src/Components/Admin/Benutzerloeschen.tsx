import React, { useEffect, useState } from 'react';
import { Form, Col, Row, Alert, ListGroup, Modal, Button } from 'react-bootstrap';
import { UserResource } from '../../util/Resources';
import { deleteUser, getUsers } from '../../Api/api';
import { useUser } from '../Context/UserContext';
import "./benutzerregistrieren.css"

const Benutzerloeschen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserResource | null>(null);
    const [users, setUsers] = useState<UserResource[]>([]); // Dummy data, replace with actual user data
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const userc = useUser()


    async function getallUser() {
        const all: UserResource[] = await getUsers()
        setUsers(all)
    }
    const isCurrentUser = (selected: UserResource): boolean => {
        return selected.id === userc!.user!.id!;
    };

    useEffect(() => {
        getallUser()
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleUserSelect = (user: UserResource) => {
        setSelectedUser(user);
        setShowConfirmationModal(true);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Verhindert das automatische Senden des Formulars
    };

    const confirmDeleteUser = async () => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser?.id));
        await deleteUser(selectedUser!.id!)
        setShowConfirmationModal(false);
        setShowAlert(true); // Show the alert after confirming user deletion
    };

    const closeModal = () => {
        setSelectedUser(null);
        setShowConfirmationModal(false);
    };

    return (
        <div className="form-wrapper-loesch">
            <div className="form-container-loesch">
                <h2 className="form-header2">Benutzer löschen</h2>
                <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible className="custom-alert-gut">
                    Benutzer: {selectedUser?.vorname} {selectedUser?.name} erfolgreich gelöscht.
                </Alert>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Group as={Row} controlId="formSearch">
                        <Form.Label column sm="2">Benutzer suchen</Form.Label>
                        <Col sm="10">
                            <Form.Control style={{width: "118%"}} type="text" placeholder="Vor- und Nachname eingeben" value={searchQuery} onChange={handleSearchChange} />
                        </Col>
                    </Form.Group>
                </Form>
                <ListGroup>
                    {searchQuery && users
                        .filter(user => `${user.vorname} ${user.name}`.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(user => (
                            <ListGroup.Item
                                key={user.id}
                                action
                                disabled={isCurrentUser(user)}
                                onClick={() => handleUserSelect(user)}>
                                {user.vorname} {user.name}
                            </ListGroup.Item>
                        ))}
                </ListGroup>
                {users.filter(user => `${user.vorname} ${user.name}`.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <Alert variant="info">Keine Benutzer gefunden</Alert>
                )}
            </div>
            <Modal show={showConfirmationModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Benutzer löschen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Möchten Sie den Benutzer: {selectedUser?.vorname} {selectedUser?.name} wirklich löschen?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Abbrechen
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteUser}>
                        Löschen
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Benutzerloeschen;
