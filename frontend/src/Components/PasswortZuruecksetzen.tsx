import "./login.css";
import 'boxicons/css/boxicons.min.css';

import { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Loading from "./LoadingIndicator";
import { getJWT, setJWT } from "./Logincontext";
import { useNavigate, useParams } from "react-router-dom";
import { passwortZuruecksetzen } from "../Api/api";

const PasswortZuruecksetzen = () => {
    const { token } = useParams();
    const [inputPassword, setInputPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordIcon, setShowPasswordIcon] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertmessage, setAlertMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertPostitv, setShowAlertPositiv] = useState(false);

    const navigate = useNavigate()

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        if (token) {
            const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

            if (!regex.test(inputPassword)) {
                setAlertMessage("Das Passwort muss mindestens 8 Zeichen lang, Groß-/Kleinschreibung, sein.")
                setShowAlert(true)
            } else {
                await passwortZuruecksetzen(token, inputPassword);
                setShowAlertPositiv(true)
                setAlertMessage("Ihr Passwort wurde erfolgreich aktualisiert.")
                setTimeout(() => {
                    navigate("/");
                }, 1000)
            }

        }
        setLoading(false);
    };

    const handlePasswordInputChange = (e: any) => {
        setInputPassword(e.target.value);
        setShowPasswordIcon(e.target.value.length > 0);
    };

    return (
        <div className="login-container">
            <Form className="login-form" onSubmit={handleSubmit}>
                <h1 className="login-title">Passwort Zurücksetzen</h1>
                {showAlert && (
                    <Alert variant="alert alert-danger" role="alert" show={showAlert} onClose={() => setShowAlert(false)} dismissible className="custom-alert-gut">
                        {alertmessage}</Alert>
                )}
                {showAlertPostitv && (
                    <Alert variant="success" show={showAlertPostitv} onClose={() => setShowAlertPositiv(false)} dismissible className="custom-alert-gut">
                        {alertmessage}</Alert>
                )}
                <div className="login-input-box password">
                    <i className='bx bxs-lock-alt'></i>
                    <input type={showPassword ? "text" : "password"} value={inputPassword} placeholder="Neues Passwort" onChange={handlePasswordInputChange} required />
                    {showPasswordIcon && (
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <i className='bx bx-hide'></i> : <i className='bx bx-show'></i>}
                        </button>
                    )}
                </div>

                <Button className="login-btn" variant="primary" type="submit" disabled={showAlertPostitv}>
                    {loading ? <Loading /> : "Aktualisieren"}
                </Button>
            </Form>

            {/* Footer */}
            <div className="login-footer">
                SKM | &copy;2024
            </div>
        </div>
    );
};

export default PasswortZuruecksetzen;
