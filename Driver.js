import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./App.css"; // Ensure correct CSS file is imported

const Driver = () => {
  const [formData, setFormData] = useState({ name: "", contact: "" });
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate(); // Used to navigate to Driver Dashboard

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/drivers")
      .then(response => response.json())
      .then(data => setDrivers(data))
      .catch(error => console.error("Error fetching drivers:", error));
  }, []);
  

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login validation
  const handleLogin = (e) => {
    e.preventDefault();
    const validDriver = drivers.find(
      (driver) =>
        driver.email === formData.email && driver.password === formData.password
    );
  
    if (validDriver) {
      alert(`Login successful! Welcome, ${validDriver.name}`);
      navigate(`/driver-dashboard?name=${validDriver.name}&contact=${validDriver.contact}`);
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };
  


  return (
    <div className="driver-login-container">
      <h1>Driver Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contact Number:</label>
          <input
            type="text"
            name="contact"
            placeholder="Enter your contact number"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Driver;
