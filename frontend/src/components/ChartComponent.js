import { Pie, Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    LineElement,
    PointElement,
    Filler
} from 'chart.js';

// Register chart components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    LineElement,
    PointElement,
    Filler
);

// Pie chart component
export const PieChart = ({ chartData }) => {
    return (
        <div className="chart-container">
            <Pie data={chartData} options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 12,
                            padding: 15
                        }
                    },
                    tooltip: { enabled: true }
                }
            }} />
        </div>
    );
};

// Bar chart component
export const BarChart = ({ barChartData }) => {
    return (
        <div className="chart-container">
            <Bar data={barChartData} options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: false, // Remove the legend
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Frequency'
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,  // Set step size to 1 for integer values
                            precision: 0 // Ensure no decimal points
                        }
                    }
                }
            }} />
        </div>
    );
};

// Line chart component
export const LineChart = ({ lineChartData }) => {
    return (
        <div className="chart-container">
            <Line data={lineChartData} options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: { enabled: true }
                },
                scales: {
                    x: {
                        title: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Frequency'
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,  // Set step size to 1 for integer values
                            precision: 0 // Ensure no decimal points
                        }
                    }
                }
            }} />
        </div>
    );
};
