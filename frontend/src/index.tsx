import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login';
import Home from './Components/Home';
import Loading from './Components/LoadingIndicator';
import FahrtVerwalten from './Components/FahrtVerwalten';
import FahrtErstellen from './Components/FahrtErstellen';
import PasswortVergessen from './Components/PasswortVergessen';

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
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
