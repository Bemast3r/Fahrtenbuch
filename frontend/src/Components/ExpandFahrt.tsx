import React from "react";
import { FahrtResource } from "../util/Resources";
import "./statistiken.css"

const ExpandFahrt: React.FC<{ fahrt: FahrtResource }> = ({ fahrt }) => {
    function formatDate(date: Date): string {
        const hours = new Date(date).getHours().toString().padStart(2, '0');
        const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
        const seconds = new Date(date).getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // Titel basierend auf dem Wert von abwesend setzen
    const title = fahrt.abwesend ? "Abwesend" : `Fahrt am ${fahrt.startpunkt}`;

    return (
        <div id="accordion">
            <div className="card" >
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
                    <div className="card-body">
                        <p><span style={{ fontWeight: "bold" }}>Starpunkt:</span> {fahrt.startpunkt || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Kennzeichen:</span> {fahrt.kennzeichen || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Gestartet mit km:</span> {fahrt.kilometerstand || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Beendet mit km:</span> {fahrt.kilometerende || 'Keine Angabe'}</p>
                        <p><span style={{ fontWeight: "bold" }}>Beendet:</span> {fahrt.beendet && fahrt.ruhezeit && fahrt.ruhezeit[1]?.start ? "Ihre Fahrt wurde um " + formatDate(new Date(fahrt.ruhezeit[1].start)) + " Uhr beendet." : "Ihre Fahrt läuft noch."}</p>
                        <p><span style={{ fontWeight: "bold" }}>Abwesend:</span> {fahrt.abwesend || 'Nein.'}</p>
                        {fahrt.lenkzeit && (

                            <details>
                                <summary style={{ fontWeight: "bold" }}>Lenkzeiten</summary>
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
                                <summary style={{ fontWeight: "bold" }}>Pausenzeiten</summary>
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
                                <summary style={{ fontWeight: "bold" }}>Arbeitszeiten</summary>
                                <ul>
                                    {fahrt.arbeitszeit.length > 0 ? fahrt.arbeitszeit.map((zeit, index) => (
                                        <li key={index}>
                                            Start: {zeit?.start ? formatDate(new Date(zeit.start)) : 'Keine Angabe'}, Stop: {zeit?.stop ? formatDate(new Date(zeit.stop)) : 'Keine Angabe'}
                                        </li>
                                    )) : "Keine Arbeitszeit"}
                                </ul>
                            </details>

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpandFahrt;
