import React from "react";
import { Button } from "react-bootstrap";
import { FahrtResource } from "../util/Resources";
import ChartComponent from "./ChartComponent";

const ExpandFahrt: React.FC<{ fahrt: FahrtResource }> = ({ fahrt }) => {

    function formatDateTime(date: Date): string {
        const hours = new Date(date).getHours().toString().padStart(2, '0');
        const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
        const seconds = new Date(date).getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function formatDateString(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}.${month}.${year}`;
    }

    function formatTime(sekunden: number): string {
        // Stunden, Minuten und Sekunden berechnen
        const stunden: number = Math.floor(sekunden / 3600);
        const minuten: number = Math.floor((sekunden % 3600) / 60);
        const sekundenRest: number = sekunden % 60;
    
        // Zeit im Format HH:MM:SS zurückgeben
        const formatierteStunden: string = stunden.toString().padStart(2, '0');
        const formatierteMinuten: string = minuten.toString().padStart(2, '0');
        const formatierteSekunden: string = sekundenRest.toString().padStart(2, '0');
    
        return `${formatierteStunden}:${formatierteMinuten}:${formatierteSekunden}`;
    }



    // Titel basierend auf dem Wert von abwesend setzen
    const title = fahrt.abwesend ? "Abwesend" : `Ihre Fahrt wurde am ${formatDateString(new Date(fahrt.createdAt!))}`;

    return (
        <div id="accordion">
            <div style={{ height: "auto" }}>
                <div className="card-title" id={`heading-${fahrt.id}`} >
                    <h5 className="mb-0">
                        <p style={{ fontWeight: "bold" }}>
                            {title} um {formatDateTime(new Date(fahrt.createdAt!))} gestartet.
                        </p>
                    </h5>
                </div>
                <div
                    id={`collapse-${fahrt.id}`}
                    className="collapse-show"
                    aria-labelledby={`heading-${fahrt.id}`}
                    data-parent="#accordion"
                >
                    <div className="items">
                        <p><span style={{ fontWeight: "bold" }}>Vollständiger Fahrername:</span> {fahrt.vollname || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Ort des Fahrtbeginns:</span> {fahrt.startpunkt || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Ort der Fahrtbeendigung:</span> {fahrt.endpunkt || 'Keine Angabe.'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Kennzeichen:</span> {fahrt.kennzeichen || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Kilometerstand Fahrtbeginn:</span> {fahrt.kilometerstand || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Kilometerstand Fahrtende:</span> {fahrt.kilometerende || 'Keine Angabe'}</p>
                        {fahrt.kilometerende ? (
                            <p>
                                <span style={{ fontWeight: "bold" }}>Gesamtfahrtstrecke in km:</span> {fahrt.kilometerende - fahrt.kilometerstand} km
                            </p>
                        ) : (
                            <p>
                                <span style={{ fontWeight: "bold" }}>Gesamtfahrtstrecke in km:</span> Keine Angabe.
                            </p>
                        )}

                        <p><span style={{ fontWeight: "bold" }}>Beendet:</span> {fahrt.beendet && fahrt.ruhezeit && fahrt.ruhezeit[1]?.start ? "Ihre Fahrt wurde um " + formatDateTime(new Date(fahrt.ruhezeit[1].start)) + " Uhr beendet." : fahrt.abwesend ? "Sie waren abwesend." : "Ihre Fahrt läuft noch."}</p>
                        <p><span style={{ fontWeight: "bold" }}>Abwesend:</span> {fahrt.abwesend || 'Nein.'}</p>

                        {fahrt.lenkzeit && (
                            <details>
                                <summary style={{ fontWeight: "bold" }}>Lenkzeiten: {fahrt.totalLenkzeit ? formatTime(fahrt.totalLenkzeit) : "----"}</summary>
                                <ul>
                                    {fahrt.lenkzeit.length > 0 ? fahrt.lenkzeit.map((zeit, index) => (
                                        <li key={index}>
                                            Start: {zeit?.start ? formatDateTime(new Date(zeit.start)) : 'Keine Angabe'}, Stop: {zeit?.stop ? formatDateTime(new Date(zeit.stop)) : 'Keine Angabe'}
                                        </li>
                                    )) : "Keine Lenkzeit"}
                                </ul>
                            </details>
                        )}
                        {fahrt.pause && (
                            <details>
                                <summary style={{ fontWeight: "bold" }}>Pausenzeiten: {fahrt.totalPause ? formatTime(fahrt.totalPause) : "----"}</summary>
                                <ul>
                                    {fahrt.pause.length > 0 ? fahrt.pause.map((pause, index) => (
                                        <li key={index}>
                                            Start: {pause?.start ? formatDateTime(new Date(pause.start)) : 'Keine Angabe'}, Stop: {pause?.stop ? formatDateTime(new Date(pause.stop)) : 'Keine Angabe'}
                                        </li>
                                    )) : "Keine Pausenzeit"}
                                </ul>
                            </details>
                        )}
                        {fahrt.arbeitszeit && (
                            <details>
                                <summary style={{ fontWeight: "bold" }}>Arbeitszeiten: {fahrt.totalArbeitszeit ? formatTime(fahrt.totalArbeitszeit) : "----"}</summary>
                                <ul>
                                    {fahrt.arbeitszeit.length > 0 ? fahrt.arbeitszeit.map((zeit, index) => (
                                        <li key={index}>
                                            Start: {zeit?.start ? formatDateTime(new Date(zeit.start)) : 'Keine Angabe'}, Stop: {zeit?.stop ? formatDateTime(new Date(zeit.stop)) : 'Keine Angabe'}
                                        </li>
                                    )) : "Keine Arbeitszeit"}
                                </ul>
                            </details>
                        )}
                        {fahrt.ruhezeit && (
                            <details>
                                <summary style={{ fontWeight: "bold" }}>Ruhezeiten: {fahrt.totalRuhezeit ? formatTime(fahrt.totalRuhezeit) : "----"}</summary>
                                <ul>
                                    {fahrt.ruhezeit.length > 0 ? fahrt.ruhezeit.slice(0, 2).map((zeit, index) => (
                                        <li key={index}>
                                            Start: {zeit?.start ? formatDateTime(new Date(zeit.start)) : 'Keine Angabe'}, Stop: {zeit?.stop ? formatDateTime(new Date(zeit.stop)) : 'Keine Angabe'}
                                        </li>
                                    )) : "Keine Ruhezeit"}
                                </ul>
                            </details>
                        )}
                    </div>
                </div>
            </div>
            <div className="diagramm" style={{ height: "30%", width: "60%" }}>
                <ChartComponent fahrt={fahrt} />
            </div>
            {/* PDF Download. */}
            <Button className="downloadButton">HERUNTERLADEN</Button>
        </div>
    );
};

export default ExpandFahrt;
