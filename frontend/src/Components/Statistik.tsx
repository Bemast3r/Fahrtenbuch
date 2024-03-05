import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJWT, setJWT, getLoginInfo } from './Logincontext';
import { getFahrt, getUser } from '../Api/api';
import { FahrtResource, UserResource } from '../util/Resources';

const Statistik = () => {
    const [user, setUser] = useState<UserResource | null>(null)

    const jwt = getJWT()
    const navigate = useNavigate()

    useEffect(() => {
        if (jwt) {
            setJWT(jwt)
        } else {
            navigate("/")
            return;
        }
    }, [jwt])

    async function load() {
        const id = getLoginInfo()
        const user = await getUser(id!.userID)
        setUser(user)
    }

    // async function handlePostLenkzeit() {
    //     const fahrtResource: FahrtResource = {
    //         fahrerid: usercontexte.id!,
    //         id: letzteFahrt._id!.toString(),
    //         _id: letzteFahrt._id!.toString(),
    //         kennzeichen: letzteFahrt.kennzeichen.toString(),
    //         kilometerstand: letzteFahrt.kilometerstand,
    //         startpunkt: letzteFahrt.startpunkt.toString(),
    //         lenkzeit: [{ start: lenkzeitRecord.start, stop: lenkzeitRecord.stop! }],
    //         beendet: false,
    //       };
          
    //     const fahrt = await getFahrt(fahrtResource);
    // }

    const totalTrips = 1000;
    const ongoingTrips = 300;
    const completedTrips = 700;

    // Dummy-Daten für Benutzer
    const totalUsers = 50;
    const adminUsers = 5;
    const regularUsers = totalUsers - adminUsers;

    useEffect(() => { load() }, [])

    return (
        <div className="form-wrapper">
            <h2 className="form-header">Statistiken</h2>
            <div>
                <h2>Fahrten</h2>
                <p>Gesamtzahl der Fahrten: {totalTrips}</p>
                <p>Aktuelle Fahrten: {ongoingTrips}</p>
                <p>Abgeschlossene Fahrten: {completedTrips}</p>
            </div>
            <div>
                <h2>Benutzer</h2>
                <p>Gesamtzahl der Benutzer: {totalUsers}</p>
                <p>Admin-Benutzer: {adminUsers}</p>
                <p>Reguläre Benutzer: {regularUsers}</p>
            </div>
        </div>
    );
}

export default Statistik;
