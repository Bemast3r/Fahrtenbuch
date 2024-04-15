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
        <div className="wasgeht">
            <Navbar></Navbar>
            {/* Services */}
            <section className="services section-padding" id="services">
                <div className="container2">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-header text-center pb-5">
                                <h2>SKM Fahrtenbuch</h2>
                                <p className="subtitle">Notiere hier alle wichtigen Informationen über deine Fahrten -<br />führ dein Fahrtenbuch gewissenhaft und regelmäßig!</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Service Cards */}
                        <div className="col-12col-md-12col-lg-4">
                            <div className="card text-white text-center bg-dark pb-2" style={{ margin: '0 auto' }}>
                                <div className="card-body">
                                    <i className='bx bx-plus-circle' ></i>
                                    <h3 className="card-title">Fahrt erstellen</h3>
                                    <p className="lead">Starte deine Fahrt mit dem Kennzeichen, dem Kilometerstand des Autos und dem Ort der Fahrtaufnahme.</p>
                                    <button className="btn-custom" onClick={() => navigate("/create")}>Fahrt erstellen</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12col-md-12col-lg-4">
                            <div className="card text-white text-center bg-dark pb-2" style={{ margin: '0 auto' }}>
                                <div className="card-body">
                                    <i className='bx bxs-car-mechanic' ></i>
                                    <h3 className="card-title">Fahrt verwalten</h3>
                                    <p className="lead">Verändere Informationen über deine Fahrt wie die Lenkzeit, Arbeitszeit, Pausen oder Beende deine Fahrt.</p>
                                    <button className="btn-custom" onClick={() => navigate("/verwalten")} >Fahrt verwalten</button>
                                </div>
                            </div>
                        </div>
                        {userRole === "a" && (
                            <div className="col-12col-md-12col-lg-4">
                                <div className="card text-white text-center bg-dark pb-2" style={{ margin: '0 auto' }}>
                                    <div className="card-body">
                                        <i className='bx bx-stats' ></i>
                                        <h3 className="card-title">Statistiken</h3>
                                        <p className="lead">Siehe alle wichtigen Informationen über alle Fahrten wie die Anzahl der laufenden oder schon abgeschlossenen Fahrten.</p>
                                        <button className="btn-custom" onClick={() => navigate("/statistiken")}>Erfahre mehr</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {userRole !== "a" && (
                            <div className="col-12 col-md-12 col-lg-4">
                                <div className="card text-white text-center bg-dark pb-2" style={{ margin: '0 auto' }}>
                                    <div className="card-body">
                                        <i className='bx bx-stats' ></i>
                                        <h3 className="card-title">Meine Fahrten</h3>
                                        <p className="lead">Siehe alle wichtigen Informationen über deine Fahrt wie die Anzahl der laufenden oder schon abgeschlossenen Fahrten.</p>
                                        <button className="btn bg-warning text-dark" onClick={() => navigate("/fahrten")}>Erfahre Mehr</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;