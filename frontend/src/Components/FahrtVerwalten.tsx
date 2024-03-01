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
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [isRecordingLenkzeit, setIsRecordingLenkzeit] = useState<boolean>(false);
  const [isRecordingArbeitszeit, setIsRecordingArbeitszeit] = useState<boolean>(false);
  const [isRecordingPause, setIsRecordingPause] = useState<boolean>(false);
  const [lenktext, setLenkText] = useState<string>('Lenkzeit START');
  const [arbeitText, setArbeitText] = useState<string>('Arbeitszeit START');
  const [pauseText, setPauseText] = useState<string>('Pause START');
  const [elapsedTimeLenkzeit, setElapsedTimeLenkzeit] = useState<number>(0);
  const [elapsedTimeArbeitszeit, setElapsedTimeArbeitszeit] = useState<number>(0);
  const [elapsedTimePause, setElapsedTimePause] = useState<number>(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [lenkzeitRecord, setLenkzeitRecord] = useState<TimeRecord | null>(null);
  const [arbeitszeitRecord, setArbeitszeitRecord] = useState<TimeRecord | null>(null);
  const [pauseRecord, setPauseRecord] = useState<TimeRecord | null>(null);
  const navigate = useNavigate();

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
  }, [jwt, navigate]);

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


  function stopRunningTimer() {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    if (isRecordingLenkzeit) {
      const lastRecord = lenkzeitRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = new Date();
        setLenkzeitRecord(lastRecord);
        setLenkText('Lenkzeit START');
        handlePostLenkzeit();
      }
      setIsRecordingLenkzeit(false);
    }
    if (isRecordingArbeitszeit) {
      const lastRecord = arbeitszeitRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = new Date();
        setArbeitszeitRecord(lastRecord);
        setArbeitText('Arbeitszeit START');
        handlePostArbeitszeit();
      }
      setIsRecordingArbeitszeit(false);
    }
    if (isRecordingPause) {
      const lastRecord = pauseRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = new Date();
        setPauseRecord(lastRecord);
        setPauseText('Pause START');
        handlePostPause();
      }
      setIsRecordingPause(false);
    }
  }

  async function handlePostArbeitszeit() {
    if (usercontexte[0].id && letzteFahrt && arbeitszeitRecord && arbeitszeitRecord.stop !== null) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte[0].id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        arbeitszeit: [{ start: arbeitszeitRecord.start, stop: arbeitszeitRecord.stop! }],
        beendet: false,
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
    }
  }

  async function handlePostPause() {
    if (usercontexte[0].id && letzteFahrt && pauseRecord && pauseRecord.stop !== null) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte[0].id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        pause: [{ start: pauseRecord.start, stop: pauseRecord.stop! }],
        beendet: false, // Fahrt als beendet markieren
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
    }
  }

  async function handlePostLenkzeit() {
    if (usercontexte[0].id && letzteFahrt && lenkzeitRecord && lenkzeitRecord.stop !== null) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte[0].id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        lenkzeit: [{ start: lenkzeitRecord.start, stop: lenkzeitRecord.stop! }],
        // arbeitszeit: letzteFahrt.arbeitszeit!.concat(arbeitszeit),
        // pause: letzteFahrt.pause!.concat(pausen),
        beendet: false, // Fahrt als beendet markieren
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
    }
  }

  function toggleRecordingLenkzeit() {
    stopRunningTimer();
    const currentTime = new Date();
    if (!isRecordingLenkzeit) {
      setLenkzeitRecord({ start: currentTime, stop: null });
      setLenkText('Lenkzeit STOP');
      const timerId = setInterval(() => {
        setElapsedTimeLenkzeit(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
      setIsRecordingLenkzeit(true);
      setTimerId(timerId);
    } else {
      const lastRecord = lenkzeitRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = currentTime;
        setLenkzeitRecord(lastRecord);
        setLenkText('Lenkzeit START');
        clearInterval(timerId!);
        handlePostLenkzeit()
      }
    }
    setIsRecordingLenkzeit(!isRecordingLenkzeit);
  }

  function toggleRecordingArbeit() {
    stopRunningTimer();
    const currentTime = new Date();
    if (!isRecordingArbeitszeit) {
      setArbeitszeitRecord({ start: currentTime, stop: null });
      setArbeitText('Arbeitszeit STOP');
      const timerId = setInterval(() => {
        setElapsedTimeArbeitszeit(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
      setIsRecordingArbeitszeit(true);
      setTimerId(timerId);
    } else {
      const lastRecord = arbeitszeitRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = currentTime;
        setArbeitszeitRecord(lastRecord);
        setArbeitText('Arbeitszeit START');
        clearInterval(timerId!);
        handlePostLenkzeit()
      }
    }
    setIsRecordingArbeitszeit(!isRecordingArbeitszeit);
  }

  function toggleRecordingPause() {
    stopRunningTimer();
    const currentTime = new Date();
    if (!isRecordingPause) {
      setPauseRecord({ start: currentTime, stop: null });
      setPauseText('Pause STOP');
      const timerId = setInterval(() => {
        setElapsedTimePause(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
      setIsRecordingPause(true);
      setTimerId(timerId);
    } else {
      const lastRecord = pauseRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = currentTime;
        setPauseRecord(lastRecord);
        setPauseText('Pause START');
        clearInterval(timerId!);
        handlePostLenkzeit()
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
                  Verbrachte Lenkzeit: {formatTime(elapsedTimeLenkzeit)}
                </div>
              </div>
              {lenkzeitRecord && (
                <div>
                  {lenkzeitRecord.start.toLocaleString()} - {lenkzeitRecord.stop ? lenkzeitRecord.stop.toLocaleString() : "Recording..."}
                </div>
              )}

              <div className="section">
                <div className="button-group">
                  <Button variant={isRecordingArbeitszeit ? "danger" : "primary"} onClick={toggleRecordingArbeit} >{arbeitText}</Button>
                </div>
                <div className="elapsed-time">
                  Verbrachte Arbeitszeit: {formatTime(elapsedTimeArbeitszeit)}
                </div>
                {arbeitszeitRecord && (
                  <div>
                    {arbeitszeitRecord.start.toLocaleString()} - {arbeitszeitRecord.stop ? arbeitszeitRecord.stop.toLocaleString() : "Recording..."}
                  </div>
                )}
              </div>
              <div className="section">
                <div className="button-group">
                  <Button variant={isRecordingPause ? "danger" : "primary"} onClick={toggleRecordingPause} >{pauseText}</Button>
                </div>
                <div className="elapsed-time">
                  Verbrachte Pause: {formatTime(elapsedTimePause)}
                </div>
                {pauseRecord && (
                  <div>
                    {pauseRecord.start.toLocaleString()} - {pauseRecord.stop ? pauseRecord.stop.toLocaleString() : "Recording..."}
                  </div>
                )}
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
