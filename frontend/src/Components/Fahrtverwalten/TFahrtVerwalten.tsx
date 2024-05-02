import React, { useEffect, useState } from 'react';
import './fahrtVerwalten.css';
import { getUser, getFahrt, updateFahrt } from '../../Api/api';
import { FahrtResource, UserResource } from '../../util/Resources';
import Loading from '../../util/Components/LoadingIndicator';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Home/Navbar';
import { getJWT, setJWT, getLoginInfo } from '../Context/Logincontext';


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

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };


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
    // Überprüfen und Aufrufen der entsprechenden Funktion basierend auf dem Aufzeichnungsstatus
    if (isRecordingLenkzeit) {
      await stopRunningLenkzeitTimer();
    } else if (isRecordingPause) {
      await stopRunningPauseTimer();
    } else if (isRecordingArbeitszeit) {
      await stopRunningArbeitszeitTimer();
    }

  }

  async function stopRunningLenkzeitTimer() {
    setisDisabledLenkzeit(false);
    setIsRecordingLenkzeit(false);
    setLenkText('Lenkzeit START');
    let lenkzeit = 0;
    if (letzteFahrt!.lenkzeit!.length > 0) {
      lenkzeit =
        (new Date(Date.now()).getTime() -
          new Date(
            letzteFahrt!.lenkzeit![letzteFahrt!.lenkzeit!.length - 1]
          ).getTime()) / 1000 +
        letzteFahrt!.totalLenkzeit!;
    } else {
      lenkzeit =
        (new Date(Date.now()).getTime() -
          new Date(letzteFahrt!.createdAt!).getTime()) /
        1000;
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
  }

  async function stopRunningPauseTimer() {
    setisDisabledPause(false);
    setIsRecordingPause(false);
    setPauseText('Pause START');
    let pause = 0;
    if (letzteFahrt!.pause!.length >= 1) {
      pause =
        (new Date(Date.now()).getTime() -
          new Date(
            letzteFahrt!.pause![letzteFahrt!.pause!.length - 1]
          ).getTime()) / 1000 +
        letzteFahrt!.totalPause!;
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
  }

  async function stopRunningArbeitszeitTimer() {
    setisDisabledArbeitzeit(false);
    setIsRecordingArbeitszeit(false);
    setArbeitText('Arbeitszeit START');
    let arbeitszeit = 0;
    if (letzteFahrt!.arbeitszeit!.length >= 1) {
      arbeitszeit =
        (new Date(Date.now()).getTime() -
          new Date(
            letzteFahrt!.arbeitszeit![letzteFahrt!.arbeitszeit!.length - 1]
          ).getTime()) / 1000 +
        letzteFahrt!.totalArbeitszeit!;
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
      <div className='fahrt-verwalten'>
        {loading ? (
          <Loading />
        ) : (
          <div className="form-container3">
            <h1 className="form-header">Fahrt verwalten</h1>
            <h3 className="Hallo">Hallo, {usercontexte ? usercontexte.name : ''}!</h3>
            {letzteFahrt && !letzteFahrt.beendet ? (
              <>

                <p className='Text-Abschnitt'>
                  Start der Fahrt: {' '}
                  {letzteFahrt ?
                    <>
                      <strong>{new Date(letzteFahrt.createdAt!).toLocaleDateString('de-DE')} um </strong>
                      <strong>{formatTime(new Date(letzteFahrt.createdAt!))} Uhr</strong>
                    </>
                    : 'Keine Fahrt'}
                </p>
                <p className='Text-Abschnitt2'>
                  Kennzeichen: {' '}
                  {letzteFahrt ?
                    <strong>{letzteFahrt.kennzeichen}</strong>
                    : 'Kein Kennzeichen'}
                </p>
                <p className='Text-Abschnitt2'>
                  Startpunkt: {' '}
                  {letzteFahrt ?
                    <strong>{letzteFahrt?.startpunkt}</strong>
                    : 'Kein Startpunkt'}
                </p>


                <div className="section">
                  <div className="button-group">
                    <Button className='ie' variant={isRecordingLenkzeit ? 'danger' : 'primary'} onClick={handleLenkzeit} disabled={isDisabledLenkzeit}>
                      {isRecordingLenkzeit ? "Lenkzeit läuft" : "Lenkzeit start"}
                    </Button>
                  </div>
                  <div className="button-group">
                    <Button className='i' variant={isRecordingArbeitszeit ? 'danger' : 'primary'} onClick={handleArbeitszeit} disabled={isDisabledArbeitzeit}>
                      {isRecordingArbeitszeit ? "Arbeitszeit läuft" : "Arbeitszeit start"}
                    </Button>
                  </div>
                  <div className="button-group">
                    <Button className='i' variant={isRecordingPause ? 'danger' : 'primary'} onClick={handlePause} disabled={isDisabledPause}>
                      {isRecordingPause ? "Pause läuft" : "Pause start"}
                    </Button>
                  </div>
                  <div className="button-group">
                    <Button className='i' variant="primary" onClick={handleOpenModal} disabled={buttonLoading}>
                      {buttonLoading ? 'Fahrt beendet' : 'Fahrt beenden'}
                    </Button>
                  </div>
                </div>

              </>
            ) : (
              <>
                <p className='Text-Abschnitt'>Erstelle eine Fahrt, um sie verwalten zu können.</p>
                <Link to="/create" style={{ textDecoration: "none" }}>
                  <button className="submit-button-beginnen4">Fahrt beginnen</button>
                </Link>
                <Link to="/home" style={{ textDecoration: "none" }}>
                  <button className="submit-button-beginnen3">Zum Hauptmenü</button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <Modal show={showEndModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Fahrt beenden</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate validated={validated} id="endModalForm">
            <Form.Group controlId="formBasicEnd">
              <Form.Label className="col-m-4">Kilometerstand am Ende</Form.Label>
              <Col sm={11}>
                <Form.Control onKeyDown={(e) => {
                  if (e.key === 'e' || e.key === 'E' || e.key === '-') {
                    e.preventDefault(); // Verhindern Sie die Eingabe von "e", "E" und "-"
                  }
                }} type="number" placeholder="Kilometerstand eingeben" onChange={(e) => setKilometerstandEnde(parseInt(e.target.value))} required />
                <Form.Control.Feedback type="invalid">Bitte geben Sie den Kilometerstand am Ende ein.</Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group controlId="formBasicEndOrt">
              <Form.Label className="col-m-4">Ort der Fahrtbeendigung</Form.Label>
              <Col sm={11}>
                <Form.Control type="text" placeholder="Ort eingeben" onChange={(e) => setOrtFahrtbeendigung(e.target.value)} required />
                <Form.Control.Feedback type="invalid">Bitte geben Sie den Ort der Fahrtbeendigung ein.</Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>


        <Modal.Footer className="custom-modal-footer">
          <button className="submit-button-beginnen6" onClick={handleCloseModal}>
            Abbrechen
          </button>
          <button className="submit-button-beginnen5" onClick={handleEnde} disabled={buttonLoading}>
            {buttonLoading ? 'Speichern...' : 'Speichern'}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TFahrtVerwalten;