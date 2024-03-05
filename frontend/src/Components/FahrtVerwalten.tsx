import React, { useContext, useEffect, useState } from 'react';
import './fahrtVerwalten.css';
import { getJWT, getLoginInfo, setJWT } from './Logincontext';
import { getUser, getFahrt, updateFahrt } from '../Api/api';
import { FahrtResource, UserResource } from '../util/Resources';
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
  const [showMoreLenkzeit, setShowMoreLenkzeit] = useState<boolean>(false);
  const [showMoreArbeitszeit, setShowMoreArbeitszeit] = useState<boolean>(false);
  const [showMorePause, setShowMorePause] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(true);
  const [usercontexte, setUser] = useState<UserResource | null>(null)
  const [letzteFahrt, setLetzteFahrt] = useState<FahrtResource | null>(null);
  const navigate = useNavigate();
  const jwt = getJWT();



  useEffect(() => {
    if (letzteFahrt && show) {
      setElapsedTimeLenkzeit(calculateTotalLenkzeitDifference(letzteFahrt.lenkzeit));
      setElapsedTimeArbeitszeit(calculateTotalLenkzeitDifference(letzteFahrt.arbeitszeit));
      setElapsedTimePause(calculateTotalLenkzeitDifference(letzteFahrt.pause));
      setShow(false)
    }
  }, [letzteFahrt])
  
  useEffect(()=>{
    let currentLenkzeit = (calculateTotalLenkzeitDifference(letzteFahrt?.lenkzeit))
    let currentArbeitszeit = (calculateTotalLenkzeitDifference(letzteFahrt?.arbeitszeit))
    let currentPause = (calculateTotalLenkzeitDifference(letzteFahrt?.pause))
  }, [lenktext, pauseText, arbeitText])


  function calculateTotalTime(): number {
    return elapsedTimeLenkzeit + elapsedTimeArbeitszeit + elapsedTimePause;
  }

  useEffect(() => {
    if (jwt) {
      setJWT(jwt);
    } else {
      navigate("/")
      return;
    }
  }, [jwt, navigate]);


  useEffect(() => {
    if (localStorage.getItem("lenkzeit") == "Keine Daten" && lenkzeitRecord?.start && lenkzeitRecord.stop === null) {
      localStorage.setItem("lenkzeit", lenkzeitRecord.start.toString())
    } else {
      localStorage.setItem("lenkzeit", "Keine Daten")
    }
    if (localStorage.getItem("arbeitszeit") == "Keine Daten" && arbeitszeitRecord?.start && arbeitszeitRecord.stop === null) {
      localStorage.setItem("arbeitszeit", arbeitszeitRecord.start.toString())
    } else {
      localStorage.setItem("arbeitszeit", "Keine Daten")
    }
    if (localStorage.getItem("pause") == "Keine Daten" && pauseRecord?.start && pauseRecord.stop === null) {
      localStorage.setItem("pause", pauseRecord?.start.toString() || "Keine Daten")
    } else {
      localStorage.setItem("pause", "Keine Daten")

    }

  }, [arbeitszeitRecord, lenkzeitRecord, pauseRecord])

  useEffect(() => {
    if (usercontexte) {
      setLoading(false);
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      stopRunningTimer()
      e.returnValue = '';
    };


    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [usercontexte]);

  async function last() {
      const id = getLoginInfo()
      const user = await getUser(id!.userID)
      setUser(user)
      setLoading(false)
      const x: FahrtResource[] = await getFahrt(id!.userID);
      setLetzteFahrt(x[x.length - 1]);
  }

  useEffect(() => { last() }, []);
  useEffect(() => {}, []);


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
        localStorage.setItem("lenkzeit", "Keine Daten")
        handlePostLenkzeit();
      }
      setIsRecordingLenkzeit(false);
    }
    else if (isRecordingArbeitszeit) {
      const lastRecord = arbeitszeitRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = new Date();
        setArbeitszeitRecord(lastRecord);
        localStorage.setItem("arbeitszeit", "Keine Daten")
        setArbeitText('Arbeitszeit START');
        handlePostArbeitszeit();
      }
      setIsRecordingArbeitszeit(false);
    }
    else if (isRecordingPause) {
      const lastRecord = pauseRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = new Date();
        setPauseRecord(lastRecord);
        localStorage.setItem("pause", "Keine Daten")
        setPauseText('Pause START');
        handlePostPause();
      }
      setIsRecordingPause(false);
    }

  }


  async function handlePostArbeitszeit() {
    if (usercontexte && letzteFahrt && arbeitszeitRecord && arbeitszeitRecord.stop !== null) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
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
    if (usercontexte && letzteFahrt && pauseRecord && pauseRecord.stop !== null) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        pause: [{ start: pauseRecord.start, stop: pauseRecord.stop! }],
        beendet: false, 
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
    }
  }

  async function handlePostLenkzeit() {
    if (usercontexte && letzteFahrt && lenkzeitRecord && lenkzeitRecord.stop !== null) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        lenkzeit: [{ start: lenkzeitRecord.start, stop: lenkzeitRecord.stop! }],
        beendet: false,
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
    }
  }

  async function handleEndePost() {
    if (usercontexte && letzteFahrt) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        lenkzeit: lenkzeitRecord ? [{ start: lenkzeitRecord.start, stop: lenkzeitRecord.stop! }] : [],
        pause: pauseRecord ? [{ start: pauseRecord.start, stop: pauseRecord.stop! }] : [],
        arbeitszeit: arbeitszeitRecord ? [{ start: arbeitszeitRecord.start, stop: arbeitszeitRecord.stop! }] : [],
        beendet: true,
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
        handlePostArbeitszeit()
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
        handlePostPause()
      }
    }
    setIsRecordingPause(!isRecordingPause);
  }

  function calculateTotalLenkzeitDifference(lenkzeitRecords: TimeRecord[] | undefined): number {
    if (!lenkzeitRecords) return 0;

    let totalDifference = 0;

    lenkzeitRecords.forEach((record) => {
      if (record.stop) {
        const differenceInSeconds = Math.floor(Math.abs(new Date(record.stop).getTime() - new Date(record.start).getTime()) / 1000);
        totalDifference += differenceInSeconds;
      }
    });

    return totalDifference;
  }



  function formatTime(seconds: number): string {
    let hours = Math.floor(seconds / 3600);
    hours = Math.floor(hours / 1000)
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  }

  async function handleEnde() {
    const confirmEnde = window.confirm("Wollen Sie wirklich die Fahrt beenden?");
    if (confirmEnde) {
      stopRunningTimer()
      await handleEndePost()
    } else {
      return;
    }
  }

  function formatDate(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <div>
      <h1 className="header">Fahrt Verwalten</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="container">
          <h3>Hallo {usercontexte && usercontexte.name ? usercontexte.name : <Loading></Loading>}.</h3>
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

                {letzteFahrt.lenkzeit && letzteFahrt.lenkzeit?.length > 0 && (
                  <div className="dates">
                    {letzteFahrt.lenkzeit.slice().reverse().map((Zeiten, index) => {
                      return <p key={index}>Start: {formatDate(new Date(Zeiten.start))} Uhr , Stop: {formatDate(new Date(Zeiten.stop))} Uhr.</p>
                    })}
                  </div>
                )}
              </div>
              <div className="section">
                <div className="button-group">
                  <Button variant={isRecordingArbeitszeit ? "danger" : "primary"} onClick={toggleRecordingArbeit} >{arbeitText}</Button>
                </div>
                <div className="elapsed-time">
                  Verbrachte Arbeitszeit: {formatTime(elapsedTimeArbeitszeit)}
                </div>
                {letzteFahrt.arbeitszeit && letzteFahrt.arbeitszeit.length > 0 && (
                  <div className="dates">
                    {letzteFahrt.arbeitszeit.slice().reverse().map((Zeiten, index) => {
                      return <p key={index}>Start: {formatDate(new Date(Zeiten.start))} Uhr , Stop: {formatDate(new Date(Zeiten.stop))} Uhr.</p>
                    })}
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
                {letzteFahrt.pause && letzteFahrt.pause.length > 0 && (
                  <div className="dates">
                    {letzteFahrt.pause.slice().reverse().map((Zeiten, index) => {
                      return <p key={index}>Start: {formatDate(new Date(Zeiten.start))} Uhr , Stop: {formatDate(new Date(Zeiten.stop))} Uhr.</p>
                    })}
                  </div>
                )}
              </div>
              <div className="section">
                <div className="button-group">
                  <Button variant="danger" onClick={() => { handleEnde() }} >Fahrt beenden</Button>
                </div>
                <div>
                  Gesamt Lenkzeit: {formatTime(elapsedTimeLenkzeit)} <br />
                  Gesamt Arbeitszeit: {formatTime(elapsedTimeArbeitszeit)} <br />
                  Gesamt Pause: {formatTime(elapsedTimePause)} <br />
                  Ruhezeit:{formatTime(86400000 - calculateTotalTime())} <br />
                  Insgesamte Zeit ist: {formatTime((elapsedTimeLenkzeit + elapsedTimeArbeitszeit + elapsedTimePause))}
                </div>

              </div>
            </>
          ) : (
            <>
              <p>Erstellen Sie eine Fahrt, um diese zu verwalten.</p>
              <Link to="/create">
                <Button>Fahrt Erstellen</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FahrtVerwalten;
