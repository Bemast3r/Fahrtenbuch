import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css'; // Stil-Datei importieren
import { getJWT, setJWT } from './Logincontext';


const Home = () => {
    const navigate = useNavigate()
    const jwt = getJWT()

    useEffect(() => {
        if (jwt) {
            setJWT(jwt)
        } else {
            navigate("/")
            return;
        }
    }, [jwt])

    return (
        <div className='container2'> {/* Hinzufügen der Klasse container */}
            <h1 className='title'>Kontrollbuch</h1> {/* Hinzufügen der Klasse title */}
            <div className="container"> {/* Hinzufügen der Klasse button-container */}
                <Link to="/fahrt-erstellen">
                    <button className='button'>Fahrt erstellen</button>
                </Link>
                <Link to="/fahrt-bearbeiten">
                    <button className='button'>Fahrt bearbeiten</button>
                </Link>
            </div>

        </div>
    );
};

export default Home;
