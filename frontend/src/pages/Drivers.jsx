import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../api/axios";
import "./Drivers.css";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    phone: "",
    licenseNumber: "",
    aadharNumber: "",
    address: "",
    remarks: "",
  };

  const [form, setForm] = useState(emptyForm);

  // ------------------ LOAD ALL DRIVERS ------------------
  const loadDrivers = async () => {
    try {
      const { data } = await API.get("/drivers"); // FIXED ROUTE
      setDrivers(data);
    } catch (err) {
      console.error("Error loading drivers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  // ------------------ ADD OR UPDATE DRIVER ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/drivers/update/${editingId}`, form);
        alert("Driver updated successfully!");
      } else {
        await API.post("/drivers/add", form);
        alert("Driver added successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      loadDrivers();
    } catch (err) {
      console.error("Save Driver Error:", err);
      alert("Failed to save driver");
    }
  };

  // ------------------ EDIT DRIVER ------------------
  const handleEdit = (driver) => {
    setForm({
      name: driver.name,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      aadharNumber: driver.aadharNumber,
      address: driver.address || "",
      remarks: driver.remarks || "",
    });
    setEditingId(driver._id);
    setShowForm(true);
  };

  // ------------------ DELETE DRIVER ------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await API.delete(`/drivers/delete/${id}`);
      alert("Driver deleted successfully!");
      loadDrivers();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete driver");
    }
  };

  return (
    <DashboardLayout>
      <div className="drivers-container">
        <div className="header-section">
          <h2>Drivers</h2>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "Add Driver"}
          </button>
        </div>

        {/* --------------------- FORM ----------------------- */}
        {showForm && (
          <form className="driver-form" onSubmit={handleSubmit}>
            <input
              placeholder="Driver Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <input
              placeholder="License Number"
              value={form.licenseNumber}
              onChange={(e) =>
                setForm({ ...form, licenseNumber: e.target.value })
              }
              required
            />
            <input
              placeholder="Aadhar Number"
              value={form.aadharNumber}
              onChange={(e) =>
                setForm({ ...form, aadharNumber: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <textarea
              placeholder="Remarks"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />

            <button type="submit">{editingId ? "Update" : "Save"}</button>
          </form>
        )}

        {/* --------------------- DRIVER LIST ----------------------- */}
        <div className="driver-list">
          {loading ? (
            <p>Loading drivers...</p>
          ) : drivers.length === 0 ? (
            <p>No drivers found.</p>
          ) : (
            drivers.map((driver) => (
              <div key={driver._id} className="driver-card">
                <h3>{driver.name}</h3>
                <p><strong>Phone:</strong> {driver.phone}</p>
                <p><strong>License:</strong> {driver.licenseNumber}</p>
                <p><strong>Aadhar:</strong> {driver.aadharNumber}</p>
                <p><strong>Address:</strong> {driver.address || "N/A"}</p>

                <div className="actions">
                  <button onClick={() => handleEdit(driver)}>Edit</button>
                  <button onClick={() => handleDelete(driver._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Drivers;
