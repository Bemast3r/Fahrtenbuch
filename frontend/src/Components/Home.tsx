import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import "./home2.css";
import { getJWT, getLoginInfo, removeJWT, setJWT } from './Logincontext';
import { useNavigate } from 'react-router-dom';

// const Home = () => {
//     const jwt = getJWT();
//     const navigate = useNavigate();
//     const [userRole, setUserRole] = useState('');

//     useEffect(() => {
//         if (!jwt) {
//             navigate("/");
//         } else {
//             setJWT(jwt);
//             const x = getLoginInfo();
//             setUserRole(x!.role)
//         }
//     }, [jwt, navigate]);

//     const handleAbmelden = () => {
//         const confirmAbmeldung = window.confirm("Möchten Sie sich wirklich abmelden?");
//         if (confirmAbmeldung) {
//             removeJWT();
//             navigate("/");
//         }
//     };

//     return (
//         <div className="form-wrapper2">
//             <div className="header-wrapper">
//                 <h2 className="header-home">Kontrollbuch</h2>
//                 <h3 className="header-home">SKM</h3>
//                 {userRole === 'a' && (
//                     <i className='bx bx-user-plus bx-lg' style={{ position: 'absolute', top: '30px', left: '30px', cursor: 'pointer' }} onClick={() => navigate("/user-erstellen")}></i>
//                 )}
//             </div>
//             <div className="form-container">
//                 <Form>
//                     <Button variant="primary" type="submit" className="submit-button2" onClick={() => navigate("/create")}>
//                         Fahrt erstellen
//                     </Button>
//                     <Button variant="primary" type="submit" className="submit-button2" onClick={() => navigate("/verwalten")}>
//                         Fahrt verwalten
//                     </Button>
//                     {userRole === 'a' && (
//                         <Button variant="primary" type="submit" className="submit-button2" onClick={() => navigate("/statistiken")}>
//                             Statistiken
//                         </Button>
//                     )}
//                     <Button variant="danger" type="button" className="submit-button3" onClick={handleAbmelden}>
//                         Abmelden
//                     </Button>
//                 </Form>
//             </div>
//         </div>
//     );
// }

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
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <div className="container">
                    <a className="navbar-brand" href="#"><span className="text-warning">SKM</span>Service</a>
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
                                    <a className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate("/user-erstellen")}>Nutzer Erstellen</a>
                                </li>
                            )}
                            <li className="nav-item">
                                <a className="nav-link" style={{ cursor: 'pointer' }} onClick={handleAbmelden}>Abmelden</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Services */}
            <section className="services section-padding" id="services">
                <div className="container2">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-header text-center pb-5">
                                <h2>SKM Fahrtenbuch</h2>
                                <p>Maximiere deine Steuervorteile und halte deine Fahrzeugkosten niedrig - <br />führ dein Fahrtenbuch gewissenhaft und regelmäßig!</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Service Cards */}
                        <div className="col-12 col-md-12 col-lg-4">
                            <div className="card text-white text-center bg-dark pb-2">
                                <div className="card-body">
                                    <i className='bx bx-plus-circle' ></i>
                                    <h3 className="card-title">Fahrt Erstellen</h3>
                                    <p className="lead">Hier kannst du deine Fahrt mit dem Kennzeichen des Autos, dem Kilometerstand des Autos und dem Ort der Fahrtaufnahme starten.</p>
                                    <button className="btn bg-warning text-dark" onClick={() => navigate("/create")}>Erstelle deine Fahrt</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-4">
                            <div className="card text-white text-center bg-dark pb-2">
                                <div className="card-body">
                                    <i className='bx bxs-car-mechanic' ></i>
                                    <h3 className="card-title">Fahrt Verwalten</h3>
                                    <p className="lead">Verändere Informationen über deine Fahrt wie die Lenkzeit, Arbeitszeit, Pausen oder das Beenden deiner Fahrt.</p>
                                    <button className="btn bg-warning text-dark" onClick={() => navigate("/verwalten")} >Verwalte deine Fahrt</button>
                                </div>
                            </div>
                        </div>
                        {userRole === 'a' && (
                            <div className="col-12 col-md-12 col-lg-4">
                                <div className="card text-white text-center bg-dark pb-2">
                                    <div className="card-body">
                                        <i className='bx bx-stats' ></i>
                                        <h3 className="card-title">Statistiken</h3>
                                        <p className="lead">Siehe alle wichtigen Informationen über die Fahrten wie die Anzahl der laufenden oder schon abgeschlossenen Fahrten.</p>
                                        <button className="btn bg-warning text-dark" onClick={() => navigate("/statistiken")}>Erfahre Mehr</button>
                                    </div>
                                </div>
                            </div>
                        )}
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


// export default Home;
