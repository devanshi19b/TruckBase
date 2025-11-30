import React, { useState, useEffect } from "react";
import API from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import "./Trucks.css";

const emptyForm = {
  truckNumber: "",
  truckType: "",
  capacity: "",
};

const Trucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadTrucks();
  }, []);

  const loadTrucks = async () => {
    try {
      const res = await API.get("/trucks/all");
      setTrucks(res.data || []);
    } catch (err) {
      console.error("Load trucks error:", err);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (truck) => {
    setEditingId(truck._id);
    setForm({
      truckNumber: truck.truckNumber,
      truckType: truck.truckType,
      capacity: truck.capacity,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this truck?")) return;
    try {
      await API.delete(`/trucks/delete/${id}`);
      loadTrucks();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      capacity: Number(form.capacity),
      user: userId,
    };

    try {
      let savedTruck;

      if (editingId) {
        const res = await API.put(`/trucks/update/${editingId}`, payload);
        savedTruck = res.data;
      } else {
        const res = await API.post("/trucks/add", payload);
        savedTruck = res.data;
      }

      if (imageFile && savedTruck._id) {
        const fd = new FormData();
        fd.append("truckImage", imageFile);

        await API.post(`/trucks/upload-image/${savedTruck._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowForm(false);
      loadTrucks();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="trip-page">
        <div className="trip-top">
          <h2>Trucks Management</h2>
          <button className="btn-primary" onClick={openCreate}>
            + Add Truck
          </button>
        </div>

        {showForm && (
          <div className="form-panel">
            <form onSubmit={handleSubmit}>
              <h3>{editingId ? "Edit Truck" : "Add New Truck"}</h3>

              <div className="grid">
                <input
                  placeholder="Truck Number"
                  value={form.truckNumber}
                  onChange={(e) =>
                    setForm({ ...form, truckNumber: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="Truck Type"
                  value={form.truckType}
                  onChange={(e) =>
                    setForm({ ...form, truckType: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid">
                <input
                  type="number"
                  placeholder="Capacity (tons)"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                  required
                />
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>

              <div className="actions">
                <button className="btn-primary">
                  {editingId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="trip-table">
          <table>
            <thead>
              <tr>
                <th>Truck Number</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {trucks.length === 0 && (
                <tr>
                  <td colSpan={5} className="no-data">
                    No Trucks Found
                  </td>
                </tr>
              )}

              {trucks.map((truck) => (
                <tr key={truck._id}>
                  <td>{truck.truckNumber}</td>
                  <td>{truck.truckType}</td>
                  <td>{truck.capacity}</td>
                  <td>
                    {truck.truckImage ? (
                      <img
                        src={truck.truckImage}
                        alt="truck"
                        style={{ width: 50 }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openEdit(truck)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(truck._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Trucks;
