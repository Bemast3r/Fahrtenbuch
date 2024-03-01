import React, { useContext, useEffect, useState } from 'react';
import './fahrtVerwalten.css';
import { getJWT, getLoginInfo, setJWT } from './Logincontext';
import { getUser, getFahrt, updateFahrt } from '../Api/api';
import { FahrtResource } from '../util/Resources';
import Loading from './LoadingIndicator';
import { UserContext } from './UserContext';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

interface TimeRecord {
  start: Date;
  stop: Date | null;
}

const FahrtVerwalten: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true); // Zustand fÃ¼r den Ladezustand
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [isRecordingLenkzeit, setIsRecordingLenkzeit] = useState<boolean>(false);
  const [isRecordingArbeitszeit, setIsRecordingArbeitszeit] = useState<boolean>(false);
  const [isRecordingPause, setIsRecordingPause] = useState<boolean>(false);
  const [lenktext, setLenkText] = useState<string>('Lenkzeit START');
  const [arbeitText, setArbeitText] = useState<string>('Arbeitszeit START');
  const [pauseText, setPauseText] = useState<string>('Pause START');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate()

  const jwt = getJWT();
  const [letzteFahrt, setLetzteFahrt] = useState<FahrtResource | null>(null);
  const usercontexte = useContext(UserContext);

  let ende: Date;
  useEffect(() => {
    if (jwt) {
      setJWT(jwt);
    } else {
      navigate("/")
      return;
    }
  }, [jwt]);

  useEffect(() => {
    if (usercontexte && usercontexte.length > 0 && usercontexte[0]) {
      setLoading(false);
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [usercontexte]);

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
    if (usercontexte[0].id && letzteFahrt && timeRecords[timeRecords.length - 1].stop !== null) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte[0].id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        lenkzeit: [{ start: timeRecords[timeRecords.length - 1].start, stop: timeRecords[timeRecords.length - 1].stop! }],
        // arbeitszeit: letzteFahrt.arbeitszeit!.concat(arbeitszeit),
        // pause: letzteFahrt.pause!.concat(pausen),
        beendet: false, // Fahrt als beendet markieren
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt)
    }
  }

  function toggleRecordingLenkzeit() {
    const currentTime = new Date();
    if (!isRecordingLenkzeit) {
      setTimeRecords([...timeRecords, { start: currentTime, stop: null }]);
      setLenkText('Lenkzeit STOP');
      const timerId = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
      setIsRecordingLenkzeit(true);
      setTimerId(timerId);
    } else {
      const lastRecord = timeRecords[timeRecords.length - 1];
      if (lastRecord.stop === null) {
        lastRecord.stop = currentTime;
        setTimeRecords([...timeRecords]);
        setLenkText('Lenkzeit START');
        clearInterval(timerId!);
        handlePost()
      }
    }
    setIsRecordingLenkzeit(!isRecordingLenkzeit);
  }


  function toggleRecordingArbeit() {
    const currentTime = new Date();
    if (!isRecordingArbeitszeit) {
      setTimeRecords([...timeRecords, { start: currentTime, stop: null }]);
      setArbeitText('Arbeitszeit STOP');
      const timerId = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
      setIsRecordingArbeitszeit(true);
      setTimerId(timerId);
    } else {
      const lastRecord = timeRecords[timeRecords.length - 1];
      if (lastRecord.stop === null) {
        lastRecord.stop = currentTime;
        setTimeRecords([...timeRecords]);
        setArbeitText('Arbeitszeit START');
        clearInterval(timerId!);
        handlePost()
      }
    }
    setIsRecordingArbeitszeit(!isRecordingArbeitszeit);
  }



  function toggleRecordingPause() {
    const currentTime = new Date();
    if (!isRecordingPause) {
      setTimeRecords([...timeRecords, { start: currentTime, stop: null }]);
      setPauseText('Pause STOP');
      const timerId = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
      setIsRecordingPause(true);
      setTimerId(timerId);
    } else {
      const lastRecord = timeRecords[timeRecords.length - 1];
      if (lastRecord.stop === null) {
        lastRecord.stop = currentTime;
        setTimeRecords([...timeRecords]);
        setPauseText('Pause START');
        clearInterval(timerId!);
        handlePost()
      }
    }
    setIsRecordingPause(!isRecordingPause);
  }




  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
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
              <div className="section">
                <div className="button-group">
                  <Button variant={isRecordingLenkzeit ? "danger" : "primary"} onClick={toggleRecordingLenkzeit} >{lenktext}</Button>
                </div>
                <div className="elapsed-time">
                  Verbrachte Lenkzeit: {formatTime(elapsedTime)}
                </div>
              </div>
              {timeRecords.map((record, index) => (
                <div key={index}>
                  {record.start.toLocaleString()} - {record.stop ? record.stop.toLocaleString() : "Recording..."}
                </div>
              ))}
              <div className="section">
                <div className="button-group">
                  <Button variant={isRecordingArbeitszeit ? "danger" : "primary"} onClick={toggleRecordingArbeit} >{arbeitText}</Button>
                </div>
                <div className="elapsed-time">
                  Verbrachte Arbeitszeit: {formatTime(elapsedTime)}
                </div>
              </div>
              <div className="section">
                <div className="button-group">
                  <Button variant={isRecordingPause ? "danger" : "primary"} onClick={toggleRecordingPause} >{pauseText}</Button>
                </div>
                <div className="elapsed-time">
                  Verbrachte Pause: {formatTime(elapsedTime)}
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