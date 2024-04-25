import { Router, useLocation, useNavigate } from "react-router-dom";
import { getJWT, removeJWT, setJWT } from "../Context/Logincontext";
import { useEffect, useState } from "react";
import "./navbar.css"
import { NavDropdown } from "react-bootstrap";
import { useUser } from "../Context/UserContext";

const Navbar = () => {
    const user = useUser();
    const [activeLink, setActiveLink] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const jwt = getJWT();

    useEffect(() => {
        if (jwt) {
            setJWT(jwt);
        } else {
            navigate("/");
        }
    }, [jwt, navigate]);

    useEffect(() => {
        const currentPath = location.pathname;
        setActiveLink(currentPath);
    }, [location.pathname]);

    const handleAbmelden = () => {
        const confirmAbmeldung = window.confirm("Möchten Sie sich wirklich abmelden?");
        if (confirmAbmeldung) {
            removeJWT();
            navigate("/");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark fixed-top">
            <div className="container">
                <a className="navbar-brand" href="/home"><span className="text-warning">SKM</span>Service</a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className={`nav-link ${activeLink === "/create" ? "active" : ""}`} href="/create">Fahrt erstellen</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${activeLink === "/verwalten" ? "active" : ""}`} href="/verwalten">Fahrt verwalten</a>
                        </li>
                        {user && user.admin && (
                            <li className="nav-item">
                                <a className={`nav-link ${activeLink === "/statistiken" ? "active" : ""}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} href="/statistiken">Statistiken</a>
                            </li>
                        )}
                        {user && !user.admin && (
                            <li className="nav-item">
                                <a className={`nav-link ${activeLink === "/fahrten" ? "active" : ""}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} href="/fahrten">Meine Fahrten</a>
                            </li>
                        )}
                        {user && user.admin && (
                            <li className="nav-item">
                                <a className={`nav-link ${activeLink === "/user-erstellen" ? "active" : ""}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} href="/user-verwalten">Benutzer verwalten</a>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" style={{ cursor: 'pointer', color: '#e80000', display: 'flex', alignItems: 'center' }} onClick={handleAbmelden}>
                                Abmelden <i className='bx bx-log-out' style={{ fontSize: '24px', marginLeft: '5px' }}></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <NavDropdown title="Mehr" id="collasible-nav-dropdown" className="d-lg-none">
                    <NavDropdown.Item href="/create">Fahrt erstellen</NavDropdown.Item>
                    <NavDropdown.Item href="/verwalten">Fahrt verwalten</NavDropdown.Item>
                    <NavDropdown.Item href="/statistiken">Statistiken</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate("/user-verwalten")}>Benutzer verwalten</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleAbmelden} style={{ color: 'red' }}>Abmelden</NavDropdown.Item>
                    <NavDropdown.Divider />
                </NavDropdown>
            </div>
        </nav>
    );
}

export default Navbar;
