import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Trips", path: "/trips" },
    { name: "Trucks", path: "/trucks" },
    { name: "Drivers", path: "/drivers" },
    { name: "Bilties", path: "/bilties" },
    { name: "Export", path: "/export" },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>TransportSys</h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
