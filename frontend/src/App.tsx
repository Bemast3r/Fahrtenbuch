import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Loading from './util/Components/LoadingIndicator';
import PasswortVergessen from './Components/Login/Passwort/PasswortVergessen';
import PasswortZuruecksetzen from './Components/Login/Passwort/PasswortZuruecksetzen';
import AdminFormular from './Components/Admin/AdminPanel';
import FahrtErstellen from './Components/FahrtErstellen/Fahrterstellen';
import Statistik from './Components/Admin/Statistik';
import UserFahrten from './Components/Statistiken/UserFahrten';
import Fahrtabschliessen from './Components/Fahrtverwalten/Fahrtabschliessen';
import TFahrtVerwalten from './Components/Fahrtverwalten/TFahrtVerwalten';
import FahrtenContent from "./Components/Contexte/context";

const App = () => {

  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="test" element={<Loading />} />
        <Route path="create" element={<FahrtErstellen />} />
        <Route path="verwalten" element={<TFahrtVerwalten />} />
        <Route path="passwort-vergessen" element={<PasswortVergessen />} />
        <Route path="passwort-zuruecksetzen/:token" element={<PasswortZuruecksetzen />} />
        <Route path="user-erstellen" element={<AdminFormular />} />
        <Route path="statistiken" element={<Statistik />} />
        <Route path="fahrten" element={<UserFahrten />} />
        <Route path="fahrten-abschluss" element={<Fahrtabschliessen />} />
        <Route path="context" element={<FahrtenContent />} />

      </Routes>
    </Router>
  );
};

export default App;
