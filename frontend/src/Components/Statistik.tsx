import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJWT, setJWT, getLoginInfo } from './Logincontext';
import { getCompletedTrips, getOngoingTrips, getUser } from '../Api/api';
import { UserResource } from '../util/Resources';

const Statistik = () => {
    const [user, setUser] = useState<UserResource | null>(null);
    const [tripData, setTripData] = useState<{ completedTrips: number; ongoingTrips: number }>({ completedTrips: 0, ongoingTrips: 0 });

    const jwt = getJWT();
    const navigate = useNavigate();

    useEffect(() => {
        if (jwt) {
            setJWT(jwt);
        } else {
            navigate("/");
            return;
        }
    }, [jwt]);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            loadTrips();
        }, 60000); // Intervall von 60 Sekunden für regelmäßiges Laden der Daten

        return () => clearInterval(intervalId);
    }, []);

    async function loadInitialData() {
        try {
            const id = getLoginInfo();
            const user = await getUser(id!.userID);
            setUser(user);
            await loadTrips();
        } catch (error) {
            console.error("Fehler beim Laden der Daten:", error);
        }
    }

    async function loadTrips() {
        try {
            const completed = await getCompletedTrips();
            const ongoing = await getOngoingTrips();
            setTripData({ completedTrips: completed.length, ongoingTrips: ongoing.length });
        } catch (error) {
            console.error("Fehler beim Laden der Fahrten:", error);
        }
    }

    // Dummy-Daten für Benutzer
    const totalUsers = 50;
    const adminUsers = 5;

    return (
        <div className="form-wrapper">
            <h2 className="form-header">Statistiken</h2>
            <div>
                <h2>Fahrten</h2>
                <p>Gesamtzahl der Fahrten: {tripData.completedTrips + tripData.ongoingTrips}</p>
                <p>Aktuelle Fahrten: {tripData.ongoingTrips}</p>
                <p>Abgeschlossene Fahrten: {tripData.completedTrips}</p>
            </div>
            <div>
                <h2>Benutzer</h2>
                <p>Gesamtzahl der Benutzer: {totalUsers}</p>
                <p>Admin-Benutzer: {adminUsers}</p>
            </div>
        </div>
    );
}

export default Statistik;
