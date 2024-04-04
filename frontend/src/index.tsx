import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login';
import Home from './Components/Home';
import Loading from './Components/LoadingIndicator';
import FahrtVerwalten from './Components/FahrtVerwalten';
import PasswortVergessen from './Components/PasswortVergessen';
import PasswortZuruecksetzen from './Components/PasswortZuruecksetzen';
import AdminFormular from './Components/AdminPanel';
import FahrtErstellen from './Components/Fahrterstellen';
import Statistik from './Components/Statistik';
import UserFahrten from './Components/UserFahrten';
import Fahrtabschliessen from './Components/Fahrtabschliessen';

ReactDOM.render(
  
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="test" element={<Loading />} />
        <Route path="create" element={<FahrtErstellen />} />
        <Route path="verwalten" element={<FahrtVerwalten />} />
        <Route path="passwort-vergessen" element={<PasswortVergessen />} />
        <Route path="passwort-zuruecksetzen/:token" element={<PasswortZuruecksetzen />} />
        <Route path="user-erstellen" element={<AdminFormular />} />
        <Route path="statistiken" element={<Statistik />} />
        <Route path="fahrten" element={<UserFahrten />} />
        <Route path="fahrten-abschluss" element={<Fahrtabschliessen />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
