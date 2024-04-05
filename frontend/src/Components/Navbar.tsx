import { Router, useNavigate } from "react-router-dom";
import { getLoginInfo, removeJWT } from "./Logincontext";
import { useEffect, useState } from "react";
import { getUser, getUsers } from "../Api/api";
import { UserResource } from "../util/Resources";
import "./navbar.css"
import { Nav, NavDropdown } from "react-bootstrap";

const Navbar = () => {
    const [user, setUser] = useState<UserResource | null>(null)
    const navigate = useNavigate();

    const handleAbmelden = () => {
        const confirmAbmeldung = window.confirm("Möchten Sie sich wirklich abmelden?");
        if (confirmAbmeldung) {
            removeJWT();
            navigate("/");
        }
    };

    async function getU() {
        const id = getLoginInfo()
        const user = await getUser(id!.userID)
        setUser(user)
    }
    useEffect(() => {
        getU()
    }, [])
    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-dark fixed-top">
        <div className="container">
            <a className="navbar-brand" href="/home"><span className="text-warning">SKM</span>Service</a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link" href="/create">Fahrt Erstellen</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/verwalten">Fahrt Verwalten</a>
                    </li>
                    {user && user.admin && (
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
            {/* Dropdown-Menü für "Mehr" */}
            <NavDropdown title="Mehr" id="collasible-nav-dropdown" className="d-lg-none">
                <NavDropdown.Item href="/create">Fahrt erstellen</NavDropdown.Item>
                <NavDropdown.Item href="/verwalten">Fahrt verwalten</NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/user-erstellen")}>Benutzer registrieren</NavDropdown.Item>
                <NavDropdown.Item onClick={handleAbmelden}>Abmelden</NavDropdown.Item>
                <NavDropdown.Divider />
            </NavDropdown>
        </div>
    </nav>
        
    )

}


export default Navbar;