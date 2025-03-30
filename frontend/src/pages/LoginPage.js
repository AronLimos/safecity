import { useEffect, useState } from 'react';
import Navbar from "../components/NavbarComponent";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/pages/LoginPage.css';

const LoginPage = () => {
    const [userName, setUserName] = useState("Guest");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');  // Navigate to the register page
    };

    return (
        <>
            {/* Navbar Component */}
            <Navbar token={token} userName={userName} />

            <div className="login-page">
                <div className="login-container">
                    <div className="login-image-container">
                        <div className="login-image">
                            <img src="/safecity_v1.png" alt="SafeCity Logo" />
                        </div>
                        <p className="tagline">Track, Report, Protect: Your Crime Watch Network.</p>
                    </div>

                    <div className="login-form-container">
                        <h2>Access your SafeCity Account</h2>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleLogin}>
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
                            <button type="submit" className="login-btn">Login</button>
                        </form>
                        <p>Don't have an account?</p>
                        <button onClick={handleRegisterRedirect} className="register-btn">Register</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
