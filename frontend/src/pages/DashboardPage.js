import { useEffect, useState } from 'react';
import Navbar from "../components/NavbarComponent";
import axios from 'axios';
import { PieChart, BarChart, LineChart } from '../components/ChartComponent';
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
import { jwtDecode } from 'jwt-decode';
import '../styles/pages/DashboardPage.css';

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

const DashboardPage = () => {
    const [reports, setReports] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [selectedLocation, setSelectedLocation] = useState('All Location');
    const [selectedCategory, setSelectedCategory] = useState('All Category');
    const [searchTerm, setSearchTerm] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');

    const [pieChartData, setPieChartData] = useState(null);
    const [barChartData, setBarChartData] = useState(null);
    const [lineChartData, setLineChartData] = useState(null);

    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const capitalize = (text) => {
        if (!text) return 'N/A';
        return text
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const userId = decoded.id || decoded._id;

                    const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const user = res.data;
                    setUserName(user.name);
                    setUserRole(user.role || '');
                } catch (err) {
                    console.error('Failed to fetch user data:', err);
                }
            }
        };

        fetchUserInfo();
    }, [token]);

    const updatePieChartData = (reportList) => {
        const statusCounts = {};
        reportList.forEach((report) => {
            const status = report.status.name || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        setPieChartData({
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    label: 'Reports by Status',
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#1F77B4', // Dark Blue
                        '#636363', // Dark Gray
                        '#9ECAE1', // Light Blue
                    ],
                    borderColor: '#fff',
                    borderWidth: 1,
                },
            ],
        });
    };

    const updateBarChartData = (reportList) => {
        const locationCounts = {};
    
        reportList.forEach((report) => {
            const location = report.location.name || 'Unknown';
            locationCounts[location] = (locationCounts[location] || 0) + 1;
        });
    
        // Sort locations alphabetically
        const sortedLocations = Object.keys(locationCounts).sort();
        const sortedData = sortedLocations.map(location => locationCounts[location]);
    
        // Fixed 8 shades of blue and gray
        const barColors = [
            '#1F77B4', // Dark Blue
            '#6BAED6', // Medium Blue
            '#9ECAE1', // Light Blue
            '#C6DBEF', // Very Light Blue
            '#636363', // Dark Gray
            '#969696', // Medium Gray
            '#BDBDBD', // Light Gray
            '#D9D9D9', // Very Light Gray
        ];
    
        // Assign colors only to the first 8 locations, others remain default
        const assignedColors = sortedLocations.map((_, index) => (index < 8 ? barColors[index] : '#D3D3D3')); // Default light gray for extras
    
        setBarChartData({
            labels: sortedLocations, // Alphabetically sorted labels
            datasets: [
                {
                    label: 'Reports by Location',
                    data: sortedData, // Keep the data aligned with sorted labels
                    backgroundColor: assignedColors, // Use fixed 8 colors
                    borderColor: '#fff',
                    borderWidth: 1,
                },
            ],
        });
    };
    
    const updateLineChartData = (reportList) => {
        const reportDates = {};
    
        // Count crime reports per day
        reportList.forEach((report) => {
            const dateObj = new Date(report.reported);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }); // Format: MM/DD
            reportDates[dateStr] = (reportDates[dateStr] || 0) + 1;
        });
    
        // Get the start of the current week (Sunday)
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    
        // Generate labels with day names and corresponding crime counts
        const daysOfWeek = [];
        const chartData = [];
    
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);
    
            const dateStr = currentDay.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }); // MM/DD format
            const dayName = currentDay.toLocaleDateString('en-US', { weekday: 'long' }); // Monday, Tuesday, etc.
    
            daysOfWeek.push(`${dayName} (${dateStr})`); // Label format: "Monday (MM/DD)"
            chartData.push(reportDates[dateStr] || 0); // Use 0 if no reports
        }
    
        // Update the chart data
        setLineChartData({
            labels: daysOfWeek,
            datasets: [
                {
                    label: 'Reports Over Time',
                    data: chartData,
                    fill: true,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderWidth: 2,
                    tension: 0, // No smooth line
                }
            ],
        });
    };    
    
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/reports', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const allStatuses = new Set();
                const allLocations = new Set();
                const allCategories = new Set();

                res.data.forEach((report) => {
                    allStatuses.add(report.status.name || 'Unknown');
                    allLocations.add(report.location.name || 'Unknown');
                    allCategories.add(report.category.name || 'Unknown');
                });

                setReports(res.data);
                setStatuses(['All Status', ...Array.from(allStatuses)]);
                setLocations(['All Location', ...Array.from(allLocations)]);
                setCategories(['All Category', ...Array.from(allCategories)]);

                updatePieChartData(res.data);
                updateBarChartData(res.data);
                updateLineChartData(res.data);

            } catch (err) {
                console.error(err);
                setError('Failed to load reports');
            }
        };

        fetchReports();
    }, [token]);

    const handleEdit = (id) => {
        window.location.href = `/edit-report/${id}`;
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updated = reports.filter((r) => r._id !== id);
            setReports(updated);
            updatePieChartData(updated);
            updateBarChartData(updated);
            updateLineChartData(updated);
        } catch (err) {
            console.error('Delete failed:', err.response?.data || err.message);
            alert('Failed to delete report.');
        }
    };

    const filteredReports = reports.filter((r) => {
        const matchesStatus =
            selectedStatus === 'All Status' ||
            r.status.name.toLowerCase() === selectedStatus.toLowerCase();
    
        const matchesLocation =
            selectedLocation === 'All Location' ||
            r.location.name.toLowerCase() === selectedLocation.toLowerCase();
    
        const matchesCategory =
            selectedCategory === 'All Category' ||
            r.category.name.toLowerCase() === selectedCategory.toLowerCase();
    
        const matchesSearch =
            r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
        return matchesStatus && matchesLocation && matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.reported) - new Date(a.reported)); // Sort by reported date, latest first

    return (
        <>
            <Navbar token={token} userName={userName} />

            <div className="container">
                <div className="dashboard-content">
                    <div className="report-section">
                        <div className="header-container">
                            <h3>Crime Reports</h3>

                            {token && (
                            <button 
                                onClick={() => window.location.href = '/create-report'} 
                                className="create-report-button"
                            >
                                Report a crime
                            </button>
                            )}
                        </div>

                        <div className="filter-container">
                            {[{
                                value: selectedLocation,
                                setter: setSelectedLocation,
                                options: locations
                            }, {
                                value: selectedCategory,
                                setter: setSelectedCategory,
                                options: categories
                            }, {
                                value: selectedStatus,
                                setter: setSelectedStatus,
                                options: statuses
                            }].map(({ value, setter, options }, i) => (
                                <select
                                    key={i}
                                    value={value}
                                    onChange={(e) => setter(e.target.value)}
                                    className="filter-select"
                                >
                                    {options.map((opt) => (
                                        <option key={opt} value={opt}>{capitalize(opt)}</option>
                                    ))}
                                </select>
                            ))}
                            <input
                                type="text"
                                placeholder="Search username or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="filter-input"
                            />
                        </div>

                        {/* Tweet-like Feed */}
                        <div className="feed-container">
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <div key={report._id} className="tweet-card">
                                        <div className="tweet-header">
                                            <div className="header-left">
                                                <strong>{report.user.name}</strong>
                                                <span className="tweet-date">{new Date(report.reported).toLocaleString()}</span>
                                            </div>
                                            <div className="header-right">
                                                {token && (
                                                    <div className="tweet-actions">
                                                        {(userRole === 'admin' || userRole === 'officer') && (
                                                            <button className="edit-btn" onClick={() => handleEdit(report._id)}>
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                        )}
                                                        {(userRole === 'admin' || report.user.name === userName) && (
                                                            <button className="delete-btn" onClick={() => handleDelete(report._id)}>
                                                                <i className="fas fa-trash-alt"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="tweet-body">
                                            <p>{report.description}</p>
                                        </div>
                                        <div className="tweet-footer">
                                            <span className="tweet-location">Location: <b>{report.location.name}</b></span>
                                            <span className="tweet-category">Category: <b>{capitalize(report.category.name)}</b></span>
                                            <span className="tweet-status">Status: <b>{capitalize(report.status.name)}</b></span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No reports found.</p>
                            )}
                        </div>
                    </div>

                    <div className="chart-section">
                        {/* Label for Error Handling */}
                        {error && <p className="error-message">{error}</p>}

                        <div className="quadrant-container">
                            <div className="quadrant" id="A-B">
                                <h3 className="chart-title">Crime Trends Over Time</h3>
                                {lineChartData && <LineChart lineChartData={lineChartData} />}
                            </div>
                            <div className="quadrant" id="C">
                                <h3 className="chart-title">Crime Frequency by Location</h3>
                                {barChartData && <BarChart barChartData={barChartData} />}
                            </div>
                            <div className="quadrant" id="D">
                                <h3 className="chart-title">Crime Status Distribution</h3>
                                {pieChartData && <PieChart chartData={pieChartData} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;

