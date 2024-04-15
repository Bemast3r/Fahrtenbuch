import React, { useEffect, useState } from 'react';
import './fahrtVerwalten.css';
import { getJWT, getLoginInfo, setJWT } from './Logincontext';
import { getUser, getFahrt, updateFahrt } from '../Api/api';
import { FahrtResource, UserResource } from '../util/Resources';
import Loading from './LoadingIndicator';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


const TFahrtVerwalten: React.FC = () => {
  const [showEndModal, setShowEndModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [usercontexte, setUser] = useState<UserResource | null>(null);
  const [letzteFahrt, setLetzteFahrt] = useState<FahrtResource | null>(null);
  const [count, setCounter] = useState(0);
  const [validated, setValidated] = useState<boolean>(false);
  const [kilometerEnde, setKilometerstandEnde] = useState<number>(0);
  const [ortFahrtbeendigung, setOrtFahrtbeendigung] = useState<string>('');
  const [buttonLoading, setButtonLoading] = useState<boolean>(false); // Zustand für Button-Loading
  const [isRecordingArbeitszeit, setIsRecordingArbeitszeit] = useState<boolean>(false); // Zustand für die Aufzeichnung der Arbeitszeit
  const [arbeitText, setArbeitText] = useState<string>('Arbeitszeit START'); // Text für den Arbeitszeit-Button
  const [isRecordingLenkzeit, setIsRecordingLenkzeit] = useState<boolean>(false); // Zustand für die Aufzeichnung der Lenkzeit
  const [lenkText, setLenkText] = useState<string>('Lenkzeit START'); // Text für den Lenkzeit-Button
  const [isRecordingPause, setIsRecordingPause] = useState<boolean>(false); // Zustand für die Aufzeichnung der Lenkzeit
  const [pauseText, setPauseText] = useState<string>('Pause START'); // Text für den Lenkzeit-Button
  const [isDisabledLenkzeit, setisDisabledLenkzeit] = useState<boolean>(true); // Zustand für die Aufzeichnung der Lenkzeit
  const [isDisabledArbeitzeit, setisDisabledArbeitzeit] = useState<boolean>(false); // Zustand für die Aufzeichnung der Lenkzeit
  const [isDisabledPause, setisDisabledPause] = useState<boolean>(false); // Zustand für die Aufzeichnung der Lenkzeit

  const navigate = useNavigate();

  const handleOpenModal = () => setShowEndModal(true);
  const handleCloseModal = () => setShowEndModal(false);

  const jwt = getJWT();

  useEffect(() => {
    last();
  }, [count]);


  useEffect(() => {
    const storageItems = ['isRecordingArbeitszeit', 'isRecordingLenkzeit', 'isRecordingPause'];
    let allFalse = true;

    storageItems.forEach(async (key) => {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        const parsedValue = JSON.parse(storedValue);
        if (parsedValue) {
          allFalse = false;
        }
      } else {
        setCounter((count) => count + 1)
        setIsRecordingLenkzeit(true)
        await stopRunningTimer()
      }
    });

    storageItems.forEach(async (key) => {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        const parsedValue = JSON.parse(storedValue);
        // Überprüfen, ob der gespeicherte Wert ein gültiger boolescher Wert ist
        if (typeof parsedValue === 'boolean') {
          switch (key) {
            case 'isRecordingArbeitszeit':
              setisDisabledArbeitzeit(parsedValue)
              setIsRecordingArbeitszeit(parsedValue);
              break;
            case 'isRecordingLenkzeit':
              setisDisabledLenkzeit(parsedValue)
              setIsRecordingLenkzeit(parsedValue);
              break;
            case 'isRecordingPause':
              setisDisabledPause(parsedValue)
              setIsRecordingPause(parsedValue);
              break;
            default:
              break;
          }
        }
      }
    });
  }, []);



  useEffect(() => {
    const storageItems = {
      isRecordingArbeitszeit,
      isRecordingLenkzeit,
      isRecordingPause
    };
    if (count !== 0) {
      Object.entries(storageItems).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
    }

  }, [isRecordingArbeitszeit, isRecordingLenkzeit, isRecordingPause]);


  useEffect(() => {
    if (jwt) {
      setJWT(jwt);
    } else {
      navigate('/');
      return;
    }
  }, [jwt, navigate]);

  async function last() {
    if (usercontexte && usercontexte.id) {
      const x: FahrtResource[] = await getFahrt(usercontexte.id);
      if (x.length === 0 || x[x.length - 1].beendet) {
        setLoading(false);
        return;
      }
      setLetzteFahrt(x[x.length - 1]);
    } else {
      const id = getLoginInfo();
      if (id && id.userID) {
        const user = await getUser(id!.userID);
        setUser(user);
        const x: FahrtResource[] = await getFahrt(id!.userID);
        if (x.length === 0 || x[x.length - 1].beendet) {
          setLoading(false);
          return;
        }
        let currentfahrt = x[x.length - 1];
        const fahrtResource: FahrtResource = {
          fahrerid: user.id!,
          id: currentfahrt._id!.toString(),
          _id: currentfahrt._id!.toString(),
          kennzeichen: currentfahrt.kennzeichen.toString(),
          kilometerstand: currentfahrt.kilometerstand,
          startpunkt: currentfahrt.startpunkt.toString(),
          beendet: false,
          vollname: user.vorname + ' ' + user.name,
        };
        const fahrt = await updateFahrt(fahrtResource);
        setLetzteFahrt(fahrt);
        setLoading(false);
      } else {
        navigate("/")
      }
    }
  }

  async function handleEndePost(formData: any) {
    if (usercontexte && letzteFahrt) {
      await stopRunningTimer()
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 0);
      const dayinMillis = (24 * 3600 * 1000) / 1000;
      const fahrtendeTime = new Date(Date.now() + 2000)

      const timeFromMidnight = letzteFahrt.createdAt ? new Date(letzteFahrt.createdAt).getTime() - today.getTime() : 0;

      // Zeitdifferenz zwischen Endzeit des Tages und Fahrtendezeit berechnen
      const timeToEndOfDay = end.getTime() - fahrtendeTime.getTime();

      // Gesamtruhezeit in Sekunden berechnen
      const totalRuhezeit = Math.round((timeFromMidnight + timeToEndOfDay) / 1000); // in Sekunden

      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        ruhezeit: [
          { start: fahrtendeTime, stop: end },
        ],
        vollname: usercontexte.vorname + ' ' + usercontexte.name,
        beendet: true,
        kilometerende: formData.KilometerstandEnde,
        endpunkt: formData.OrtFahrtbeendigung,
        totalRuhezeit: totalRuhezeit
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
      setCounter((count) => count + 1);
    }
  }

  async function handleEnde() {
    const form = document.getElementById('endModalForm') as HTMLFormElement;

    if (form.checkValidity() === false) {
      form.reportValidity();
      return;
    }

    const formData = { KilometerstandEnde: kilometerEnde, OrtFahrtbeendigung: ortFahrtbeendigung };

    // Setze den Zustand auf 'true', um den Button zu deaktivieren und "Wird aufgenommen" anzuzeigen
    setButtonLoading(true);

    await handleEndePost(formData);

    // Setze den Zustand zurück, um den Button nach dem Absenden zu aktivieren
    setButtonLoading(false);

    navigate('/');
  }

  async function stopRunningTimer() {
    if (isRecordingLenkzeit) {
      setisDisabledLenkzeit(false)
      setIsRecordingLenkzeit(false);
      setLenkText('Lenkzeit START');
      let lenkzeit = 0;
      if (letzteFahrt!.lenkzeit!.length > 0) {
        lenkzeit = ((new Date(Date.now()).getTime() - new Date(letzteFahrt!.lenkzeit![letzteFahrt!.lenkzeit!.length - 1]).getTime()) / 1000) + letzteFahrt!.totalLenkzeit!
      } else {
        lenkzeit = (new Date(Date.now()).getTime() - new Date(letzteFahrt!.createdAt!).getTime()) / 1000
      }
      if (usercontexte && letzteFahrt) {
        const fahrtResource: FahrtResource = {
          fahrerid: usercontexte.id!,
          vollname: usercontexte.vorname + ' ' + usercontexte.name,
          id: letzteFahrt._id!.toString(),
          _id: letzteFahrt._id!.toString(),
          kennzeichen: letzteFahrt.kennzeichen.toString(),
          kilometerstand: letzteFahrt.kilometerstand,
          startpunkt: letzteFahrt.startpunkt.toString(),
          lenkzeit: [new Date(Date.now())],
          beendet: false,
          totalLenkzeit: lenkzeit
        };
        const fahrt = await updateFahrt(fahrtResource);
        setLetzteFahrt(fahrt);
        setCounter((count) => count + 1);
        return;
      }
    } else if (isRecordingPause) {
      setisDisabledPause(false)
      setIsRecordingPause(false);
      setPauseText('Pause START');
      let pause = 0;
      if (letzteFahrt!.pause!.length >= 1) {
        pause = ((new Date(Date.now()).getTime() - new Date(letzteFahrt!.pause![letzteFahrt!.pause!.length - 1]).getTime()) / 1000) + letzteFahrt!.totalPause!
      }
      if (usercontexte && letzteFahrt) {
        const fahrtResource: FahrtResource = {
          fahrerid: usercontexte.id!,
          vollname: usercontexte.vorname + ' ' + usercontexte.name,
          id: letzteFahrt._id!.toString(),
          _id: letzteFahrt._id!.toString(),
          kennzeichen: letzteFahrt.kennzeichen.toString(),
          kilometerstand: letzteFahrt.kilometerstand,
          startpunkt: letzteFahrt.startpunkt.toString(),
          pause: [new Date(Date.now())],
          beendet: false,
          totalPause: pause
        };
        const fahrt = await updateFahrt(fahrtResource);
        setLetzteFahrt(fahrt);
        setCounter((count) => count + 1);
        return;
      }
    } else if (isRecordingArbeitszeit) {
      setisDisabledArbeitzeit(false)
      setIsRecordingArbeitszeit(false); // Arbeitszeit deaktivieren
      setArbeitText('Arbeitszeit START'); // Text für den Arbeitszeit-Button ändern
      let arbeitszeit = 0;
      if (letzteFahrt!.arbeitszeit!.length >= 1) {
        arbeitszeit = ((new Date(Date.now()).getTime() - new Date(letzteFahrt!.arbeitszeit![letzteFahrt!.arbeitszeit!.length - 1]).getTime()) / 1000) + letzteFahrt!.totalArbeitszeit!
      }
      if (usercontexte && letzteFahrt) {
        const fahrtResource: FahrtResource = {
          fahrerid: usercontexte.id!,
          vollname: usercontexte.vorname + ' ' + usercontexte.name,
          id: letzteFahrt._id!.toString(),
          _id: letzteFahrt._id!.toString(),
          kennzeichen: letzteFahrt.kennzeichen.toString(),
          kilometerstand: letzteFahrt.kilometerstand,
          startpunkt: letzteFahrt.startpunkt.toString(),
          arbeitszeit: [new Date(Date.now())],
          beendet: false,
          totalArbeitszeit: arbeitszeit
        };
        const fahrt = await updateFahrt(fahrtResource);
        setLetzteFahrt(fahrt);
        setCounter((count) => count + 1);
        return;
      }
    }
  }

  async function handleLenkzeit() {
    setisDisabledLenkzeit(true)

    await stopRunningTimer();
    setisDisabledLenkzeit(true)

    if (usercontexte && letzteFahrt) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
        vollname: usercontexte.vorname + ' ' + usercontexte.name,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        lenkzeit: [new Date(Date.now())],
        beendet: false
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
      setCounter((count) => count + 1);
      setIsRecordingLenkzeit(true); // Lenkzeit wird aufgezeichnet
      setLenkText('Lenkzeit Läuft'); // Text für den Lenkzeit-Button ändern
    }
  }

  async function handleArbeitszeit() {
    await stopRunningTimer();
    setisDisabledArbeitzeit(true)
    if (usercontexte && letzteFahrt) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
        vollname: usercontexte.vorname + ' ' + usercontexte.name,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        arbeitszeit: [new Date(Date.now())],
        beendet: false,
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
      setCounter((count) => count + 1);
      setIsRecordingArbeitszeit(true); // Arbeitszeit wird aufgezeichnet
      setArbeitText('Arbeitszeit LÄUFT'); // Text für den Arbeitszeit-Button ändern
    }
  }

  async function handlePause() {
    setisDisabledPause(true)
    await stopRunningTimer();
    setisDisabledPause(true)
    if (usercontexte && letzteFahrt) {
      const fahrtResource: FahrtResource = {
        fahrerid: usercontexte.id!,
        vollname: usercontexte.vorname + ' ' + usercontexte.name,
        id: letzteFahrt._id!.toString(),
        _id: letzteFahrt._id!.toString(),
        kennzeichen: letzteFahrt.kennzeichen.toString(),
        kilometerstand: letzteFahrt.kilometerstand,
        startpunkt: letzteFahrt.startpunkt.toString(),
        pause: [new Date(Date.now())],
        beendet: false,
      };
      const fahrt = await updateFahrt(fahrtResource);
      setLetzteFahrt(fahrt);
      setCounter((count) => count + 1);
      setIsRecordingPause(true); // Pause wird aufgezeichnet
      setPauseText('Pause LÄUFT'); // Text für den Pause-Button ändern
    }
  }


  return (
    <>
      <Navbar />
      <div>
        <br />
        <br />
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
            <h3>Hallo, {usercontexte ? usercontexte.name : ''}.</h3>
            {letzteFahrt && !letzteFahrt.beendet ? (
              <>
                <p>
                  Ihre momentane Fahrt startete am{' '}
                  {letzteFahrt ? new Date(letzteFahrt.createdAt!).toLocaleDateString('de-DE') + ' um ' + new Date(letzteFahrt.createdAt!).toLocaleTimeString('de-DE') : 'Keine Fahrt'}, mit dem Kennzeichen{' '}
                  {letzteFahrt ? letzteFahrt.kennzeichen : 'Kein Kennzeichen'}.{' '}
                </p>
                <p>Ihr Startpunkt ist {letzteFahrt ? letzteFahrt?.startpunkt : 'Kein Startpunkt'}.</p>
                <div className="section">
                  <div className="button-group">
                    <Button variant={isRecordingLenkzeit ? 'danger' : 'primary'} onClick={handleLenkzeit} disabled={isDisabledLenkzeit}>
                      {isRecordingLenkzeit ? "Lenkzeit läuft" : "Lenkzeit start"}
                    </Button>
                  </div>
                </div>
                <div className="section">
                  <div className="button-group">
                    <Button variant={isRecordingArbeitszeit ? 'danger' : 'primary'} onClick={handleArbeitszeit} disabled={isDisabledArbeitzeit}>
                      {isRecordingArbeitszeit ? "Arbeitszeit läuft" : "Arbeitszeit start"}
                    </Button>
                  </div>
                </div>
                <div className="section">
                  <div className="button-group">
                    <Button variant={isRecordingPause ? 'danger' : 'primary'} onClick={handlePause} disabled={isDisabledPause}>
                      {isRecordingPause ? "Pause läuft" : "Pause start"}
                    </Button>
                  </div>
                </div>
                <div className="section">
                  <div className="button-group">
                    <Button variant="primary" onClick={handleOpenModal} disabled={buttonLoading}>
                      {buttonLoading ? 'Wird aufgenommen' : 'Fahrt beenden'}
                    </Button>
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

      <Modal show={showEndModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Fahrt beenden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} id="endModalForm">
            <Form.Group controlId="formBasicEnd">
              <Form.Label>Kilometerstand am Ende</Form.Label>
              <Form.Control type="number" placeholder="Kilometerstand eingeben" onChange={(e) => setKilometerstandEnde(parseInt(e.target.value))} required />
              <Form.Control.Feedback type="invalid">Bitte geben Sie den Kilometerstand am Ende ein.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicEndOrt">
              <Form.Label>Ort der Fahrtbeendigung</Form.Label>
              <Form.Control type="text" placeholder="Ort eingeben" onChange={(e) => setOrtFahrtbeendigung(e.target.value)} required />
              <Form.Control.Feedback type="invalid">Bitte geben Sie den Ort der Fahrtbeendigung ein.</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={handleEnde} disabled={buttonLoading}>
            {buttonLoading ? 'Wird aufgenommen' : 'Speichern'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TFahrtVerwalten;
