import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from './Components/Login';
import Home from './Components/Home';
import Loading from './Components/LoadingIndicator';
import PasswortVergessen from './Components/PasswortVergessen';
import PasswortZuruecksetzen from './Components/PasswortZuruecksetzen';
import AdminFormular from './Components/AdminPanel';
import FahrtErstellen from './Components/Fahrterstellen';
import Statistik from './Components/Statistik';
import UserFahrten from './Components/UserFahrten';
import Fahrtabschliessen from './Components/Fahrtabschliessen';
import TFahrtVerwalten from './Components/TFahrtVerwalten';

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
      </Routes>
    </Router>
  );
};

export default App;
