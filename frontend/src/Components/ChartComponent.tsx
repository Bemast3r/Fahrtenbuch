import Chart from 'chart.js/auto';
import {
    Chart as ChartJS,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';

import "chartjs-adapter-date-fns"
import { Line } from 'react-chartjs-2';
import { FahrtResource } from '../util/Resources';
import Zoom from 'chartjs-plugin-zoom';



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
    Zoom
);


const MyChartComponent: React.FC<{ fahrt: FahrtResource }> = ({ fahrt }) => {
    // Extrahiere die Zeiten aus der FahrtResource und konvertiere sie in Date-Objekte mit Kennungen
    const zeitenData: { x: Date; y: string; }[] = [];
    const lenkzeitData: { x: Date; y: string; }[] = [];
    const arbeitszeitData: { x: Date; y: string; }[] = [];
    const pauseData: { x: Date; y: string; }[] = [];
    const ruhezeitData: { x: Date; y: string; }[] = [];

    if (fahrt.lenkzeit) {
        fahrt.lenkzeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit.start), y: 'Lenkzeit' }); // Lenkzeit
            zeitenData.push({ x: new Date(zeit.stop), y: 'Lenkzeit' }); // Lenkzeit
            lenkzeitData.push({ x: new Date(zeit.start), y: 'Lenkzeit' }); // Lenkzeit
            lenkzeitData.push({ x: new Date(zeit.stop), y: 'Lenkzeit' }); // Lenkzeit
        });
    }
    if (fahrt.arbeitszeit) {
        fahrt.arbeitszeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit.start), y: 'Arbeitszeit' }); // Arbeitszeit
            zeitenData.push({ x: new Date(zeit.stop), y: 'Arbeitszeit' }); // Arbeitszeit
            arbeitszeitData.push({ x: new Date(zeit.start), y: 'Arbeitszeit' }); // Arbeitszeit
            arbeitszeitData.push({ x: new Date(zeit.stop), y: 'Arbeitszeit' }); // Arbeitszeit
        });
    }
    if (fahrt.pause) {
        fahrt.pause.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit.start), y: 'Pausezeit' }); // Pausezeit
            zeitenData.push({ x: new Date(zeit.stop), y: 'Pausezeit' }); // Pausezeit
            pauseData.push({ x: new Date(zeit.start), y: 'Pausezeit' }); // Arbeitszeit
            pauseData.push({ x: new Date(zeit.stop), y: 'Pausezeit' }); // Arbeitszeit
        });
    }
    if (fahrt.ruhezeit) {
        fahrt.ruhezeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit.start), y: 'Ruhezeit' }); // Ruhezeit
            zeitenData.push({ x: new Date(zeit.stop), y: 'Ruhezeit' }); // Ruhezeit
            ruhezeitData.push({ x: new Date(zeit.start), y: 'Ruhezeit' }); // Arbeitszeit
            ruhezeitData.push({ x: new Date(zeit.stop), y: 'Ruhezeit' }); // Arbeitszeit
        });
    }

    // Sortiere die Daten nach X-Werten (Zeit)
    zeitenData.sort((a, b) => a.x.getTime() - b.x.getTime());

    // Erstelle das Chart-Datenobjekt
    const data = {
        datasets: [
            {
                label: 'Zeiten',
                data: zeitenData,
                borderColor: 'black',
                backgroundColor: 'aqua',
                tension: 0,
            },
            {
                label: 'Lenkzeit',
                data: lenkzeitData,
                borderColor: 'pink',
                backgroundColor: 'pink',
                tension: 0,
                fill: false
            },
            {
                label: 'Arbeitszeit',
                data: arbeitszeitData,
                borderColor: 'brown',
                backgroundColor: 'brown',
                tension: 0,
                fill: false
            },
            {
                label: 'Ruhezeit',
                data: ruhezeitData,
                borderColor: 'black',
                backgroundColor: 'white',
                tension: 0,
                fill: false
            },
            {
                label: 'Pause',
                data: pauseData,
                borderColor: 'black',
                backgroundColor: 'black',
                tension: 0,
                fill: false
            },
        ],
    };

    // Definiere Chart-Optionen
    const options: any = {

        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                },
            },
            y: {
                type: 'category',
                labels: ['Lenkzeit', 'Arbeitszeit', 'Pausezeit', 'Ruhezeit'],
            },
        },
        responsive: true,
    };
    return (
        <div>
            <Line data={data} options={options} />
        </div>
    );
};

export default MyChartComponent;
