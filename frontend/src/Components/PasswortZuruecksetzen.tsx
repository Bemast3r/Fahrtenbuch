import "./login.css";
import 'boxicons/css/boxicons.min.css';

import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
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
        if (token) {
            await passwortZuruecksetzen(token, inputPassword); 
            navigate("/");
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

                <div className="login-input-box password">
                    <i className='bx bxs-lock-alt'></i>
                    <input type={showPassword ? "text" : "password"} value={inputPassword} placeholder="Neues Passwort" onChange={handlePasswordInputChange} required />
                    {showPasswordIcon && (
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <i className='bx bx-hide'></i> : <i className='bx bx-show'></i>}
                        </button>
                    )}
                </div>

                <Button className="login-btn" variant="primary" type="submit">
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
