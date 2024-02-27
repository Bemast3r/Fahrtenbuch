import "./login.css";
import 'boxicons/css/boxicons.min.css';

import { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Loading from "./LoadingIndicator";
import { login } from "../Api/api";
import { getJWT, setJWT } from "./Logincontext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordIcon, setShowPasswordIcon] = useState(false);
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const jwt = getJWT();

    useEffect(() => {
        if (jwt) {
            setJWT(jwt);
            navigate("/home");
        } else {
            return;
        }
    }, [jwt, navigate]);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        try {
            const jwt = await login({ username: inputUsername, password: inputPassword });
            setJWT(jwt.access_token);
            navigate("/home");
        } catch (error: any) {
            setShow(true);
            setError(error.toString());
        }
        setLoading(false);
    };

    const handlePassword = () => { };

    const handlePasswordInputChange = (e: any) => {
        setInputPassword(e.target.value);
        setShowPasswordIcon(e.target.value.length > 0); // Setze showPasswordIcon auf true, wenn das Passwortfeld nicht leer ist
    };

    return (
        <div className="login-container">
            <Form className="login-form" onSubmit={handleSubmit}>
                <h1 className="login-title">Login</h1>

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
                    <a href="#" onClick={handlePassword}>Passwort vergessen?</a>
                </div>

                <Button className="login-btn" variant="primary" type="submit">
                    {loading ? <Loading /> : "Anmelden"}
                </Button>

                {show && (
                    <Alert
                        className="login-error-message"
                        variant="danger"
                        onClose={() => setShow(false)}
                        dismissible
                    >
                        {error}
                    </Alert>
                )}
            </Form>

            {/* Footer */}
            <div className="login-footer">
                SKM | &copy;2024
            </div>
        </div>
    );
};

export default Login;
