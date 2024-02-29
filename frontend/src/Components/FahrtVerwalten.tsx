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
  const [lenkzeit, setLenkzeit] = useState<LogEntry[]>([]);
  const [arbeitszeit, setArbeitszeit] = useState<LogEntry[]>([]);
  const [pausen, setPausen] = useState<LogEntry[]>([]);
  const [isLenkzeitRunning, setLenkzeitRunning] = useState<boolean>(false);
  const [isArbeitszeitRunning, setArbeitszeitRunning] = useState<boolean>(false);
  const [isPausenRunning, setPausenRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showWorkStarted, setShowWorkStarted] = useState<boolean>(false);
  const [showTripEnded, setShowTripEnded] = useState<boolean>(false);
  const jwt = getJWT();
  const [letzteFahrt, setLetzteFahrt] = useState<FahrtResource | null>(null);
  const usercontexte = useContext(UserContext);

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

  const startStopTimer = (
    isRunning: boolean,
    setRunning: React.Dispatch<React.SetStateAction<boolean>>,
    log: LogEntry[],
    setLog: React.Dispatch<React.SetStateAction<LogEntry[]>>
  ) => {
    const action = isRunning ? 'stop' : 'start';
    const time = new Date();
  
    if (action === 'start') {
      // Setze den Startzeitpunkt nur beim ersten Start
      setStartTime(time);
    }

    setLog([...log, { action, time }]);
    setRunning(!isRunning);

    if (action === 'stop') {
      // Setze den Endzeitpunkt nur beim Stop
      setEndTime(time); // Hier wird endTime aktualisiert
      setShowTripEnded(true);
      setShowWorkStarted(false);
  
      if (endTime !== null) { // Überprüfe, ob endTime nicht null ist
        handlePost(); // Rufe handlePost auf
      }
    }
  };

  const calculateTimeDifference = (log: LogEntry[]) => {
    let totalTime = 0;
    for (let i = 0; i < log.length; i += 2) {
      const start = log[i].time;
      const end = i + 1 < log.length ? log[i + 1].time : new Date();
      totalTime += (end.getTime() - start.getTime()) as number;
    }
    return totalTime;
  };

  const calculateFormattedTime = (log: LogEntry[]) => {
    const totalMilliseconds = calculateTimeDifference(log);
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const calculateTotalTime = () => {
    const totalLenkzeit = calculateTimeDifference(lenkzeit);
    const totalArbeitszeit = calculateTimeDifference(arbeitszeit);
    const totalPausenzeit = calculateTimeDifference(pausen);

    const totalMilliseconds = totalLenkzeit + totalArbeitszeit + totalPausenzeit;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const endFahrt = () => {
    setLenkzeitRunning(false);
    setArbeitszeitRunning(false);
    setPausenRunning(false);
    setEndTime(new Date());
    setShowWorkStarted(true);
  };


  async function handlePost() {
    if (usercontexte[0].id && letzteFahrt) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte[0].id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        lenkzeit: [{ start: endTime!, stop: startTime! }],
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
                  <button onClick={() => startStopTimer(isLenkzeitRunning, setLenkzeitRunning, lenkzeit, setLenkzeit)}>
                    {isLenkzeitRunning ? 'Lenkzeit stoppen' : 'Lenkzeit starten'}
                  </button>
                </div>
                <ul className="log-list">
                  <ul>
                    {letzteFahrt ? (
                      Object.entries(letzteFahrt).map(([key, value]) => (
                        <li key={key}>
                          {key}: {Array.isArray(value) ? value.join(', ') : value instanceof Date ? value.toLocaleString() : (typeof value === 'boolean' ? value.toString() : value || 'leer')}
                        </li>
                      ))
                    ) : (
                      <p>Keine Fahrt gefunden.</p>
                    )}
                  </ul>
                </ul>
                <p>Lenkzeit: {calculateFormattedTime(lenkzeit)}</p>
              </div>

              <div className="section">
                <div className="button-group">
                  <button onClick={() => startStopTimer(isArbeitszeitRunning, setArbeitszeitRunning, arbeitszeit, setArbeitszeit)}>
                    {isArbeitszeitRunning ? 'Arbeitszeit stoppen' : 'Arbeitszeit starten'}
                  </button>
                </div>
                <ul className="log-list">
                  {arbeitszeit.map((entry, index) => (
                    <li key={index}>
                      {entry.action} - {entry.time.toLocaleString()}
                    </li>
                  ))}
                </ul>
                <p>Arbeitszeit: {calculateFormattedTime(arbeitszeit)}</p>
              </div>

              <div className="section">
                <div className="button-group">
                  <button onClick={() => startStopTimer(isPausenRunning, setPausenRunning, pausen, setPausen)}>
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
                <p>Pausenzeit: {calculateFormattedTime(pausen)}</p>
              </div>
              <div className="section">
                <div className="button-group">
                  <button onClick={endFahrt}>Fahrt beenden</button>
                </div>
                <p className="results">Gesamte Lenkzeit: {calculateFormattedTime(lenkzeit)}</p>
                <p className="results">Gesamte Arbeitszeit: {calculateFormattedTime(arbeitszeit)}</p>
                <p className="results">Gesamte Pausenzeit: {calculateFormattedTime(pausen)}</p>
                {endTime && <p className="results">Fahrt beendet um: {endTime.toLocaleString()}</p>}
                {showWorkStarted && <p className="results">Arbeit gestartet um: {startTime?.toLocaleString()}</p>}
                <p className="results">Gesamte Arbeitszeit: {calculateTotalTime()}</p>
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
