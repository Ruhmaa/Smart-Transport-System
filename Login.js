import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import the CSS file

const students = [
  { email: "ruhma@iqra.edu.pk", password: "ruhma123" },
  { email: "mahrose@iqra.edu.pk", password: "mahrose123" },
  { email: "huda@iqra.edu.pk", password: "huda123" },
  { email: "ahmed@iqra.edu.pk", password: "ahmed123" },
  { email: "fatima@iqra.edu.pk", password: "fatima123" },
];

const Login = () => {
  const [formData, setFormData] = useState({
    universityEmail: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = students.find(
      (student) => student.email === formData.universityEmail && student.password === formData.password
    );

    if (user) {
      setMessage("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate(`/student/dashboard?email=${user.email}`);
      }, 2000);
    } else {
      setMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Student Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="universityEmail"
          value={formData.universityEmail}
          onChange={handleChange}
          placeholder="Enter your University email"
          required
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}

      <p className="forgot-password">
        Forget password? Contact Student Affairs!
      </p>
    </div>
  );
};

export default Login;
