import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/NavbarComponent";
import '../styles/pages/CreateReportPage.css';

const CreateReportPage = () => {
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [, setStatuses] = useState([]);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [userName, setUserName] = useState("Guest");

    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchUserName = async () => {
                try {
                    const decoded = jwtDecode(token);
                    const userId = decoded.id || decoded._id;

                    const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const user = res.data;
                    setUserName(user.name);
                } catch (err) {
                    console.error(err);
                    setUserName("Guest");
                }
            };

            fetchUserName();
        }
    }, [token, user]);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const [locRes, catRes, statRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/locations', config),
                    axios.get('http://localhost:5000/api/categories', config),
                    axios.get('http://localhost:5000/api/statuses', config),
                ]);

                setLocations(locRes.data);
                setCategories(catRes.data);
                setStatuses(statRes.data);

                // Set default status as "under investigation"
                const defaultStatus = statRes.data.find(status => status.name === 'Under Investigation');
                if (defaultStatus) {
                    setStatus(defaultStatus._id);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load form options');
            }
        };

        if (token) fetchFormData();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const reportData = {
                user: user.id,
                location,
                category,
                status,
                description,
            };

            await axios.post('http://localhost:5000/api/reports', reportData, config);
            setMessage('Report created successfully');

            setDescription('');
            setLocation('');
            setCategory('');
            setStatus('');

            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            console.error(err);
            setError('Failed to create report');
        }
    };

    return (
        <>
            <Navbar token={token} userName={userName} />

            <div className="create-report-container">
                <h2 className="create-report-title">Create New Report</h2>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Location:</label>
                        <select value={location} onChange={(e) => setLocation(e.target.value)} required>
                            <option value="">Select Location</option>
                            {locations.map(loc => (
                                <option key={loc._id} value={loc._id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <select value={status} disabled> {/* Disable the status dropdown */}
                            <option value="">{status ? 'Under Investigation' : 'Loading...'}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" />
                    </div>

                    <div className="button-group">
                        <button type="button" className="back-button" onClick={() => navigate('/dashboard')}>Back</button>
                        <button type="submit" className="submit-button">Submit Report</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateReportPage;
