import "./chartcomponent.css"
import Chart, {
    Chart as ChartJS,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js/auto';

import "chartjs-adapter-date-fns";
import { Line } from 'react-chartjs-2';
import { FahrtResource } from '../util/Resources';
import Zoom from 'chartjs-plugin-zoom';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Button } from "react-bootstrap";
import { useRef, useState } from "react";

// Registriere erforderliche Chart.js-Komponenten
ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    CategoryScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Zoom,
    zoomPlugin
);

const MyChartComponent: React.FC<{ fahrt: FahrtResource }> = ({ fahrt }) => {
    // Extrahiere die Zeiten aus der FahrtResource und konvertiere sie in Date-Objekte mit Kennungen
    const zeitenData: { x: Date; y: string; }[] = [];

    if (fahrt.lenkzeit) {
        fahrt.lenkzeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit), y: 'Lenkzeit' }); // Lenkzeit
        });
    }
    if (fahrt.arbeitszeit) {
        fahrt.arbeitszeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit), y: 'Arbeitszeit' }); // Arbeitszeit
        });
    }
    if (fahrt.pause) {
        fahrt.pause.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit), y: 'Pausezeit' }); // Pausezeit
        });
    }
    if (fahrt.ruhezeit) {
        fahrt.ruhezeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit.start), y: 'Ruhezeit' }); // Ruhezeit
            zeitenData.push({ x: new Date(zeit.stop), y: 'Ruhezeit' }); // Ruhezeit
        });
    }

    const canvasRef = useRef<any>(null);


    // Sortiere die Daten nach X-Werten (Zeit)
    zeitenData.sort((a, b) => a.x.getTime() - b.x.getTime());

    // Erstelle das Chart-Datenobjekt
    const data = {
        datasets: [
            {
                label: 'Zeiten',
                data: zeitenData,
                borderColor: 'black',
                backgroundColor: 'black',
                tension: 0,
            },
        ],
    };

    // Definiere Chart-Optionen
    const options: any = {
        maintainAspectRatio: false,
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x',
                    drag: {
                        enabled: true
                    },
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    displayFormats: {
                        millisecond: 'HH:mm:ss.SSS',
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                        hour: 'HH'
                    }
                    // unit: 'hour',
                },
            },
            y: {
                type: 'category',
                barThickness: 2,
                labels: ['Lenkzeit', 'Arbeitszeit', 'Pausezeit', 'Ruhezeit'],
                ticks: {
                    // Hier kannst du die Größe der Y-Achse anpassen
                    font: {
                        size: 15 // Beispiel: setze die Schriftgröße auf 10
                    }
                }
            },
        },
        responsive: true,
    };


    return (
        <div className='line'>
            <Line ref={canvasRef} data={data} options={options} />
            {/* <Button onClick={downloadPDF}>Download</Button> */}

        </div>
    );
};

export default MyChartComponent;
