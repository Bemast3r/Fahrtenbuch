import React, { useContext } from "react";
import { LoginContext, LoginInfo, getLoginInfo } from "../../Components/Contexte/Logincontext";
import { useNavigate } from 'react-router-dom';

const ProtectedComponent: React.FC<{ requiredRole: "a" | "u"; children: React.ReactNode }> = ({ requiredRole, children }: any) => {
    const navigate = useNavigate();

    const { userID, role } = getLoginInfo()!;

    if (!userID || !role) {
        navigate("/")
    }

    // Überprüfen, ob der Benutzer angemeldet ist und die erforderliche Rolle hat
    if (!userID || role !== requiredRole) {
        // Wenn der Benutzer nicht angemeldet ist oder nicht die erforderliche Rolle hat,
        // eine Benachrichtigung anzeigen und das Kindkomponente nicht rendern
        return <h2 style={{ textAlign: "center" }}>Sie sind kein Administrator.</h2>;
    }

    // Wenn der Benutzer angemeldet ist und die erforderliche Rolle hat,
    // die Kindkomponenten rendern
    return <>{children}</>;
};

export default ProtectedComponent;