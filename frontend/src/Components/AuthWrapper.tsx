import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJWT } from "./Logincontext";

interface Props {
  children: ReactNode;
}

const AuthWrapper: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = getJWT();
    if (jwt === null) {
      navigate("/");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthWrapper;
