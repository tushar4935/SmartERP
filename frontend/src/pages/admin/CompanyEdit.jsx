// frontend/src/pages/admin/CompanyEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompany as apiGetCompany, updateCompany } from "../../api/companies";
import { uploadCompanyLogo } from "../../api/companies"; // new helper endpoint

export default function CompanyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    logo_url: "",
    address: "",
    contact_no: "",
    email: ""
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGetCompany(id);
        setForm({
          name: data.name || "",
          logo_url: data.logo_url || "",
          address: data.address || "",
          contact_no: data.contact_no || "",
          email: data.email || ""
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load");
        navigate("/admin/companies");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // If a file was chosen -> upload first to get URL
      let logoUrl = form.logo_url;
      if (file) {
        const uploadResp = await uploadCompanyLogo(file);
        logoUrl = uploadResp.url; // backend returns { url: '...' }
      }

      const payload = {
        name: form.name,
        logo_url: logoUrl,
        address: form.address,
        contact_no: form.contact_no,
        email: form.email
      };

      await updateCompany(id, payload);
      alert("Saved");
      navigate(`/admin/company/${id}`);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Edit Company</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Name *</label>
          <input className="w-full border px-3 py-2 rounded" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>

        <div>
          <label className="block text-sm">Logo (optional)</label>
          {form.logo_url && <img src={form.logo_url} alt="logo" className="h-16 mb-2" />}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div>
          <label className="block text-sm">Address</label>
          <input className="w-full border px-3 py-2 rounded" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Contact No</label>
            <input className="w-full border px-3 py-2 rounded" value={form.contact_no} onChange={(e) => setForm({ ...form, contact_no: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input type="email" className="w-full border px-3 py-2 rounded" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {saving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
