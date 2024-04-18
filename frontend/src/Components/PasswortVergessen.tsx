import { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import Loading from "./LoadingIndicator";
import { passwortVergessen } from "../Api/api";
import { useNavigate } from "react-router-dom";

const PasswortVergessen = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        try {
            await passwortVergessen(email);
            navigate("/", { state: { confirmationMessage: "Eine E-Mail für das Zurücksetzen des Passwortes wurde erfolgreich versendet." } });
        } catch (error: any) {
            setError("Die angegebene E-Mail-Adresse ist mit keinem Konto verknüpft.");
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <Form className="login-form2" onSubmit={handleSubmit}>
                <h1 className="login-title">Passwort Vergessen</h1>

                <div className="login-input-box">
                    <i className='bx bxs-envelope' ></i>
                    <input type="text" value={email} placeholder="E-Mail" onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <button className="login-btn" type="submit">
                    {loading ? <Loading /> : "Senden"}
                </button>

                {error && (
                    <Alert className="login-error-message" variant="danger">
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
