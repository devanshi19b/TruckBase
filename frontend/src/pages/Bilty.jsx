import React, { useState, useEffect } from "react";
import API from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import "./Trips.css";

const emptyForm = {
  biltyNumber: "",
  trip: "",
  consignor: "",
  consignee: "",
  freight: "",
  advance: "",
  balance: ""
};

const Bilty = () => {
  const [bilties, setBilties] = useState([]);
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadBilties();
    loadTrips();
  }, []);

  const loadBilties = async () => {
    try {
      const res = await API.get("/bilties/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBilties(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTrips = async () => {
    try {
      const res = await API.get("/trips/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (bilty) => {
    setEditingId(bilty._id);
    setForm({
      biltyNumber: bilty.biltyNumber,
      trip: bilty.trip?._id || "",
      consignor: bilty.consignor,
      consignee: bilty.consignee,
      freight: bilty.freight,
      advance: bilty.advance,
      balance: bilty.balance
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bilty?")) return;
    try {
      await API.delete(`/bilties/${id}`);
      loadBilties();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/bilties/${editingId}`, form);
      } else {
        await API.post("/bilties", form);
      }
      setShowForm(false);
      loadBilties();
    } catch (err) {
      console.error(err);
      alert("Save Failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="trip-page">
        <div className="trip-top">
          <h2>Bilties Management</h2>
          <button className="btn-primary" onClick={openCreate}>+ Add Bilty</button>
        </div>

        {showForm && (
          <div className="form-panel">
            <form onSubmit={handleSubmit}>
              <h3>{editingId ? "Edit Bilty" : "Add New Bilty"}</h3>
              <div className="grid">
                <input placeholder="Bilty Number" value={form.biltyNumber} onChange={e => setForm({ ...form, biltyNumber: e.target.value })} required />
                <select value={form.trip} onChange={e => setForm({ ...form, trip: e.target.value })}>
                  <option value="">Select Trip</option>
                  {trips.map(t => <option key={t._id} value={t._id}>{t.origin} → {t.destination}</option>)}
                </select>
              </div>
              <div className="grid">
                <input placeholder="Consignor" value={form.consignor} onChange={e => setForm({ ...form, consignor: e.target.value })} required />
                <input placeholder="Consignee" value={form.consignee} onChange={e => setForm({ ...form, consignee: e.target.value })} required />
              </div>
              <div className="grid">
                <input type="number" placeholder="Freight" value={form.freight} onChange={e => setForm({ ...form, freight: e.target.value })} />
                <input type="number" placeholder="Advance" value={form.advance} onChange={e => setForm({ ...form, advance: e.target.value })} />
              </div>
              <div className="grid">
                <input type="number" placeholder="Balance" value={form.balance} onChange={e => setForm({ ...form, balance: e.target.value })} />
              </div>
              <div className="actions">
                <button className="btn-primary">{editingId ? "Update" : "Save"}</button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="trip-table">
          <table>
            <thead>
              <tr>
                <th>Bilty Number</th>
                <th>Trip</th>
                <th>Consignor</th>
                <th>Consignee</th>
                <th>Freight</th>
                <th>Advance</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bilties.length === 0 && <tr><td colSpan={8} className="no-data">No Bilties Found</td></tr>}
              {bilties.map(b => (
                <tr key={b._id}>
                  <td>{b.biltyNumber}</td>
                  <td>{b.trip?.origin} → {b.trip?.destination}</td>
                  <td>{b.consignor}</td>
                  <td>{b.consignee}</td>
                  <td>{b.freight}</td>
                  <td>{b.advance}</td>
                  <td>{b.balance}</td>
                  <td>
                    <button className="btn-edit" onClick={() => openEdit(b)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(b._id)}>Delete</button>
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

export default Bilty;
