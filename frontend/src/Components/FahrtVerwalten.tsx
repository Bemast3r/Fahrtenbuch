import React, { useContext, useEffect, useState } from 'react';
import './fahrtVerwalten.css';
import { getJWT, getLoginInfo, setJWT } from './Logincontext';
import { getUser, getFahrt, updateFahrt } from '../Api/api';
import { FahrtResource } from '../util/Resources';
import Loading from './LoadingIndicator';
import { UserContext } from './UserContext';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface LogEntry {
  action: string;
  time: Date;
}

const FahrtVerwalten: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true); // Zustand für den Ladezustand
  const [pausen, setPausen] = useState<LogEntry[]>([]);
  const [isLenkzeitRunning, setLenkzeitRunning] = useState<boolean>(false);
  const [isArbeitszeitRunning, setArbeitszeitRunning] = useState<boolean>(false);
  const [isPausenRunning, setPausenRunning] = useState<boolean>(false);

  const jwt = getJWT();
  const [letzteFahrt, setLetzteFahrt] = useState<FahrtResource | null>(null);
  const usercontexte = useContext(UserContext);

  let ende: Date;
  useEffect(() => {
    if (jwt) {
      setJWT(jwt);
    } else {
      return;
    }
  }, [jwt]);

  useEffect(() => {
    // Überprüfe, ob der UserContext gültige Daten enthält
    if (usercontexte && usercontexte.length > 0 && usercontexte[0]) {
      setLoading(false); // Setze loading auf false, wenn der UserContext gültige Daten enthält
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [usercontexte]); // Hier usercontexte als Abhängigkeit hinzufügen

  useEffect(() => {
    // Diese useEffect-Hook wird nur einmal ausgeführt, wenn loading auf false gesetzt wird
    if (!loading) {
      // Hier kannst du Logik einfügen, die nur ausgeführt werden soll, wenn loading auf false gesetzt wird
    }
  }, [loading]);

  async function last() {
    const id = getLoginInfo();
    if (!id!.userID) {
      throw new Error("Ups hier ist was falsch gelaufen.");
    }
    const x: FahrtResource[] = await getFahrt(id!.userID);
    setLetzteFahrt(x[x.length - 1]);
    setLoading(false);
  }

  useEffect(() => { last() }, [letzteFahrt]);



  async function handlePost() {
    if (usercontexte[0].id && letzteFahrt) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte[0].id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        // lenkzeit: [{ start: ende!, stop: endTime! }],
        // arbeitszeit: letzteFahrt.arbeitszeit!.concat(arbeitszeit),
        // pause: letzteFahrt.pause!.concat(pausen),
        beendet: false, // Fahrt als beendet markieren
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt)
      console.log(fahrt)
    }
  }



  function handleEnde() {
    console.log("")
  }

  return (
    <div>
      <h1 className="header">Fahrt Verwalten</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="container">
          <h3>Hallo {usercontexte && usercontexte[0]?.name ? usercontexte[0].name : "Kein User"}.</h3>
          {letzteFahrt && !letzteFahrt.beendet ? (
            <>
              <p>Ihre momentane Fahrt startete am {letzteFahrt ? new Date(letzteFahrt.createdAt!).toLocaleDateString('de-DE') + ' um ' + new Date(letzteFahrt.createdAt!).toLocaleTimeString('de-DE') : "Keine Fahrt"},
                mit dem Kennzeichen {letzteFahrt ? letzteFahrt.kennzeichen : "Kein Kennzeichen"}.
              </p>
              <p>Ihr Startpunkt ist {letzteFahrt ? letzteFahrt?.startpunkt : "Kein Startpunkt"}.</p>
              <p>Ihr momentaner Status lautet: {isPausenRunning ? "Pause" : isArbeitszeitRunning ? "Arbeitszeit" : isLenkzeitRunning ? "Lenkzeit" : "Noch nichts gestartet"}</p>


              <div className="section">
                <div className="button-group">
                  <button>
                    {isPausenRunning ? 'Pausen stoppen' : 'Pausen starten'}
                  </button>
                </div>
                <ul className="log-list">
                  {pausen.map((entry, index) => (
                    <li key={index}>
                      {entry.action} - {entry.time.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="section">
                <div className="button-group">
                  <button >Fahrt beenden</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p>Erstellen Sie eine Fahrt, um diese zu verwalten.</p>
              <Link to="/create">
                <Button onClick={() => { handleEnde() }}>Fahrt Erstellen</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );


};

export default FahrtVerwalten;
