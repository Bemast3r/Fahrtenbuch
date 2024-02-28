import "./login.css";
import 'boxicons/css/boxicons.min.css';

// import { sendPasswordResetEmail } from "../../../backend/src/Services/UserService";
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Loading from "./LoadingIndicator";
import { getJWT, setJWT } from "./Logincontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PasswortVergessen = () => {
    const [email, setEmail] = useState("");
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
            axios.post("http://localhost:3001/passwort-vergessen", {email}).then(res => {
                if (res.data.Status === "Success") {
                    navigate("/");
                }
            })
            // await sendPasswordResetEmail(email);
            // alert('Passwort-Zurücksetzungs-E-Mail gesendet.');
            navigate("/");
        } catch (error) {
            alert('Fehler beim Senden der E-Mail.');
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
            </Form>

            {/* Footer */}
            <div className="login-footer">
                SKM | &copy;2024
            </div>
        </div>
    );
};

export default PasswortVergessen;
