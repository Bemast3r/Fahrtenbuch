import { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Loading from "../../util/Components/LoadingIndicator";
import { login } from "../../Api/api";
import { getJWT, setJWT } from "../Contexte/Logincontext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./login.css";

const Login = () => {
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordIcon, setShowPasswordIcon] = useState(false);
    const [error, setError] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const jwt = getJWT();

    useEffect(() => {
        if (jwt) {
            setJWT(jwt);
            navigate("/home");
        } else {
            return;
        }
    }, [jwt, navigate]);

    useEffect(() => {
        if (location.state && location.state.confirmationMessage) {
            setShowConfirmation(true);
        }
    }, [location.state]);

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        try {
            const jwt = await login({ username: inputUsername, password: inputPassword });
            setJWT(jwt.access_token);
            navigate("/home");
        } catch (error: any) {
            setError("Ihre Anmeldeinformationen sind falsch. Bitte versuchen Sie es erneut.");
        }
        setLoading(false);
    };

    const handlePasswordInputChange = (e: any) => {
        setInputPassword(e.target.value);
        setShowPasswordIcon(e.target.value.length > 0);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <Form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="login-title">Login</h1>
                    {showConfirmation && (
                        <Alert className="login-confirmation-message" variant="success" onClose={handleCloseConfirmation} dismissible>
                            {location.state.confirmationMessage}
                        </Alert>
                    )}
                    {error && (
                        <Alert className="login-error-message" variant="danger">
                            {error}
                        </Alert>
                    )}
                    <div className="login-input-box">
                        <i className='bx bxs-user'></i>
                        <input type="text" value={inputUsername} placeholder="Nutzername" onChange={(e) => setInputUsername(e.target.value)} required />
                    </div>

                    <div className="login-input-box password">
                        <i className='bx bxs-lock-alt'></i>
                        <input type={showPassword ? "text" : "password"} value={inputPassword} placeholder="Passwort" onChange={handlePasswordInputChange} required />
                        {showPasswordIcon && (
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <i className='bx bx-hide'></i> : <i className='bx bx-show'></i>}
                            </button>
                        )}
                    </div>

                    <div className="login-remember-password">
                        <Link to="passwort-vergessen">Passwort vergessen?</Link>
                    </div>

                    <button className="login-btn" type="submit">
                        {loading ? <Loading /> : "Anmelden"}
                    </button>
                </Form>

                {/* Footer */}
                <div className="login-footer">
                    SKM | &copy;2024
                </div>
            </div>
        </div>
    );
};

export default Login;
