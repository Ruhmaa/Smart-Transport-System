import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Hardcoded fee details (unchanged)
const studentFeeDetails = {
  "ruhma@iqra.edu.pk": [
    { id: 2, month: "February", status: "Unpaid", amount: 5000 },
    { id: 4, month: "April", status: "Unpaid", amount: 5000 },
  ],
  "mahrose@iqra.edu.pk": [
    { id: 1, month: "January", status: "Unpaid", amount: 6000 },
    { id: 3, month: "March", status: "Unpaid", amount: 7000 },
  ],
  "huda@iqra.edu.pk": [
    { id: 2, month: "February", status: "Unpaid", amount: 8000 },
    { id: 4, month: "April", status: "Unpaid", amount: 7500 },
  ],
  "zohan@iqra.edu.pk": [
    { id: 1, month: "January", status: "Unpaid", amount: 9000 },
    { id: 3, month: "March", status: "Unpaid", amount: 8500 },
  ],
  "fatima@iqra.edu.pk": [
    { id: 2, month: "February", status: "Unpaid", amount: 5000 },
    { id: 4, month: "April", status: "Unpaid", amount: 4500 },
  ],
};


const SDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("email") || "";

  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showRouteSelection, setShowRouteSelection] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [availableBusTimings, setAvailableBusTimings] = useState([]);

  const userFees = studentFeeDetails[username] || [];
  const totalPending = userFees.reduce(
    (sum, fee) => (fee.status === "Unpaid" ? sum + fee.amount : sum),
    0
  );

  // Fetch available areas (start points) from the backend
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/areas");
        const data = await response.json();
        if (response.ok) {
          setAreas(data);  // Store areas
        } else {
          console.error("Failed to fetch areas");
        }
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };

    fetchAreas();
  }, []);

  // Fetch bus timings and driver details for the selected area
  const handleAreaChange = async (event) => {
    const selectedAreaName = event.target.value;
    setSelectedArea(selectedAreaName);

    // Fetch bus timings and driver details for the selected area
    if (selectedAreaName) {
      try {
        const response = await fetch(
          `http://localhost:5001/api/bus_details?start_point=${encodeURIComponent(selectedAreaName)}`
        );
        const data = await response.json();

        if (response.ok) {
          setAvailableBusTimings(data);
        } else {
          setAvailableBusTimings([]);
        }
      } catch (error) {
        console.error("Error fetching bus timings:", error);
        setAvailableBusTimings([]);
      }
    } else {
      setAvailableBusTimings([]);
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.header}>Student Dashboard</h1>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => setShowPaymentDetails(!showPaymentDetails)}>
          Fee Payment
        </button>
        <button style={styles.button} onClick={() => setShowRouteSelection(!showRouteSelection)}>
          Assign Routes
        </button>
      </div>

      {/* Fee Payment Section */}
      {showPaymentDetails && (
        <div style={styles.paymentSection}>
          <h3>Fee Payment Voucher</h3>
          <p><strong>Student Email:</strong> {username}</p>

          {userFees.length > 0 ? (
            <>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {userFees
                    .filter((fee) => fee.status === "Unpaid")
                    .map((fee) => (
                      <tr key={fee.id}>
                        <td>{fee.month}</td>
                        <td>{fee.amount}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <p><strong>Total Pending Amount:</strong> {totalPending}</p>
              <p>
                You can submit your fees in the university's Habib Bank account
                number:<br />
                <strong>1234-5678-9012</strong>.
              </p>
              <p>
                After payment, please send a screenshot to{" "}
                <strong>accounts.iqra.edu.pk</strong> with your name and Uni ID.
              </p>
            </>
          ) : (
            <p><strong>No pending fees found for {username}.</strong></p>
          )}
        </div>
      )}

      {/* Assign Routes Section */}
      {showRouteSelection && (
        <div style={styles.routeSelection}>
          <h3>Assign Transport Route</h3>

          {/* Select Area */}
          <label style={styles.label}>
            Select Your Area in Karachi:
            <select style={styles.select} value={selectedArea} onChange={handleAreaChange}>
              <option value="">-- Select Area --</option>
              {areas.map((area) => (
                <option key={area.id} value={area.start_point}>{area.start_point}</option>
              ))}
            </select>
          </label>

          {/* Show Available Buses with Timings */}
          {availableBusTimings.length > 0 && (
            <div style={styles.busList}>
              <h4>Available Buses & Timings:</h4>
              <ul>
                {availableBusTimings.map((entry, index) => (
                  <li key={index}>
                    <strong>{entry.timing}</strong> - {entry.vehicle_name} <br />
                    <strong>Driver:</strong> {entry.driver_name} <br />
                    <strong>Contact:</strong> {entry.driver_contact} <br />
                    <strong>Timing:</strong> 8:00AM, 11:30AM, 2:30PM
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* End Terminal Fixed Point */}
          <p><strong>End Terminal:</strong> M9 Motorway Highway</p>
        </div>
      )}
    </div>
  );
};

// Styling for the component (No changes to styling as per your request)
const styles = {
  dashboardContainer: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#f0f4f8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "auto",
  },
  header: {
    textAlign: "center",
    color: "#333",
    fontSize: "24px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    marginTop: "20px",
  },
  button: {
    padding: "12px 25px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "10px",
    width: "220px",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  paymentSection: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "100%",
  },
  routeSelection: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "100%",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    display: "block",
    marginBottom: "10px",
  },
  select: {
    padding: "10px",
    width: "100%",
    borderRadius: "5px",
  },
  busList: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
    },
    tableHeader: {
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "10px",
      textAlign: "center", // **Centers text in the header**
    },
    tableRow: {
      textAlign: "center", // **Centers text in rows**
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
    tableCell: {
      textAlign: "center", // **Centers text in each cell**
      padding: "10px",
    },
    


};

export default SDashboard;
