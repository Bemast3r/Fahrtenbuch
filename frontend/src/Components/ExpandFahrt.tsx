import React from "react";
import { FahrtResource } from "../util/Resources";
import { Button } from "react-bootstrap";
import "./statistiken.css"

const ExpandFahrt: React.FC<{ fahrt: FahrtResource }> = ({ fahrt }) => {
    function formatDate(date: Date): string {
        const hours = new Date(date).getHours().toString().padStart(2, '0');
        const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
        const seconds = new Date(date).getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function formatTime(seconds: number): string {
        let hours = Math.floor(seconds / 3600);
        hours = Math.floor(hours / 1000)
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
    }

    // Titel basierend auf dem Wert von abwesend setzen
    const title = fahrt.abwesend ? "Abwesend" : `Fahrt am ${fahrt.startpunkt}`;

    return (
        <div id="accordion">
            <div style={{ height: "auto" }}>
                <div className="card-title" id={`heading-${fahrt.id}`} >
                    <h5 className="mb-0">
                        <p style={{ margin: "5px", fontWeight: "bold" }}>
                            {title} erstellt um {formatDate(new Date(fahrt.createdAt!))}
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
                        <p><span style={{ fontWeight: "bold" }}>Starpunkt:</span> {fahrt.startpunkt || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Kennzeichen:</span> {fahrt.kennzeichen || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Gestartet mit km:</span> {fahrt.kilometerstand || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Beendet mit km:</span> {fahrt.kilometerende || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Beendet:</span> {fahrt.beendet && fahrt.ruhezeit && fahrt.ruhezeit[1]?.start ? "Ihre Fahrt wurde um " + formatDate(new Date(fahrt.ruhezeit[1].start)) + " Uhr beendet." : fahrt.abwesend ? "Sie waren abwesend." : "Ihre Fahrt läuft noch."}</p>
                        <p><span style={{ fontWeight: "bold" }}>Abwesend:</span> {fahrt.abwesend || 'Nein.'}</p>
                        {fahrt.lenkzeit && (

                            <details>
                                <summary style={{ fontWeight: "bold" }}>Lenkzeiten: {fahrt.totalLenkzeit ? formatTime(fahrt.totalLenkzeit) : "----"}</summary>
                                <ul>
                                    {fahrt.lenkzeit.length > 0 ? fahrt.lenkzeit.map((zeit, index) => (
                                        <li key={index}>
                                            Start: {zeit?.start ? formatDate(new Date(zeit.start)) : 'Keine Angabe'}, Stop: {zeit?.stop ? formatDate(new Date(zeit.stop)) : 'Keine Angabe'}
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
                                            Start: {pause?.start ? formatDate(new Date(pause.start)) : 'Keine Angabe'}, Stop: {pause?.stop ? formatDate(new Date(pause.stop)) : 'Keine Angabe'}
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
                                            Start: {zeit?.start ? formatDate(new Date(zeit.start)) : 'Keine Angabe'}, Stop: {zeit?.stop ? formatDate(new Date(zeit.stop)) : 'Keine Angabe'}
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
                                            Start: {zeit?.start ? formatDate(new Date(zeit.start)) : 'Keine Angabe'}, Stop: {zeit?.stop ? formatDate(new Date(zeit.stop)) : 'Keine Angabe'}
                                        </li>
                                    )) : "Keine Ruhezeit"}
                                </ul>
                            </details>
                        )}

                    </div>
                </div>
            </div>
            {/* PDF Download. */}

            <Button className="downloadButton">Lade die Fahrt herunter.</Button>
        </div>
    );
};

export default ExpandFahrt;
