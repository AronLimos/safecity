/**
 * SafeCity - Community Crime Reporting Application
 * 
 * @description
 * SafeCity is a web application that allows users to report, track, and analyze crime incidents 
 * in their community. It provides real-time updates, interactive crime statistics, and a secure 
 * platform for managing reports, enhancing both public awareness and law enforcement efficiency.
 * 
 * @authors 
 * - Aron Limos, 000371798
 * - Joash Daligcon, 000358654
 * - Lance Mirano, 000368826
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CreateReportPage from './pages/CreateReportPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UpdateReportPage from './pages/UpdateReportPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-report" element={<CreateReportPage />} />
        <Route path="/edit-report/:id" element={<UpdateReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
