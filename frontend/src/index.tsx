import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login';
import Home from './Components/Home';
import Loading from './Components/LoadingIndicator';
import FahrtErstellen from './Components/FahrtErstellen';
import FahrtVerwalten from './Components/FahrtVerwalten';
import Contexte from './Components/Contexte';
import { getUser } from './Api/api';
import { LoginContext, getLoginInfo } from './Components/Logincontext';
import { UserResource } from './util/Resources';
import { UserContext } from './Components/UserContext';
import { FahrtContextProvider } from './Components/FahrtenContext/FahrtContext';

const App = () => {
  const [loginInfo, setLoginInfo] = useState(getLoginInfo());
  const [userInfo, setUserInfo] = useState<UserResource | null>(null);

  useEffect(() => {
    async function getUserData() {
      if (!loginInfo) return;
      try {
        setUserInfo(await getUser(loginInfo.userID));
      } catch (error) { }
    }
    getUserData();
  }, [loginInfo]);

  return (
    <FahrtContextProvider>
      <UserContext.Provider value={[userInfo, setUserInfo]}>
        <LoginContext.Provider value={[loginInfo, setLoginInfo]}>
          <React.StrictMode>
            <Router>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="home" element={<Home />} />
                <Route path="create" element={<FahrtErstellen />} />
                <Route path="verwalten" element={<FahrtVerwalten />} />
                <Route path="test" element={<Contexte />} />
              </Routes>
            </Router>
          </React.StrictMode>
        </LoginContext.Provider>
      </UserContext.Provider>
    </FahrtContextProvider>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
