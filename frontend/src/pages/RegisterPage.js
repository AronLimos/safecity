import { useEffect, useState } from 'react';
import Navbar from "../components/NavbarComponent";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/pages/RegisterPage.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [userName, setUserName] = useState("Guest");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role] = useState('citizen');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;

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
                    setUserName("Guest"); // Fallback if there's an error
                }
            };

            fetchUserName();
        }
    }, [token, user]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', { name, email, password, role });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <>
            {/* Navbar Component */}
            <Navbar token={token} userName={userName} />

            <div className="register-page">
                <div className="register-container">
                    <div className="register-image-container">
                        <div className="register-image">
                            <img src="/safecity_v1.png" alt="SafeCity Logo" />
                        </div>
                        <p className="tagline">Track, Report, Protect: Your Crime Watch Network.</p>
                    </div>

                    <div className="register-form-container">
                        <h2>Create an Account with SafeCity</h2>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleRegister}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit" className="register-btn">Register</button>
                        </form>
                        <p>Already have an account?</p>
                        <button onClick={() => navigate('/login')} className="login-btn">Login</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
