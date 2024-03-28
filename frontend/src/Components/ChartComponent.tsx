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
    const [loader, setLoader] = useState(false)

    if (fahrt.lenkzeit) {
        fahrt.lenkzeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit.start), y: 'Lenkzeit' }); // Lenkzeit
            zeitenData.push({ x: new Date(zeit.stop), y: 'Lenkzeit' }); // Lenkzeit
        });
    }
    if (fahrt.arbeitszeit) {
        fahrt.arbeitszeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit.start), y: 'Arbeitszeit' }); // Arbeitszeit
            zeitenData.push({ x: new Date(zeit.stop), y: 'Arbeitszeit' }); // Arbeitszeit
        });
    }
    if (fahrt.pause) {
        fahrt.pause.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit.start), y: 'Pausezeit' }); // Pausezeit
            zeitenData.push({ x: new Date(zeit.stop), y: 'Pausezeit' }); // Pausezeit
        });
    }
    if (fahrt.ruhezeit) {
        fahrt.ruhezeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit.start), y: 'Ruhezeit' }); // Ruhezeit
            zeitenData.push({ x: new Date(zeit.stop), y: 'Ruhezeit' }); // Ruhezeit
        });
    }

    const canvasRef = useRef<any>(null);


    // const downloadImage = useCallback(() => {
    //     if (canvasRef.current) {
    //         const link = document.createElement("a")
    //         link.download = "chart.png"
    //         link.href = canvasRef.current!.toBase64Image()
    //         link.click()
    //     } else {
    //         console.error("Es gabe ein Fehler beim Download.")
    //     }
    // }, [])






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

