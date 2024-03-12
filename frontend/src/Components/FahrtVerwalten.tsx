import React, { useEffect, useState } from 'react';
import './fahrtVerwalten.css';
import { getJWT, getLoginInfo, setJWT } from './Logincontext';
import { getUser, getFahrt, updateFahrt } from '../Api/api';
import { FahrtResource, UserResource } from '../util/Resources';
import Loading from './LoadingIndicator';
import { UserContext } from './UserContext';
import { Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

interface TimeRecord {
  start: Date;
  stop: Date | null;
}

const FahrtVerwalten: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isRecordingLenkzeit, setIsRecordingLenkzeit] = useState<boolean>(true);
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
  const [usercontexte, setUser] = useState<UserResource | null>(null)
  const [letzteFahrt, setLetzteFahrt] = useState<FahrtResource | null>(null);
  const navigate = useNavigate();
  const [count, setCounter] = useState(0)
  const jwt = getJWT();



  const isLastFahrtBeendet = () => {
    return letzteFahrt && letzteFahrt.beendet === true;
  };

  // Initialisierung für das Erstellen des Local Storage, falls nicht vorhanden
  // useEffect(() => {
  //   if (letzteFahrt) {
  //     const storageKeys = ["elapsedTimeLenkzeit", "elapsedTimeArbeitszeit", "elapsedTimePause", "isLenkzeit", "isArbeitszeit", "isPause"];
  //     const storageExists = storageKeys.every(key => localStorage.getItem(key));
  //     // Wenn die Storages noch nicht erstellt wurden, erstelle sie
  //     if (!storageExists) {
  //       console.log("dsss")
  //       const storageItems = [
  //         { key: "elapsedTimeLenkzeit", value: elapsedTimeLenkzeit },
  //         { key: "elapsedTimeArbeitszeit", value: elapsedTimeArbeitszeit },
  //         { key: "elapsedTimePause", value: elapsedTimePause },
  //         { key: "isLenkzeit", value: true },
  //         { key: "isArbeitszeit", value: false },
  //         { key: "isPause", value: false }
  //       ];

  //       storageItems.forEach(item => {
  //         console.log("key, " + item.key + "value," + item.value)
  //         localStorage.setItem(item.key, JSON.stringify(item.value));
  //       });
  //     }
  //   }
  // }, []);

  // Schaue ob die Seite erneut betreten wurde und entnehme dann die Daten aus dem Storage
  useEffect(() => {
    if (elapsedTimeLenkzeit === 0 && !letzteFahrt?.beendet) {
      const storedElapsedTimeLenkzeit = localStorage.getItem("elapsedTimeLenkzeit");
      const storedElapsedArbeitszeit = localStorage.getItem("elapsedTimeArbeitszeit");
      const storedElapsedPause = localStorage.getItem("elapsedTimePause");
      const storedisTimeLenkzeit = localStorage.getItem("isLenkzeit");
      const storedisArbeitszeit = localStorage.getItem("isArbeitszeit");
      const storedisPause = localStorage.getItem("isPause");
      if (storedElapsedTimeLenkzeit) {
        setElapsedTimeLenkzeit(Number(storedElapsedTimeLenkzeit));
        setElapsedTimePause(Number(storedElapsedPause))
        setElapsedTimeArbeitszeit(Number(storedElapsedArbeitszeit));
        console.log(storedisTimeLenkzeit)
        if (storedisTimeLenkzeit === "true") {
          setIsRecordingLenkzeit(true)
          setIsRecordingPause(false)
          setIsRecordingArbeitszeit(false)
          toggleRecordingLenkzeit()
        } else if(storedisArbeitszeit === "true") {
          setIsRecordingArbeitszeit(true)
          setIsRecordingLenkzeit(false)
          setIsRecordingPause(false)
          toggleRecordingArbeit()
        } else if(storedisPause === "true")  {
          setIsRecordingPause(true)
          setIsRecordingArbeitszeit(false)
          setIsRecordingLenkzeit(false)
          toggleRecordingPause()
        }
      }
    }
  }, [elapsedTimeLenkzeit]); // Nur wenn elapsedTimeLenkzeit sich ändert


  useEffect(() => {
    const storageItems = [
      { key: "elapsedTimeLenkzeit", value: elapsedTimeLenkzeit },
      { key: "elapsedTimeArbeitszeit", value: elapsedTimeArbeitszeit },
      { key: "elapsedTimePause", value: elapsedTimePause },
      { key: "isLenkzeit", value: isRecordingLenkzeit },
      { key: "isArbeitszeit", value: isRecordingArbeitszeit },
      { key: "isPause", value: isRecordingPause }
    ];

    storageItems.forEach(item => {
      localStorage.setItem(item.key, JSON.stringify(item.value));
    });

  }, [elapsedTimeArbeitszeit, elapsedTimeLenkzeit, elapsedTimePause, isRecordingArbeitszeit, isRecordingLenkzeit, isRecordingPause])

  useEffect(() => {
    if (jwt) {
      setJWT(jwt);
    } else {
      navigate("/")
      return;
    }
  }, [jwt, navigate]);

  useEffect(() => {
    return () => {
      stopRunningTimer();
    };
  }, []);

  async function last() {
    if (usercontexte && usercontexte.id) {
      const x: FahrtResource[] = await getFahrt(usercontexte.id);
      if (x.length === 0 || x[x.length - 1].beendet) {
        setLoading(false)
        return;
      }
      setLetzteFahrt(x[x.length - 1]);
    } else {
      const id = getLoginInfo()
      const user = await getUser(id!.userID)
      setUser(user)
      const x: FahrtResource[] = await getFahrt(id!.userID);
      if (x.length === 0 || x[x.length - 1].beendet) {
        setLoading(false)
        return;
      }

      //
      let currentfahrt = x[x.length - 1]
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const fahrtResource: FahrtResource = {
        fahrerid: user.id!,
        id: currentfahrt._id!.toString(),
        _id: currentfahrt._id!.toString(),
        kennzeichen: currentfahrt.kennzeichen.toString(),
        kilometerstand: currentfahrt.kilometerstand,
        startpunkt: currentfahrt.startpunkt.toString(),
        ruhezeit: [{ start: today, stop: currentfahrt.createdAt! }],
        beendet: false,
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
      setLoading(false)
      setCounter(count => count + 1);

    }
  }

  useEffect(() => { last() }, [count]);

  function stopRunningTimer() {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    if (isRecordingLenkzeit) {
      console.log(lenkzeitRecord)
      const lastRecord = lenkzeitRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = moment().toDate();
        setLenkzeitRecord(lastRecord);
        setLenkText('Lenkzeit START');
        console.log(":o")
        handlePostLenkzeit();
      }
      console.log(":D")
      setIsRecordingLenkzeit(false);
    }
    else if (isRecordingArbeitszeit) {
      const lastRecord = arbeitszeitRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = moment().toDate();
        setArbeitszeitRecord(lastRecord);
        setArbeitText('Arbeitszeit START');
        handlePostArbeitszeit();
      }
      setIsRecordingArbeitszeit(false);
    }
    else if (isRecordingPause) {
      const lastRecord = pauseRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = moment().toDate();
        setPauseRecord(lastRecord);
        setPauseText('Pause START');
        handlePostPause();
      }
      setIsRecordingPause(false);
    }
    console.log(":D")
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
      setCounter(count => count + 1);
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
      setCounter(count => count + 1);
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
        lenkzeit: lenkzeitRecord ? [{ start: lenkzeitRecord.start, stop: lenkzeitRecord.stop! }] : [],
        beendet: false,
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
      setCounter(count => count + 1);
    }
  }

  async function handleEndePost() {
    if (usercontexte && letzteFahrt) {
      const today = new Date();
      today.setHours(23, 59, 59, 0);

      // Aktualisiere die Fahrt
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        ruhezeit: [{ start: new Date(Date.now()), stop: today }],
        beendet: true,
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
      setCounter(count => count + 1);

      // Entferne alle Einträge aus dem Local Storage außer dem JWT
      Object.keys(localStorage).forEach(key => {
        if (key !== 'jwt') {
          localStorage.removeItem(key);
        }
      });
    }
  }

  function toggleRecordingLenkzeit() {

    // if (isRecordingLenkzeit) {
    //   console.log("=?")
    //   return;
    // }
    if (isLastFahrtBeendet()) {
      console.log("x?")
      return;
    }
    stopRunningTimer();
    const currentTime = moment().toDate();
    if (!isRecordingLenkzeit) {
      console.log(";p")
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

    if (isRecordingArbeitszeit) {
      return;
    }
    stopRunningTimer();
    const currentTime = moment().toDate();
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
    if (isRecordingPause) {
      return;
    }
    stopRunningTimer();
    const currentTime = moment().toDate();
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
          <h3>Hallo, {usercontexte ? usercontexte.name : ""}.</h3>
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
                  {/* Ruhezeit: Stop - {formattedStartTime}<br /> */}
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