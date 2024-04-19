import React from "react";
import { Button } from "react-bootstrap";
import { FahrtResource, UserResource } from "../../util/Resources";
import ChartComponent from "./ChartComponent";
import html2tocanvas from 'html2canvas'
import autoTable from 'jspdf-autotable'
import { jsPDF } from "jspdf";

const ExpandFahrt: React.FC<{ fahrt: FahrtResource, user: UserResource }> = ({ fahrt, user }) => {

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
        const gerundeteSekunden = Math.floor(sekunden);
        const stunden: number = Math.floor(gerundeteSekunden / 3600);
        const minuten: number = Math.floor((gerundeteSekunden % 3600) / 60);
        const sekundenRest: number = gerundeteSekunden % 60;
        const formatierteStunden: string = stunden.toString().padStart(2, '0');
        const formatierteMinuten: string = minuten.toString().padStart(2, '0');
        const formatierteSekunden: string = sekundenRest.toString().padStart(2, '0');

        return `${formatierteStunden}:${formatierteMinuten}:${formatierteSekunden}`;
    }

    const html2tocanvasOptions: any = {
        willReadFrequently: true
    };
    const title = fahrt.abwesend ? "Abwesend" : `Ihre Fahrt wurde am ${formatDateString(new Date(fahrt.createdAt!))}`;

    const downloadPDF = (fahrt: FahrtResource) => {
        const capture = document.querySelector(`.diagramm-${fahrt._id}`) as HTMLElement;
        if (capture) {
            html2tocanvas(capture, html2tocanvasOptions).then((canvas) => {
                const imgdata = canvas.toDataURL('img/jpeg');
                const doc = new jsPDF();
                const componetwidth = doc.internal.pageSize.getWidth()
                const componentheight = doc.internal.pageSize.getHeight();
                const ruhezeit = fahrt.totalRuhezeit ? formatTime(fahrt.totalRuhezeit) : "----";
                const lenkzeit = fahrt.totalLenkzeit ? formatTime(fahrt.totalLenkzeit) : "----";
                const arbeitszeit = fahrt.totalArbeitszeit ? formatTime(fahrt.totalArbeitszeit) : "----";
                const pause = fahrt.totalPause ? formatTime(fahrt.totalPause) : "----";
                doc.setFont("helvetica", "normal", "bold")
                doc.setFontSize(20)
                doc.text("SKM Service - Fahrtenbuch", (componetwidth / 2) / 2 + 5, 20);
                const tableData = [
                    ['Name', `${fahrt.vollname}`],
                    ['Wurde gefahren?', `${fahrt.abwesend || 'Die Fahrt hat stattgefunden.'}`],
                    ['Ort des Fahrtbeginns', `${fahrt.startpunkt || 'Keine Angabe'}`],
                    ['Ort der Fahrtbeendigung', `${fahrt.endpunkt || '-'}`],
                    ['Kennzeichen', `${fahrt.kennzeichen || 'Keine Angabe'}`],
                    ['Kilometerstand Fahrtbeginn', `${fahrt.kilometerstand !== 0 ? `${fahrt.kilometerstand} km` : 'Keine Angabe'}`],
                    ['Kilometerstand Fahrtende', `${fahrt.kilometerende !== undefined ? `${fahrt.kilometerende} km` : 'Keine Angabe'}`],
                    ['Gesamtfahrtstrecke', `${fahrt.kilometerende ? fahrt.kilometerende - (fahrt.kilometerstand || 0) : 0} km`],
                    ['Zeitpunkt Fahrtende', `${fahrt.beendet && fahrt.ruhezeit && fahrt.ruhezeit[1]?.start ? "Ihre Fahrt wurde um " + formatDateTime(new Date(fahrt.ruhezeit[1].start)) + " Uhr beendet." : fahrt.abwesend ? "Sie waren abwesend." : "Ihre Fahrt läuft noch."}`],
                    ['Gesamte Lenkzeit', `${lenkzeit || 'Keine Angabe'}`],
                    ['Gesamte Arbeitszeit', `${arbeitszeit || 'Keine Angabe'}`],
                    ['Gesamte Pausenzeit', `${pause || 'Keine Angabe'}`],
                    ['Gesamte Ruhezeit', `${ruhezeit || 'Keine Angabe'}`]
                ];
                const headers = [['Ihre Fahrt', 'Daten']];

                autoTable(doc, {
                    columnStyles: { 0: { fontStyle: "bold" } },
                    head: headers,
                    body: tableData,
                    startY: 50
                });

                doc.addImage(imgdata, 'JPEG', 10, (componentheight * 4 / 5) - 50, componetwidth + 20, componentheight / 5);
                doc.line(20, componentheight - 10, 80, componentheight - 10);

                doc.setFont("helvetica", "normal", "bold")
                doc.setFontSize(8)
                doc.text("Datum, Unterschrift", 20, componentheight - 5);


                doc.save(`Fahrt_von_${fahrt.vollname}_am_${formatDateString(new Date(fahrt.createdAt!))}.pdf`);
            });
        } else {
            console.log("Nicht gefunden.");
        }
    };

    return (
        <div id="accordion">
            <div style={{ height: "auto" }} className="infos">
                <div className="card-title" id={`heading-${fahrt.id}`} >
                    <h5 className="mb-0">
                        <p style={{ fontWeight: "bold" }}>
                            {title} um {formatDateTime(new Date(fahrt.createdAt!))} gestartet.
                        </p>
                    </h5>
                </div>
                <div className="infoschart">
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
                            {fahrt.kilometerende && fahrt.kilometerstand ? (
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
                            <br></br>
                            <p>(Datenformat: HH:MM:SS)</p>
                            {fahrt.lenkzeit && (
                                <details>
                                    <summary style={{ fontWeight: "bold" }}>Lenkzeiten: {fahrt.totalLenkzeit ? formatTime(fahrt.totalLenkzeit) : "00:00:00"}</summary>
                                    <ul>
                                        {fahrt.lenkzeit.length > 0 ? fahrt.lenkzeit.map((zeit, index) => (
                                            <li key={index}>
                                                Zeiten: {zeit ? formatDateTime(new Date(zeit)) : 'Keine Angabe'}
                                            </li>
                                        )) : "Keine Lenkzeit"}
                                    </ul>
                                </details>
                            )}
                            {fahrt.pause && (
                                <details>
                                    <summary style={{ fontWeight: "bold" }}>Pausenzeiten: {fahrt.totalPause ? formatTime(fahrt.totalPause) : "00:00:00"}</summary>
                                    <ul>
                                        {fahrt.pause.length > 0 ? fahrt.pause.map((pause, index) => (
                                            <li key={index}>
                                                Zeiten: {pause ? formatDateTime(new Date(pause)) : 'Keine Angabe'}
                                            </li>
                                        )) : "Keine Pausenzeit"}
                                    </ul>
                                </details>
                            )}
                            {fahrt.arbeitszeit && (
                                <details>
                                    <summary style={{ fontWeight: "bold" }}>Arbeitszeiten: {fahrt.totalArbeitszeit ? formatTime(fahrt.totalArbeitszeit) : "00:00:00"}</summary>
                                    <ul>
                                        {fahrt.arbeitszeit.length > 0 ? fahrt.arbeitszeit.map((zeit, index) => (
                                            <li key={index}>
                                                Zeiten: {zeit ? formatDateTime(new Date(zeit)) : 'Keine Angabe'}
                                            </li>
                                        )) : "Keine Arbeitszeit"}
                                    </ul>
                                </details>
                            )}
                            {fahrt.ruhezeit && (
                                <details>
                                    <summary style={{ fontWeight: "bold" }}>Ruhezeiten: {fahrt.totalRuhezeit ? formatTime(fahrt.totalRuhezeit) : "00:00:00"}</summary>
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

                    <div>
                        <div className={`diagramm-${fahrt._id}`} >
                            <ChartComponent fahrt={fahrt} />
                        </div>
                    </div>
                </div>
                {/* PDF Download. */}
                <Button className="downloadButton" onClick={() => { downloadPDF(fahrt) }}>HERUNTERLADEN</Button>
            </div>
        </div>
    );
};

export default ExpandFahrt;
