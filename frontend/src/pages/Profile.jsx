import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [logoFile, setLogoFile] = useState(null);

  useEffect(()=>{ load(); }, []);

  const load = async () => {
    try {
      const res = await API.get("/auth/profile");
      // backend may return { user } or user directly — handle both
      const data = res.data.user || res.data;
      setProfile(data);
      setForm({
        name: data.name || "",
        email: data.email || "",
        companyName: data.companyName || "",
        number: data.number || "",
        address: data.address || "",
        gstNumber: data.gstNumber || ""
      });
    } catch (err) {
      console.error("load profile", err);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/auth/profile", form);
      setProfile(res.data);
      setUser(res.data);
      setEditing(false);
      alert("Saved");
    } catch (err) {
      console.error("save profile", err);
      alert("Save failed");
    }
  };

  const uploadLogo = async () => {
    if (!logoFile || !profile?._id) return alert("Choose logo and save profile first");
    try {
      const fd = new FormData();
      fd.append("companyLogo", logoFile);
      await API.post(`/auth/upload-company-logo/${profile._id}`, fd, { headers: { "Content-Type": "multipart/form-data" }});
      await load();
      alert("Logo uploaded");
    } catch (err) {
      console.error("logo upload", err);
      alert("upload failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="profile-page">
        <h2>My Profile</h2>

        {profile ? (
          <div className="profile-grid">
            <div className="left">
              <div className="card">
                <img src={profile.companyLogo || "/placeholder.png"} alt="logo" className="logo-preview" />
                <h3>{profile.companyName}</h3>
                <p>{profile.email}</p>
              </div>
            </div>

            <div className="right">
              {!editing ? (
                <div className="card info">
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Number:</strong> {profile.number}</p>
                  <p><strong>Address:</strong> {profile.address}</p>
                  <p><strong>GST:</strong> {profile.gstNumber}</p>
                  <button className="btn primary" onClick={()=>setEditing(true)}>Edit Profile</button>
                </div>
              ) : (
                <form className="card form" onSubmit={saveProfile}>
                  <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
                  <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
                  <input value={form.companyName} onChange={e=>setForm({...form, companyName:e.target.value})} />
                  <input value={form.number} onChange={e=>setForm({...form, number:e.target.value})} />
                  <input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
                  <input value={form.gstNumber} onChange={e=>setForm({...form, gstNumber:e.target.value})} />
                  <div className="row actions">
                    <button className="btn primary" type="submit">Save</button>
                    <button type="button" className="btn" onClick={()=>setEditing(false)}>Cancel</button>
                  </div>
                </form>
              )}

              <div className="card">
                <h4>Company Logo</h4>
                <input type="file" accept="image/*" onChange={e=>setLogoFile(e.target.files[0])} />
                <button className="btn primary" onClick={uploadLogo}>Upload Logo</button>
              </div>
            </div>
          </div>
        ) : <p>Loading...</p> }
      </div>
    </DashboardLayout>
  );
};

export default Profile;
