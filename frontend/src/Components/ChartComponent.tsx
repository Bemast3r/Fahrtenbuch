
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { FahrtResource } from '../util/Resources';

// Registriere erforderliche Chart.js-Komponenten
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
export const options = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: 'Ihre Fahrt',
        },
    },
    scales: {
        x:{
            type:"time",
            time:{
                unit: 'hour'
            }
        },
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

const MyChartComponent = ( chartData : FahrtResource) => {
    // Definiere Chart-Optionen

    const hours24Format = Array.from({ length: 25 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    console.log(hours24Format);

    // Generiere Testdaten für das Diagramm
    const labels = hours24Format;
    const data = {
        labels,
        datasets: [
            {
                label: 'Lenkzeit',
                // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                data: labels.map(() => chartData.lenkzeit),

                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Arbeitszeit',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Ruhezeit',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                // data:
                borderColor: 'rgb(93, 122, 190)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Pause',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: 'rgb(90, 142, 205)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };


    return (
        <div>
            {/* Verwende das Line-Komponente von react-chartjs-2 */}
            {/* <Line options={options} data={data} /> */}
            
        </div>
    );
};

export default MyChartComponent;
