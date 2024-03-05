import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import "./home.css";
import { getJWT, getLoginInfo, removeJWT, setJWT } from './Logincontext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const jwt = getJWT();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!jwt) {
            navigate("/");
        } else {
            setJWT(jwt);
            const x = getLoginInfo();
            setUserRole(x!.role)
        }
    }, [jwt, navigate]);

    const handleAbmelden = () => {
        const confirmAbmeldung = window.confirm("Möchten Sie sich wirklich abmelden?");
        if (confirmAbmeldung) {
            removeJWT();
            navigate("/");
        }
    };

    return (
        <div className="form-wrapper2">
            <div className="header-wrapper">
                <h2 className="header-home">Kontrollbuch</h2>
                <h3 className="header-home">SKM</h3>
                {userRole === 'a' && (
                    <i className='bx bx-user-plus bx-lg' style={{ position: 'absolute', top: '30px', left: '30px', cursor: 'pointer' }} onClick={() => navigate("/user-erstellen")}></i>
                )}
            </div>
            <div className="form-container">
                <Form>
                    <Button variant="primary" type="submit" className="submit-button2" onClick={() => navigate("/create")}>
                        Fahrt erstellen
                    </Button>
                    <Button variant="primary" type="submit" className="submit-button2" onClick={() => navigate("/verwalten")}>
                        Fahrt verwalten
                    </Button>
                    {userRole === 'a' && (
                        <Button variant="primary" type="submit" className="submit-button2" onClick={() => navigate("/statistiken")}>
                            Statistiken
                        </Button>
                    )}
                    <Button variant="danger" type="button" className="submit-button3" onClick={handleAbmelden}>
                        Abmelden
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Home;
