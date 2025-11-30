import React, { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import "./Export.css";

const ExportPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await API.get("/trips/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(res.data || []);
    } catch (err) {
      console.error("Error loading trips:", err);
      alert("Failed to load trips");
    }
    setLoading(false);
  };

  const handleExport = async (tripId) => {
    if (!tripId) return alert("No trip selected for export");
    try {
      const res = await API.get(`/bilties/pdf/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bilty-${tripId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
      alert("Export Failed");
    }
  };


  return (
    <DashboardLayout>
      <div className="trip-page">
        <div className="trip-top">
          <h2>Export Trips</h2>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="trip-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Route</th>
                  <th>Truck</th>
                  <th>Driver</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trips.length === 0 && (
                  <tr>
                    <td colSpan={5} className="no-data">
                      No Trips Found
                    </td>
                  </tr>
                )}
                {trips.map((trip) => (
                  <tr key={trip._id}>
                    <td>{trip.date?.split("T")[0]}</td>
                    <td>
                      {trip.origin} → {trip.destination}
                    </td>
                    <td>{trip.truck?.truckNumber || "-"}</td>
                    <td>{trip.driver?.name || "-"}</td>
                    <td>
                      <button
                        className="btn-export"
                        onClick={() => handleExport(trip._id)}
                      >
                        Export PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExportPage;
