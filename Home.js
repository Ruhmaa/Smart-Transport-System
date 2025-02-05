import React from "react";
import { Link } from "react-router-dom";
import './App.css';

const Home = () => {
  return (
    <div className="container">
      <header>
        <h1>Welcome to the Smart Transport System</h1>
        <h2>Choose your role to proceed:</h2>
      </header>
      <div className="portal-container">
        <div className="portal">
          <h3>Student Portal</h3>
          <p>Register as a student to access transport services.</p>
          <Link to="/student-portal/login">
            <button>Go to Student Portal</button>
          </Link>
        </div>
        <div className="portal">
          <h3>Transport Manager</h3>
          <p>Manage vehicles, routes, and transport operations.</p>
          <Link to="/transport-manager">
            <button>Go to Transport Manager</button>
          </Link>
        </div>
        <div className="portal">
          <h3>Driver</h3>
          <p>View and manage pick/drop details.</p>
          <Link to="/driver">
            <button>Go to Driver</button>
          </Link>
        </div>
      </div>
      <footer>© 2025 Smart Transport Management System. All rights reserved.</footer>
    </div>
  );
};

export default Home;