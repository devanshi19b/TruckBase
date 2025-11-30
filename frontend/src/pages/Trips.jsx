// src/pages/Trips.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../api/axios";
import "./Trips.css";

const emptyForm = {
  date: "",
  origin: "",
  destination: "",
  truck: "",
  driver: "",
  biltyNumber: "",
  consignor: "",
  consignorGstNumber: "",
  consignee: "",
  consigneeGstNumber: "",
  goodsDescription: "",
  weight: "",
  freight: "",
  advance: "",
  balance: "",
  privateMarka: "",
  invoiceNumber: "",
  invoiceDate: "",
  invoiceAmount: "",
  ewayBillNumber: "",
  remarks: "",
};

const Trips = () => {
  const [form, setForm] = useState(emptyForm);
  const [trips, setTrips] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [invoiceImage, setInvoiceImage] = useState(null);
  const [ewayBillImage, setEwayBillImage] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);

  const loadDrivers = async () => {
    try {
      const res = await API.get("/drivers/all");
      setDrivers(res.data || []);
    } catch (err) {
      console.error("Load drivers error:", err);
      setDrivers([]);
    }
  };

  const loadTrucks = async () => {
    try {
      const res = await API.get("/trucks/all");
      setTrucks(res.data || []);
    } catch (err) {
      console.error("Load trucks error:", err);
      setTrucks([]);
    }
  };

  const loadTrips = async () => {
    try {
      const res = await API.get("/trips/all");
      setTrips(res.data?.trips || []);
    } catch (err) {
      console.error("Load trips error:", err);
      setTrips([]);
    }
  };

  useEffect(() => {
    loadDrivers();
    loadTrucks();
    loadTrips();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleInvoiceFile = (e) => setInvoiceImage(e.target.files[0] || null);
  const handleEwayFile = (e) => setEwayBillImage(e.target.files[0] || null);
  const handleDocs = (e) => setDocuments(Array.from(e.target.files || []));

  const resetForm = () => {
    setForm(emptyForm);
    setInvoiceImage(null);
    setEwayBillImage(null);
    setDocuments([]);
    setEditingId(null);
  };

  const validateClient = () => {
    const required = ["origin", "destination", "truck", "driver", "biltyNumber", "consignor", "consignee", "weight"];
    for (let f of required) {
      if (!form[f] && form[f] !== 0) {
        return `Please fill ${f}`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientError = validateClient();
    if (clientError) return alert(clientError);

    setLoadingSave(true);
    try {
      const fd = new FormData();

      // append text fields (only non-empty)
      Object.keys(form).forEach((k) => {
        const val = form[k];
        if (val !== undefined && val !== null && val !== "") {
          fd.append(k, val);
        }
      });

      // append files with exact field names backend expects
      if (invoiceImage) fd.append("invoiceImage", invoiceImage);
      if (ewayBillImage) fd.append("ewayBillImage", ewayBillImage);
      documents.forEach((doc) => fd.append("documents", doc));

      if (editingId) {
        await API.put(`/trips/update/${editingId}`, fd); // do not set Content-Type header
      } else {
        await API.post("/trips/add", fd);
      }

      alert("Trip saved");
      resetForm();
      setShowForm(false);
      loadTrips();
    } catch (err) {
      console.error("Trip submit error:", err?.response || err);
      const msg = err?.response?.data?.message || "Save failed — see console";
      alert(msg);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleEdit = (t) => {
    setShowForm(true);
    setEditingId(t._id);
    setForm({
      date: t.date ? t.date.split("T")[0] : "",
      origin: t.origin || "",
      destination: t.destination || "",
      truck: t.truck?._id || t.truck || "",
      driver: t.driver?._id || t.driver || "",
      biltyNumber: t.biltyNumber || "",
      consignor: t.consignor || "",
      consignorGstNumber: t.consignorGstNumber || "",
      consignee: t.consignee || "",
      consigneeGstNumber: t.consigneeGstNumber || "",
      goodsDescription: t.goodsDescription || "",
      weight: t.weight || "",
      freight: t.freight || "",
      advance: t.advance || "",
      balance: t.balance || "",
      privateMarka: t.privateMarka || "",
      invoiceNumber: t.invoiceNumber || "",
      invoiceDate: t.invoiceDate || "",
      invoiceAmount: t.invoiceAmount || "",
      ewayBillNumber: t.ewayBillNumber || "",
      remarks: t.remarks || "",
    });

    // clear file inputs so user may re-upload if desired
    setInvoiceImage(null);
    setEwayBillImage(null);
    setDocuments([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip?")) return;
    try {
      await API.delete(`/trips/delete/${id}`);
      loadTrips();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="trip-page">
        <div className="trip-top">
          <h2>Trips (Bilty)</h2>
          <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Close" : "Add Trip"}
          </button>
        </div>

        {showForm && (
          <div className="form-panel">
            <form onSubmit={handleSubmit}>
              <div className="grid">
                <input type="date" name="date" value={form.date} onChange={handleChange} />

                <input name="origin" placeholder="Origin" value={form.origin} onChange={handleChange} required />

                <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} required />

                <input name="biltyNumber" placeholder="Bilty Number" value={form.biltyNumber} onChange={handleChange} required />

                <input name="consignor" placeholder="Consignor" value={form.consignor} onChange={handleChange} required />

                <input name="consignorGstNumber" placeholder="Consignor GST (optional)" value={form.consignorGstNumber} onChange={handleChange} />

                <input name="consignee" placeholder="Consignee" value={form.consignee} onChange={handleChange} required />

                <input name="consigneeGstNumber" placeholder="Consignee GST (optional)" value={form.consigneeGstNumber} onChange={handleChange} />
              </div>

              <div className="grid">
                <input name="goodsDescription" placeholder="Goods Description" value={form.goodsDescription} onChange={handleChange} />
                <input name="weight" type="number" placeholder="Weight (kg/ton)" value={form.weight} onChange={handleChange} required />
                <input name="freight" type="number" placeholder="Freight" value={form.freight} onChange={handleChange} />
                <input name="advance" type="number" placeholder="Advance" value={form.advance} onChange={handleChange} />
              </div>

              <div className="grid">
                <select name="truck" value={form.truck} onChange={handleChange} required>
                  <option value="">Select Truck</option>
                  {trucks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.truckNumber}
                    </option>
                  ))}
                </select>

                <select name="driver" value={form.driver} onChange={handleChange} required>
                  <option value="">Select Driver</option>
                  {drivers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <input name="balance" type="number" placeholder="Balance" value={form.balance} onChange={handleChange} />
                <input name="privateMarka" placeholder="Private Marka" value={form.privateMarka} onChange={handleChange} />
              </div>

              <div className="grid">
                <input name="invoiceNumber" placeholder="Invoice Number" value={form.invoiceNumber} onChange={handleChange} />
                <input name="invoiceDate" type="date" placeholder="Invoice Date" value={form.invoiceDate} onChange={handleChange} />
                <input name="invoiceAmount" type="number" placeholder="Invoice Amount" value={form.invoiceAmount} onChange={handleChange} />
                <input name="ewayBillNumber" placeholder="E-way Bill Number" value={form.ewayBillNumber} onChange={handleChange} />
              </div>

              <div>
                <label>Invoice Image</label>
                <input type="file" accept="image/*,.pdf" onChange={handleInvoiceFile} />
              </div>

              <div>
                <label>Eway Bill Image</label>
                <input type="file" accept="image/*,.pdf" onChange={handleEwayFile} />
              </div>

              <div>
                <label>Other Documents (multiple)</label>
                <input type="file" multiple onChange={handleDocs} />
              </div>

              <div>
                <textarea name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} />
              </div>

              <div className="actions">
                <button className="btn-primary" type="submit" disabled={loadingSave}>
                  {loadingSave ? (editingId ? "Updating..." : "Saving...") : (editingId ? "Update Trip" : "Save Trip")}
                </button>
                <button type="button" className="btn-cancel" onClick={() => { resetForm(); setShowForm(false); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="trip-table">
          {trips.length === 0 ? (
            <p className="no-data">No trips found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bilty</th>
                  <th>Truck</th>
                  <th>Driver</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Weight</th>
                  <th>Freight</th>
                  <th>Advance</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t._id}>
                    <td>{t.date ? t.date.split("T")[0] : ""}</td>
                    <td>{t.biltyNumber}</td>
                    <td>{t.truck?.truckNumber || "-"}</td>
                    <td>{t.driver?.name || "-"}</td>
                    <td>{t.origin}</td>
                    <td>{t.destination}</td>
                    <td>{t.weight}</td>
                    <td>{t.freight}</td>
                    <td>{t.advance}</td>
                    <td>{t.balance}</td>
                    <td className="actions-col">
                      <button className="btn-edit" onClick={() => handleEdit(t)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(t._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Trips;
