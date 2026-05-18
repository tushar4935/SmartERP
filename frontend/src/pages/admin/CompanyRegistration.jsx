// frontend/src/pages/admin/CompanyRegistration.jsx
import React, { useState } from "react";
import { createCompany } from "../../api/companies";
import { useNavigate } from "react-router-dom";

export default function CompanyRegistration() {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Company name required");
    setLoading(true);
    try {
      await createCompany({ name, logo_url: logoUrl, address, contact_no: contact, email });
      alert("Company created");
      navigate("/admin/companies");
    } catch (err) {
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Company Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Company Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Logo URL</label>
          <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm">Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Contact No</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
