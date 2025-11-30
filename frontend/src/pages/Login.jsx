import React, { useState, useContext } from "react";
import "./Login.css";
import API from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input type="password" placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit">Login</button>
        </form>

        <p onClick={() => navigate("/register")} className="link">
          Create an account
        </p>
      </div>
    </div>
  );
};

export default Login;
