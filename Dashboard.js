import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

// Fix marker icon URLs
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [routeDuration, setRouteDuration] = useState(0);
  const [routeCost, setRouteCost] = useState(0);
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    mapRef.current = L.map("map").setView([24.9167, 67.0833], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    L.Control.geocoder().addTo(mapRef.current);

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/trips");
      if (!response.ok) throw new Error("Failed to fetch trips");
      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/vehicles");
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/drivers");
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchVehicles();
    fetchDrivers();
    fetchTrips();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedVehicle || !selectedDriver) {
      alert("Please select a vehicle and driver.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/swap_driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: selectedVehicle,
          driver_id: selectedDriver,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        fetchTrips(); // Refresh trips data after swapping driver
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      alert("Error swapping driver.");
    }
  };
  
  return (
    <div className="dashboard">
      <h1>Transport Manager Dashboard</h1>
      <div id="map" style={{ height: "500px", marginBottom: "20px" }}></div>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <label>
          Select Vehicle:
          <select onChange={(e) => setSelectedVehicle(e.target.value)} required>
            <option value="">--Select--</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name} (Capacity: {vehicle.capacity})
              </option>
            ))}
          </select>
        </label>

        <label>
          Select Driver:
          <select onChange={(e) => setSelectedDriver(e.target.value)} required>
            <option value="">--Select--</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} (Contact: {driver.contact})
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Assign Route</button>
      </form>

      <h2>Assigned Trips</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Start Point</th>
            <th>End Point</th>
            <th>Duration</th>
            <th>Cost (PKR)</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.id}</td>
              <td>{trip.vehicle}</td>
              <td>{trip.driver}</td>
              <td>{trip.start_point}</td>
              <td>{trip.end_point}</td>
              <td>{trip.duration} min</td>
              <td>{trip.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
