import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import "./home.css";
import { useState } from 'react';

const Home = () => {

    return (
        <div className="form-wrapper">
            <h2 className="form-header">Kontrollbuch</h2>
            <h3 className="form-header2">SKM</h3>
            <div className="form-container">
                <Form>
                <Button variant="primary" type="submit" className="submit-button">
                        Fahrt erstellen
                    </Button>
                    <Button variant="primary" type="submit" className="submit-button2">
                        Fahrt bearbeiten
                    </Button>

                    <Button variant="danger" type="submit" className="submit-button3">
                        Fahrt beenden
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Home;