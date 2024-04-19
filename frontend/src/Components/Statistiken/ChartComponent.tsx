import "./chartcomponent.css"
import {
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
import { FahrtResource } from '../../util/Resources';
import Zoom from 'chartjs-plugin-zoom';
import zoomPlugin from 'chartjs-plugin-zoom';

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
    const zeitenData: { x: Date; y: string; }[] = [];

    if (fahrt.lenkzeit) {
        fahrt.lenkzeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit), y: 'Lenkzeit' }); 
        });
    }
    if (fahrt.arbeitszeit) {
        fahrt.arbeitszeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit), y: 'Arbeitszeit' }); 
        });
    }
    if (fahrt.pause) {
        fahrt.pause.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit), y: 'Pausezeit' }); 
        });
    }
    if (fahrt.ruhezeit) {
        fahrt.ruhezeit.forEach(zeit => {
            zeitenData.push({ x: new Date(zeit.start), y: 'Ruhezeit' }); 
            zeitenData.push({ x: new Date(zeit.stop), y: 'Ruhezeit' }); 
        });
    }

    zeitenData.sort((a, b) => a.x.getTime() - b.x.getTime());

    
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
                    
                },
            },
            y: {
                type: 'category',
                barThickness: 2,
                labels: ['Lenkzeit', 'Arbeitszeit', 'Pausezeit', 'Ruhezeit'],
                ticks: {
                    
                    font: {
                        size: 15
                    }
                }
            },
        },
        responsive: true,
    };


    return (
        <div className='line'>
            <Line data={data} options={options} />

        </div>
    );
};

export default MyChartComponent;

