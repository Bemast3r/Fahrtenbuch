import React, { useEffect, useState } from 'react';
import { Form, Col, Row, Alert, ListGroup, Modal, Button } from 'react-bootstrap';
import { UserResource } from '../../util/Resources';
import { getUsers } from '../../Api/api';

const Benutzerloeschen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserResource | null>(null);
    const [users, setUsers] = useState<UserResource[]>([]); // Dummy data, replace with actual user data
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);


    async function getallUser() {
        const all: UserResource[] = await getUsers()
        setUsers(all)
    }

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

    const confirmDeleteUser = () => {
        // Implement logic to delete user here
        // For example, remove the selected user from the users state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser?.id));
        // setSelectedUser(null);
        setShowConfirmationModal(false);
        setShowAlert(true); // Show the alert after confirming user deletion
    };

    const closeModal = () => {
        setSelectedUser(null);
        setShowConfirmationModal(false);
    };

    return (
        <div className="form-wrapper">
            <div className="form-container">
                <h2 className="form-header2">Benutzer löschen</h2>
                <Alert variant="success" show={showAlert} onClose={() => setShowAlert(false)} dismissible className="custom-alert-gut">
                    Benutzer erfolgreich gelöscht: {selectedUser?.vorname} {selectedUser?.name}
                </Alert>
                <Form>
                    <Form.Group as={Row} controlId="formSearch">
                        <Form.Label column sm="2">Benutzer suchen:</Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" placeholder="Vor- und Nachname eingeben" value={searchQuery} onChange={handleSearchChange} />
                        </Col>
                    </Form.Group>
                </Form>
                <ListGroup>
                    {searchQuery && users
                        .filter(user => `${user.vorname} ${user.name}`.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(user => (
                            <ListGroup.Item key={user.id} action onClick={() => handleUserSelect(user)}>
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
                    Möchten Sie den Benutzer wirklich löschen: {selectedUser?.vorname} {selectedUser?.name}?
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
