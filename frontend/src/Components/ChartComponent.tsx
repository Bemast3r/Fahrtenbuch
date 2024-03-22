//@ts-ignore
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



// Registriere erforderliche Chart.js-Komponenten
ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    CategoryScale,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MyChartComponentProps {
    fahrt: FahrtResource;
}

const MyChartComponent: React.FC<MyChartComponentProps> = ({ fahrt }) => {
    // Definiere Chart-Optionen

    const data = {
        labels: ['2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05', '2024-11-06'],

        datasets: [
            {
                label: 'lenkzeit',
                data: [3, 6, 5, 10, 1],
                borderColor: 'black',
                backgroundColor: 'aqua',
                tension: 0
            }
        ]
    };

    const options: any = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour'
                },
                ticks: {
                    source: 'auto'
                }
            },
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        // maintainAspectRatio: false // This makes the chart responsive
    };

    return (
        <div>
            {/* Verwende das Line-Komponente von react-chartjs-2 */}

            <Line options={options} data={data} />
        </div>
    );
};

export default MyChartComponent;
