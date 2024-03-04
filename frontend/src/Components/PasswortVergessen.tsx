import "./login.css";
import 'boxicons/css/boxicons.min.css';

import { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Loading from "./LoadingIndicator";
import { getJWT, setJWT } from "./Logincontext";
import { useNavigate } from "react-router-dom";
import { passwortVergessen } from "../Api/api";

const PasswortVergessen = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
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
            await passwortVergessen(email);
            navigate("/");
        } catch (error: any) {
            setShow(true);
            setError("Die eingegebene E-Mail-Adresse ist mit keinem Konto verknüpft.");
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <Form className="login-form" onSubmit={handleSubmit}>
                <h1 className="login-title">Passwort Vergessen</h1>

                <div className="login-input-box">
                    <i className='bx bxs-envelope' ></i>
                    <input type="text" value={email} placeholder="E-Mail" onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <Button className="login-btn" variant="primary" type="submit">
                    {loading ? <Loading /> : "Senden"}
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

export default PasswortVergessen;
