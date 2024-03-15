import { Router, useNavigate } from "react-router-dom";
import { removeJWT } from "./Logincontext";

const Navbar = () => {
    const navigate = useNavigate();

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
                        {/* {userRole === 'a' && (
                        <li className="nav-item">
                            <a className="nav-link" style={{ cursor: 'pointer', color: '#2196F3', display: 'flex', alignItems: 'center' }} onClick={() => navigate("/user-erstellen")}>
                                Benutzer Registrieren <i className='bx bx-user-plus' style={{ fontSize: '24px', marginLeft: '5px' }}></i>
                            </a>
                        </li>
                    )} */}
                        <li className="nav-item">
                            <a className="nav-link" style={{ cursor: 'pointer', color: 'red', display: 'flex', alignItems: 'center' }} onClick={handleAbmelden}>
                                Abmelden <i className='bx bx-log-out' style={{ fontSize: '24px', marginLeft: '5px' }}></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )

}


export default Navbar;