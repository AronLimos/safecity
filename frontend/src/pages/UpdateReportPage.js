import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../components/NavbarComponent";
import "../styles/pages/UpdateReportPage.css";

const UpdateReportPage = () => {
    const { id } = useParams();
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [userName, setUserName] = useState("Guest");
    const [message, setMessage] = useState('');
    
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
                    setUserName(res.data.name);
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
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [locRes, catRes, statRes, reportRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/locations', config),
                    axios.get('http://localhost:5000/api/categories', config),
                    axios.get('http://localhost:5000/api/statuses', config),
                    axios.get(`http://localhost:5000/api/reports/${id}`, config),
                ]);

                setLocations(locRes.data);
                setCategories(catRes.data);
                setStatuses(statRes.data);

                const report = reportRes.data;
                setDescription(report.description);
                setLocation(report.location._id);
                setCategory(report.category._id);
                setStatus(report.status._id);
            } catch (err) {
                console.error(err);
                setError('Failed to load report or form data');
            }
        };

        if (token) fetchFormData();
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const updatedData = { location, category, status, description };
            await axios.put(`http://localhost:5000/api/reports/${id}`, updatedData, config);

            setMessage('Report updated successfully!');
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            console.error(err);
            setError('Failed to update report');
        }
    };

    return (
        <>
            <Navbar token={token} userName={userName} />

            <div className="update-report-container">
                <h2 className="update-report-title">Update Crime Report</h2>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                <form className="update-report-form" onSubmit={handleSubmit}>
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
                        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                            <option value="">Select Status</option>
                            {statuses.map(stat => (
                                <option key={stat._id} value={stat._id}>{stat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows="4"
                        />
                    </div>

                    <div className="button-group">
                        <button type="button" className="back-button" onClick={() => navigate('/dashboard')}>
                            Back
                        </button>

                        <button type="submit" className="submit-button">
                            Update Report
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdateReportPage;
