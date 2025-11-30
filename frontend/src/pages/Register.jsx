import React, { useState, useContext } from "react";
import "./Register.css";
import API from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    number: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", form);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <input
            type="text"
            placeholder="Company Name"
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />

          <input
            type="text"
            placeholder="Mobile Number"
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />

          <button type="submit">Register</button>
        </form>

        <p onClick={() => navigate("/login")} className="link">
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default Register;
