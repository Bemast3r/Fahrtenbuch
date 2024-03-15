import "./home2.css";
import React, { useEffect, useState } from 'react';
import { getJWT, getLoginInfo, removeJWT, setJWT } from './Logincontext';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";

const LandingPage = () => {
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
        <div>
            {/* Navbar */}
            {/* <nav className="navbar navbar-expand-lg navbar-light bg-dark fixed-top">
                <div className="container">
                    <a className="navbar-brand" href=""><span className="text-warning">SKM</span>Service</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/create">Fahrt Erstellen</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/verwalten">Fahrt Verwalten</a>
                            </li>
                            {userRole === 'a' && (
                                <li className="nav-item">
                                    <a className="nav-link" style={{ cursor: 'pointer', color: '#2196F3', display: 'flex', alignItems: 'center' }} onClick={() => navigate("/user-erstellen")}>
                                        Benutzer Registrieren <i className='bx bx-user-plus' style={{ fontSize: '24px', marginLeft: '5px' }}></i>
                                    </a>
                                </li>
                            )}
                            <li className="nav-item">
                                <a className="nav-link" style={{ cursor: 'pointer', color: 'red', display: 'flex', alignItems: 'center' }} onClick={handleAbmelden}>
                                    Abmelden <i className='bx bx-log-out' style={{ fontSize: '24px', marginLeft: '5px' }}></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav> */}
            {/* <Navbar></Navbar> */}
            {/* Services */}
            <section className="services section-padding" id="services">
                <div className="container2">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-header text-center pb-5">
                                <h2>SKM Fahrtenbuch</h2>
                                <p>Notiere hier alle wichtigen Informationen über deine Fahrten -<br />führ dein Fahrtenbuch gewissenhaft und regelmäßig!</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Service Cards */}
                        <div className="col-12 col-md-12 col-lg-4">
                            <div className="card text-white text-center bg-dark pb-2" style={{ margin: '0 auto' }}>
                                <div className="card-body">
                                    <i className='bx bx-plus-circle' ></i>
                                    <h3 className="card-title">Fahrt Erstellen</h3>
                                    <p className="lead">Starte deine Fahrt mit dem Kennzeichen, dem Kilometerstand des Autos und dem Ort der Fahrtaufnahme.</p>
                                    <button className="btn bg-warning text-dark" onClick={() => navigate("/create")}>Fahrt Erstellen</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-4">
                            <div className="card text-white text-center bg-dark pb-2" style={{ margin: '0 auto' }}>
                                <div className="card-body">
                                    <i className='bx bxs-car-mechanic' ></i>
                                    <h3 className="card-title">Fahrt Verwalten</h3>
                                    <p className="lead">Verändere Informationen über deine Fahrt wie die Lenkzeit, Arbeitszeit, Pausen oder Beende deine Fahrt.</p>
                                    <button className="btn bg-warning text-dark" onClick={() => navigate("/verwalten")} >Fahrt Verwalten</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-4">
                            <div className="card text-white text-center bg-dark pb-2" style={{ margin: '0 auto' }}>
                                <div className="card-body">
                                    <i className='bx bx-stats' ></i>
                                    <h3 className="card-title">Statistiken</h3>
                                    <p className="lead">Siehe alle wichtigen Informationen über deine Fahrt wie die Anzahl der laufenden oder schon abgeschlossenen Fahrten.</p>
                                    <button className="btn bg-warning text-dark" onClick={() => navigate("/statistiken")}>Erfahre Mehr</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="login-footer">
                SKM | &copy;2024
            </div>
        </div>
    );
}

export default LandingPage;