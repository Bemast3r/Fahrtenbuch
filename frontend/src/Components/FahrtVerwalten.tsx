import React, { useEffect, useState } from 'react';
import './fahrtVerwalten.css';
import { getJWT, getLoginInfo, setJWT } from './Logincontext';
import { getUser, getFahrt, updateFahrt } from '../Api/api';
import { FahrtResource, UserResource } from '../util/Resources';
import Loading from './LoadingIndicator';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Navbar from './Navbar';

interface TimeRecord {
  start: Date;
  stop: Date | null;
}

const FahrtVerwalten: React.FC = () => {
  const [showEndModal, setShowEndModal] = useState(false);
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
  const [usercontexte, setUser] = useState<UserResource | null>(null)
  const [letzteFahrt, setLetzteFahrt] = useState<FahrtResource | null>(null);
  const [disable, setDisable] = useState<boolean>(true);
  const [missingTime, setMissingTime] = useState<number>(0)

  const navigate = useNavigate();
  const [count, setCounter] = useState(0)

  const [missedTime, setMissedtime] = useState<number>(0)
  const [validated, setValidated] = useState<boolean>(false);
  const [kilometerEnde, setKilometerstandEnde] = useState<number>(0);
  const [ortFahrtbeendigung, setOrtFahrtbeendigung] = useState<string>('');

  const handleOpenModal = () => setShowEndModal(true);
  const handleCloseModal = () => setShowEndModal(false);

  const jwt = getJWT();

  useEffect(() => { last() }, [count]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (!letzteFahrt) {
        last();
      } else {
        setDisable(true)
        const x = addmissingTime(
          elapsedTimeLenkzeit,
          elapsedTimeArbeitszeit,
          elapsedTimePause,
          letzteFahrt
        );
        setMissingTime(x)
        if (x === 0 || x < 0) {
          setDisable(false)
          return;
        }

        if (isRecordingLenkzeit) {
          setElapsedTimeLenkzeit(prevElapsedTime => prevElapsedTime + x);
          setDisable(false)
          return;
        }
        if (isRecordingArbeitszeit) {
          setElapsedTimeArbeitszeit(prevElapsedTime => prevElapsedTime + x);
          setDisable(false)
          return;
        }
        if (isRecordingPause) {
          setElapsedTimePause(prevElapsedTime => prevElapsedTime + x);
          setDisable(false)
          return;
        }
      }
    }, 1000); // Timer alle 60 Sekunden ausführen

    return () => clearInterval(timerInterval); // Aufräumen: Timer bei Komponentenunmontage löschen
  }, [elapsedTimeArbeitszeit, elapsedTimeLenkzeit, elapsedTimePause, isRecordingArbeitszeit, isRecordingLenkzeit, isRecordingPause, letzteFahrt]);

  // Schaue ob die Seite erneut betreten wurde und entnehme dann die Daten aus dem Storage
  useEffect(() => {
    setDisable(true)
    // Beim ersten Betreten
    if (elapsedTimeLenkzeit === 0 && !letzteFahrt?.beendet) {
      const storedElapsedTimeLenkzeit = localStorage.getItem("elapsedTimeLenkzeit");
      const storedElapsedArbeitszeit = localStorage.getItem("elapsedTimeArbeitszeit");
      const storedElapsedPause = localStorage.getItem("elapsedTimePause");
      const storedisTimeLenkzeit = localStorage.getItem("isLenkzeit");
      const storedisArbeitszeit = localStorage.getItem("isArbeitszeit");
      const storedisPause = localStorage.getItem("isPause");

      setElapsedTimeLenkzeit(Number(storedElapsedTimeLenkzeit));
      setElapsedTimePause(Number(storedElapsedPause))
      setElapsedTimeArbeitszeit(Number(storedElapsedArbeitszeit));

      if (storedisTimeLenkzeit === "true") {
        setIsRecordingLenkzeit(true)
        setIsRecordingPause(false)
        setIsRecordingArbeitszeit(false)
        toggleRecordingLenkzeit()
        setDisable(false)
        return;

      } else if (storedisArbeitszeit === "true") {
        setIsRecordingArbeitszeit(true)
        setIsRecordingLenkzeit(false)
        setIsRecordingPause(false)
        toggleRecordingArbeit()
        setDisable(false)
        return;

      } else if (storedisPause === "true") {
        setIsRecordingPause(true)
        setIsRecordingArbeitszeit(false)
        setIsRecordingLenkzeit(false)
        toggleRecordingPause()
        setDisable(false)
        return;

      } else if (storedisPause === "false" && storedisArbeitszeit === "false" && storedisTimeLenkzeit === "false") {
        setIsRecordingLenkzeit(true)
        setIsRecordingPause(false)
        setIsRecordingArbeitszeit(false)
        toggleRecordingLenkzeit()
        setDisable(false)
        return;
      } else {
        setIsRecordingLenkzeit(true)
        setIsRecordingPause(false)
        setIsRecordingArbeitszeit(false)
        toggleRecordingLenkzeit()
        setDisable(false)
        return;

      }

    }
  }, [isRecordingArbeitszeit, isRecordingLenkzeit, isRecordingPause, letzteFahrt]);


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

  async function last() {
    if (usercontexte && usercontexte.id) {
      // if (letzteFahrt) {
      //   return;
      // }
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


      const fahrtResource: FahrtResource = {
        fahrerid: user.id!,
        id: currentfahrt._id!.toString(),
        _id: currentfahrt._id!.toString(),
        kennzeichen: currentfahrt.kennzeichen.toString(),
        kilometerstand: currentfahrt.kilometerstand,
        startpunkt: currentfahrt.startpunkt.toString(),
        beendet: false,
        vollname: user.vorname + " " + user.name
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
      setLoading(false)
    }
  }

  function addmissingTime(lenkzeit: number, pause: number, arbeitszeit: number, letzteFahrt: FahrtResource): number {

    const createdAt = letzteFahrt ? new Date(letzteFahrt.createdAt!).getTime() : 0; // Zeitstempel der letzten Fahrt
    const gesamtzeit = createdAt + (lenkzeit + pause + arbeitszeit) * 1000; // Gesamtzeit in Millisekunden
    const now = Date.now(); // Aktueller Zeitstempel in Millisekunden
    const diffInSeconds = Math.round((now - gesamtzeit) / 1000); // Differenz in Sekunden, gerundet
    return diffInSeconds;
  }



  async function stopRunningTimer() {

    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    if (isRecordingLenkzeit) {
      const lastRecord = lenkzeitRecord;
      if (lastRecord && lastRecord.stop === null) {
        // lastRecord.start = new Date(Date.now() - missedTime)
        lastRecord.stop = moment().toDate();
        setLenkzeitRecord(lastRecord);
        setLenkText('Lenkzeit START');
        await handlePostLenkzeit();
      }
      setIsRecordingLenkzeit(false);
    }
    else if (isRecordingArbeitszeit) {
      const lastRecord = arbeitszeitRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = moment().toDate();
        setArbeitszeitRecord(lastRecord);
        setArbeitText('Arbeitszeit START');
        await handlePostArbeitszeit();
      }
      setIsRecordingArbeitszeit(false);
    }
    else if (isRecordingPause) {
      const lastRecord = pauseRecord;
      if (lastRecord && lastRecord.stop === null) {
        lastRecord.stop = moment().toDate();
        setPauseRecord(lastRecord);
        setPauseText('Pause START');
        await handlePostPause();
      }
      setIsRecordingPause(false);
    }
  }

  async function handlePostArbeitszeit() {
    if (usercontexte && letzteFahrt && arbeitszeitRecord && arbeitszeitRecord.stop !== null) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
        id: letzteFahrt._id!.toString(),
        vollname: usercontexte.vorname + " " + usercontexte.name,
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        arbeitszeit: [{ start: new Date(new Date(arbeitszeitRecord.start).getTime() - (missingTime * 1000)), stop: arbeitszeitRecord.stop! }],
        // arbeitszeit: [{ start: new Date(JSON.parse(localStorage.getItem("starter")!)), stop: arbeitszeitRecord.stop! }],
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
        vollname: usercontexte.vorname + " " + usercontexte.name,
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        pause: [{ start: new Date(new Date(pauseRecord.start).getTime() - (missingTime * 1000)), stop: pauseRecord.stop! }],
        // pause: [{ start: new Date(JSON.parse(localStorage.getItem("starter")!)), stop: pauseRecord.stop! }],
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
        vollname: usercontexte.vorname + " " + usercontexte.name,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        lenkzeit: lenkzeitRecord ? [{ start: new Date(new Date(lenkzeitRecord.start).getTime() - (missingTime * 1000)), stop: lenkzeitRecord.stop! }] : [],
        // lenkzeit: lenkzeitRecord ? [{ start: new Date(JSON.parse(localStorage.getItem("starter")!)), stop: lenkzeitRecord.stop! }] : [],
        beendet: false,
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
      setCounter(count => count + 1);
    }
  }

  async function handleEndePost(formData: any) {
    if (usercontexte && letzteFahrt) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 0);
      const dayinMillis = 24 * (3600 * 1000) / 1000;
      const totalRuhezeit = ((elapsedTimeArbeitszeit + elapsedTimePause + elapsedTimeLenkzeit) - dayinMillis) * -1;

      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        ruhezeit: [
          { start: today, stop: letzteFahrt.createdAt! },
          { start: new Date(Date.now()), stop: end }],
        totalLenkzeit: elapsedTimeLenkzeit,
        totalArbeitszeit: elapsedTimeArbeitszeit,
        totalPause: elapsedTimePause,
        totalRuhezeit: totalRuhezeit,
        vollname: usercontexte.vorname + " " + usercontexte.name,
        beendet: true,
        // MODAL
        kilometerende: formData.KilometerstandEnde,
        endpunkt: formData.OrtFahrtbeendigung
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
      setCounter(count => count + 1);
    }
  }

  async function toggleRecordingLenkzeit() {

    if (isRecordingLenkzeit) {
      return;
    }
    await stopRunningTimer();
    const currentTime = moment().toDate();
    if (!isRecordingLenkzeit) {
      localStorage.setItem("starter", JSON.stringify(Date.now()));
      console.log(Date.now)
      if (missingTime > 0) {
        setLenkzeitRecord({ start: new Date(new Date(currentTime).getTime() - (missingTime * 1000)), stop: null });
      } else {
        setLenkzeitRecord({ start: currentTime, stop: null });
      }
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
        await handlePostLenkzeit()
      }
    }
    setIsRecordingLenkzeit(!isRecordingLenkzeit);
  }

  async function toggleRecordingArbeit() {

    if (isRecordingArbeitszeit) {
      return;
    }
    await stopRunningTimer();
    const currentTime = moment().toDate();
    if (!isRecordingArbeitszeit) {
      localStorage.setItem("starter", JSON.stringify(Date.now()));
      if (missingTime > 0) {
        setArbeitszeitRecord({ start: new Date(new Date(currentTime).getTime() - (missingTime * 1000)), stop: null });
      } else {
        setArbeitszeitRecord({ start: currentTime, stop: null });
      }
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
        await handlePostArbeitszeit()
      }
    }
    setIsRecordingArbeitszeit(!isRecordingArbeitszeit);
  }

  async function toggleRecordingPause() {
    if (isRecordingPause) {
      return;
    }
    await stopRunningTimer();
    const currentTime = moment().toDate();
    if (!isRecordingPause) {
      localStorage.setItem("starter", JSON.stringify(Date.now()));
      if (missingTime > 0) {
        setPauseRecord({ start: new Date(new Date(currentTime).getTime() - (missingTime * 1000)), stop: null });
      } else {
        setPauseRecord({ start: currentTime, stop: null });
      }
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
        await handlePostPause()
      }
    }
    setIsRecordingPause(!isRecordingPause);
  }


  function formatTime(seconds: number): string {
    let hours = Math.floor(seconds / 3600);
    hours = Math.floor(hours / 1000)
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  }

  async function handleEnde() {
    const form = document.getElementById('endModalForm') as HTMLFormElement;

    if (form.checkValidity() === false) {
      form.reportValidity();
      return;
    }

    const formData = { KilometerstandEnde: kilometerEnde, OrtFahrtbeendigung: ortFahrtbeendigung };
    await stopRunningTimer()
    await handleEndePost(formData);
    navigate("/");
  }


  function formatDate(date: Date): string {
    const hours = new Date(date).getHours().toString().padStart(2, '0');
    const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
    const seconds = new Date(date).getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  return (
    <>
      <Navbar></Navbar>
      <div>
        <br></br>
        <br></br>
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1 className="header">Fahrt verwalten</h1>
        {loading ? (
          <Loading />
        ) : (
          <div className="container">
            <h3>Hallo, {usercontexte ? usercontexte.name : ""}.</h3>
            {letzteFahrt && !letzteFahrt.beendet ? (
              <>
                {/* {<iframe style={{ border: "border-radius:12px" }} src="https://open.spotify.com/embed/track/5GXeNbxOEbd7sKrbsVLVVx?utm_source=generator" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>} */}
                <p>
                  Ihre momentane Fahrt startete am{' '}
                  {letzteFahrt ? new Date(letzteFahrt.createdAt!).toLocaleDateString('de-DE') + ' um ' + new Date(letzteFahrt.createdAt!).toLocaleTimeString('de-DE') : 'Keine Fahrt'}, mit dem Kennzeichen{' '}
                  {letzteFahrt ? letzteFahrt.kennzeichen : 'Kein Kennzeichen'}.{' '}
                </p>
                <p>Ihr Startpunkt ist {letzteFahrt ? letzteFahrt?.startpunkt : 'Kein Startpunkt'}.</p>
                <div className="section">
                  <div className="button-group">
                    <Button variant={isRecordingLenkzeit ? 'danger' : 'primary'} disabled={disable} onClick={toggleRecordingLenkzeit}>
                      {lenktext}
                    </Button>
                  </div>
                  <div className="elapsed-time">Verbrachte Lenkzeit: {formatTime(elapsedTimeLenkzeit)}</div>
                  {letzteFahrt.lenkzeit && letzteFahrt.lenkzeit?.length > 0 && (
                    <div className="dates">
                      {letzteFahrt.lenkzeit
                        .slice()
                        .reverse()
                        .map((Zeiten, index) => {
                          return (
                            <p key={index}>
                              Start: {formatDate(new Date(Zeiten.start))} Uhr , Stop: {formatDate(new Date(Zeiten.stop))} Uhr.
                            </p>
                          );
                        })}
                    </div>
                  )}
                </div>
                <div className="section">
                  <div className="button-group">
                    <Button variant={isRecordingArbeitszeit ? 'danger' : 'primary'} disabled={disable} onClick={toggleRecordingArbeit}>
                      {arbeitText}
                    </Button>
                  </div>
                  <div className="elapsed-time">Verbrachte Arbeitszeit: {formatTime(elapsedTimeArbeitszeit)}</div>
                  {letzteFahrt.arbeitszeit && letzteFahrt.arbeitszeit.length > 0 && (
                    <div className="dates">
                      {letzteFahrt.arbeitszeit
                        .slice()
                        .reverse()
                        .map((Zeiten, index) => {
                          return (
                            <p key={index}>
                              Start: {formatDate(new Date(Zeiten.start))} Uhr , Stop: {formatDate(new Date(Zeiten.stop))} Uhr.
                            </p>
                          );
                        })}
                    </div>
                  )}
                </div>
                <div className="section">
                  <div className="button-group">
                    <Button variant={isRecordingPause ? 'danger' : 'primary'} disabled={disable} onClick={toggleRecordingPause}>
                      {pauseText}
                    </Button>
                  </div>
                  <div className="elapsed-time">Verbrachte Pause: {formatTime(elapsedTimePause)}</div>
                  {letzteFahrt.pause && letzteFahrt.pause.length > 0 && (
                    <div className="dates">
                      {letzteFahrt.pause
                        .slice()
                        .reverse()
                        .map((Zeiten, index) => {
                          return (
                            <p key={index}>
                              Start: {formatDate(new Date(Zeiten.start))} Uhr , Stop: {formatDate(new Date(Zeiten.stop))} Uhr.
                            </p>
                          );
                        })}
                    </div>
                  )}
                </div>
                <div className="section">
                  <div className="button-group">
                    <Button variant="danger" disabled={disable} onClick={handleOpenModal}>
                      Fahrt beenden
                    </Button>
                  </div>
                  <div>
                    Gesamt Lenkzeit: {formatTime(elapsedTimeLenkzeit)} <br />
                    Gesamt Arbeitszeit: {formatTime(elapsedTimeArbeitszeit)} <br />
                    Gesamt Pause: {formatTime(elapsedTimePause)}
                    {letzteFahrt.createdAt && (
                      <div>Verbrachte Ruhezeit: {formatDate(letzteFahrt.createdAt)}</div>
                    )}
                    Insgesamte Zeit ist: {formatTime(elapsedTimeLenkzeit + elapsedTimeArbeitszeit + elapsedTimePause)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <p>Erstellen Sie eine Fahrt, um diese zu verwalten.</p>
                <Link to="/create">
                  <Button className="erstellen">Fahrt erstellen</Button>
                </Link>
                <Link to="/home">
                  <Button variant="danger" className="hauptmenu">
                    Zurück zum Hauptmenü
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>


      {/* Modal für die Bestätigung des Fahrtendes */}
      <Modal show={showEndModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Fahrt beenden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} id="endModalForm">
            <Form.Group controlId="formGridKilometerEnde">
              <Form.Label>Kilometerstand bei Fahrtende</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Kilometerstand"
                onChange={(e) => setKilometerstandEnde(parseInt(e.target.value))}
              />
              <Form.Control.Feedback type="invalid">Bitte geben Sie einen Kilometerstand ein.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formGridOrtFahrtbeendigung">
              <Form.Label>Ort der Fahrtbeendigung</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ort der Fahrtbeendigung"
                onChange={(e) => setOrtFahrtbeendigung(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">Bitte geben Sie den Ort der Fahrtbeendigung ein.</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={handleEnde}>
            Bestätigen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


export default FahrtVerwalten;