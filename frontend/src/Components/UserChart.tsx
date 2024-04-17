



import "./chartcomponent.css"
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js/auto';

import "chartjs-adapter-date-fns";
import { Doughnut } from 'react-chartjs-2';
import { useRef } from "react";

// Registriere erforderliche Chart.js-Komponenten
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const UserChart: React.FC<{ gesamt: number, user: number, admin: number }> = ({ gesamt, user, admin }) => {

    const canvasRef = useRef<any>(null);
    // Erstelle das Chart-Datenobjekt
    const data = {
        labels: ["Gesamtanzahl der Fahrten'", "Beendeten Fahrten", "Laufende Fahrten"],
        datasets: [
            {
                label: 'Fahrtstatistik',
                data: [gesamt, user, admin],
                borderColor: ['orange', 'pink', 'yellow'],
                backgroundColor: ['orange', 'pink', 'yellow'],
            },
        ],
    };

    // Definiere Chart-Optionen

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: 'white' // Ändere die Farbe der Legendentexte auf Weiß
                }
            }
        }
    };

    return (
        <div className='fahrtenChart'>
            <Doughnut ref={canvasRef} data={data} options={options} className="fahrtenChart" />
            {/* <Button onClick={downloadPDF}>Download</Button> */}

        </div>
    );
};

export default UserChart;

