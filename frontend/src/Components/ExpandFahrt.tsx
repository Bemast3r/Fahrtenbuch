import React from "react";
import { FahrtResource } from "../util/Resources";

const ExpandFahrt: React.FC<{ fahrt: FahrtResource }> = ({ fahrt }) => {


    function formatDate(date: Date): string {
        const hours = new Date(date).getHours().toString().padStart(2, '0');
        const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
        const seconds = new Date(date).getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      }

    return (
        <div id="accordion">
            <div className="card">
                <div className="card-header" id={`heading-${fahrt.id}`}>
                    <h5 className="mb-0">
                        <button
                            className="btn btn-link"
                            data-toggle="collapse"
                            data-target={`#collapse-${fahrt.id}`}
                            aria-expanded="true"
                            aria-controls={`collapse-${fahrt.id}`}
                        >
                            Fahrt von {fahrt.startpunkt} erstellt am {formatDate(new Date(fahrt.createdAt!))}
                        </button>
                    </h5>
                </div>
                <div
                    id={`collapse-${fahrt.id}`}
                    className="collapse show"
                    aria-labelledby={`heading-${fahrt.id}`}
                    data-parent="#accordion"
                >
                    <div className="card-body">
                    <p>Starpunkt: {fahrt.startpunkt || 'Keine Angabe'}</p>
                        <p>Kennzeichen: {fahrt.kennzeichen || 'Keine Angabe'}</p>
                        <p>Gestartet mit km: {fahrt.kilometerstand || 'Keine Angabe'}</p>
                        <p>Beendet mit km: {fahrt.kilometerende || 'Keine Angabe'}</p>
                        <p>Beendet um : {fahrt.beendet || 'Keine Angabe'}</p>
                        <p>Abwesend: {fahrt.abwesend || 'Nein.'}</p>
                        {/* Anzeige der Lenkzeit */}
                        {fahrt.lenkzeit && (
                            <div>
                                <p>Lenkzeiten:</p>
                                <ul>
                                    {fahrt.lenkzeit.map((zeit, index) => (
                                        <li key={index}>
                                            Start: {zeit.start ? formatDate(new Date(zeit.start)) : 'Keine Angabe'}, Stop: {zeit.stop ? formatDate(new Date(zeit.stop)) : 'Keine Angabe'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
    
                        {/* Anzeige der Pausenzeit */}
                        {fahrt.pause && (
                            <div>
                                <p>Pausenzeiten:</p>
                                <ul>
                                    {fahrt.pause.map((pause, index) => (
                                        <li key={index}>
                                           Start: {pause.start ? formatDate(new Date(pause.start)) : 'Keine Angabe'}, Stop: {pause.stop ? formatDate(new Date(pause.stop)) : 'Keine Angabe'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
    
                        {/* Anzeige der Arbeitszeit ohne Fahren */}
                        {fahrt.arbeitszeit && (
                            <div>
                                <p>Arbeitszeiten ohne Fahren:</p>
                                <ul>
                                    {fahrt.arbeitszeit.map((zeit, index) => (
                                        <li key={index}>
                                            Start: {zeit.start ? formatDate(new Date(zeit.start)) : 'Keine Angabe'}, Stop: {zeit.stop ? formatDate(new Date(zeit.stop)) : 'Keine Angabe'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
    
                    </div>
                </div>
            </div>
        </div>
    );
    
};

export default ExpandFahrt;
