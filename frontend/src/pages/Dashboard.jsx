import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../api/axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalDrivers: 0,
    totalTrucks: 0,
    totalBilties: 0,
    pendingPayments: 0,
    completedTrips: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/dashboard/stats");
      setStats(res.data.stats || {});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <h2>Dashboard</h2>

        <div className="dashboard-cards">
          <div className="card">
            <h3>Total Trips</h3>
            <span>{stats.totalTrips}</span>
          </div>
          <div className="card">
            <h3>Total Trucks</h3>
            <span>{stats.totalTrucks}</span>
          </div>
          <div className="card">
            <h3>Total Drivers</h3>
            <span>{stats.totalDrivers}</span>
          </div>
          <div className="card">
            <h3>Total Bilties</h3>
            <span>{stats.totalBilties}</span>
          </div>
          <div className="card">
            <h3>Pending Payments</h3>
            <span>₹ {stats.pendingPayments}</span>
          </div>
          <div className="card">
            <h3>Completed Trips</h3>
            <span>{stats.completedTrips}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
