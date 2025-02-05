import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Student/Login"; // Ensure this path is correct
import SignUpPage from "./Student/Signup"; // Ensure this path is correct
import TransportManager from "./TransportManager"; // Ensure this path is correct
import Dashboard from "./Dashboard";
import Driver from "./Driver"; // Ensure this path is correct
import SDashboard from "./Student/SDashboard"; // Ensure this path is correct
import DriverDashboard from "./DriverDashboard"; // Added Driver Dashboard route

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-portal/login" element={<Login />} />
        <Route path="/student-portal/signup" element={<SignUpPage />} />
        <Route path="/transport-manager" element={<TransportManager />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} /> {/* Added Driver Dashboard */}
        <Route path="/student/dashboard" element={<SDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
