import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./home.css";
import { useEffect } from 'react';
import { getJWT, removeJWT, setJWT } from './Logincontext';
import { useNavigate } from 'react-router-dom';

const Home = () => {

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


    return (
        <div className="form-wrapper2">
            <div className="header-wrapper">
                <h2 className="header-home">Kontrollbuch</h2>
                <h3 className="header-home">SKM</h3>
            </div>
            <div className="form-container">
                <Form>
                    <Button variant="primary" type="submit" className="submit-button2" onClick={() => { navigate("/create") }}>
                        Fahrt erstellen
                    </Button>
                    <Button variant="primary" type="submit" className="submit-button2" onClick={() => { navigate("/verwalten") }}>
                        Fahrt verwalten
                    </Button>
                    <Button variant="danger" type="submit" className="submit-button3">
                        Fahrt beenden
                    </Button>
                    <Button variant="danger" type="submit" className="submit-button4" onClick={() => { removeJWT() }}>
                        Abmelden
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Home;