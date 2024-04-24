import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FahrtResource, UserResource } from "../../util/Resources";
import ChartComponent from "./ChartComponent";
import html2tocanvas from 'html2canvas'
import autoTable from 'jspdf-autotable'
import { jsPDF } from "jspdf";
import { deleteFahrt } from "../../Api/api";

const ExpandFahrt: React.FC<{ fahrt: FahrtResource, user: UserResource }> = ({ fahrt, user }) => {
    const [counter, setCounter] = useState<number>(0);

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

    async function handleDelete(fahrt: FahrtResource): Promise<void> {
        try {
            await deleteFahrt(fahrt);
            setCounter(prev => prev + 1);
        } catch (error) {
            console.error('Fehler beim Löschen der Fahrt:', error);
        }
    }

    const html2tocanvasOptions: any = {
        willReadFrequently: true
    };

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

    const title = fahrt.abwesend ? "Abwesend" : `${formatDateString(new Date(fahrt.createdAt!))}`;

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '12px', marginTop: '10px', marginBottom: '5px' }}>
            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                <h5 style={{ fontSize: '30px', fontWeight: 'bold', color: '#333' }}>
                    Fahrt von {fahrt.vollname}
                </h5>
            </div>
    
            <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '20px' }}>
            <div style={{ textAlign: 'left', maxWidth: '600px' }}>
                    <p style={{ margin: '5px 0', fontSize: '20px', color: '#555' }}>Anfang der Fahrt: {title}</p>
                    <p style={{ margin: '5px 0', fontSize: '20px', color: '#555' }}>Kennzeichen: {fahrt.kennzeichen || 'Keine Angabe'}</p>
                    <p style={{ margin: '5px 0', fontSize: '20px', color: '#555' }}>Ort des Fahrtbeginns: {fahrt.startpunkt || 'Keine Angabe'}</p>
                    <p style={{ margin: '5px 0', fontSize: '20px', color: '#555' }}>Ort der Fahrtbeendigung: {fahrt.endpunkt || 'Keine Angabe.'}</p>
                    <p style={{ margin: '5px 0', fontSize: '20px', color: '#555' }}>Kilometerstand Fahrtbeginn: {fahrt.kilometerstand || 'Keine Angabe'}</p>
                    <p style={{ margin: '5px 0', fontSize: '20px', color: '#555' }}>Kilometerstand Fahrtende: {fahrt.kilometerende || 'Keine Angabe'}</p>
                    {fahrt.kilometerende && fahrt.kilometerstand ? (
                        <p style={{ margin: '5px 0', fontSize: '20px', color: '#555' }}>
                            Gesamtfahrtstrecke: {fahrt.kilometerende - fahrt.kilometerstand} km
                        </p>
                    ) : (
                        <p style={{ margin: '5px 0', fontSize: '20px', color: '#555' }}>
                            Gesamtfahrtstrecke: Keine Angabe.
                        </p>
                    )}
    
                    <p style={{ margin: '5px 0', fontSize: '20px', color: '#555' }}>
                        Beendet: {fahrt.beendet && fahrt.ruhezeit && fahrt.ruhezeit[1]?.start ? "" + formatDateTime(new Date(fahrt.ruhezeit[1].start)) + " Uhr" : fahrt.abwesend ? "Sie waren abwesend." : "Ihre Fahrt läuft noch."}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '20px', color: '#555' }}>
                        Abwesend: {fahrt.abwesend || 'Nein'}
                    </p>
                </div>
            </div>
    
            <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '20px' }}>
                <div style={{ textAlign: 'left', maxWidth: '600px' }}>
                    {fahrt.lenkzeit && (
                        <details>
                            <summary style={{ margin: '5px 0', fontSize: '20px', color: '#555', cursor: 'pointer' }}>
                                Lenkzeiten: {fahrt.totalLenkzeit ? formatTime(fahrt.totalLenkzeit) : "00:00:00"}
                            </summary>
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
                            <summary style={{ margin: '5px 0', fontSize: '20px', color: '#555', cursor: 'pointer' }}>
                                Pausenzeiten: {fahrt.totalPause ? formatTime(fahrt.totalPause) : "00:00:00"}
                            </summary>
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
                            <summary style={{ margin: '5px 0', fontSize: '20px', color: '#555', cursor: 'pointer' }}>
                                Arbeitszeiten: {fahrt.totalArbeitszeit ? formatTime(fahrt.totalArbeitszeit) : "00:00:00"}
                            </summary>
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
                            <summary style={{ marginBottom: "20px" ,margin: '5px 0', fontSize: '20px', color: '#555', cursor: 'pointer' }}>
                                Ruhezeiten: {fahrt.totalRuhezeit ? formatTime(fahrt.totalRuhezeit) : "00:00:00"}
                            </summary>
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
    
            {/* Graph */}
            <div className={`diagramm-${fahrt._id}`} style={{ width: "130%", maxWidth: "1315px", margin: '0 auto', textAlign: 'center', marginTop: '20px' }}>
                <ChartComponent fahrt={fahrt} />
            </div>
    
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                <button className="submit-button-beginnen" style={{ margin: '0 10px' }} onClick={() => { downloadPDF(fahrt) }}>Herunterladen</button>
                <button className="submit-button-beginnen2" style={{ margin: '0 10px' }} onClick={() => { handleDelete(fahrt) }}>Fahrt Löschen</button>
            </div>
        </div>
    );    
    
};

export default ExpandFahrt;
