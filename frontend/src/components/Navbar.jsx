import React from "react";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <h3>Transport Management System</h3>
      <div className="user-info">Admin</div>
    </nav>
  );
};

export default Navbar;
