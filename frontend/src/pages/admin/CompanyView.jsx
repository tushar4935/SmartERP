// frontend/src/pages/admin/CompanyView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompany as apiGetCompany } from "../../api/companies";

export default function CompanyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGetCompany(id);
        setCompany(data);
      } catch (err) {
        console.error(err);
        alert("Could not load company");
        navigate("/admin/companies");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!company) return <div>No company found</div>;

  return (
    <div className="max-w-3xl bg-white rounded shadow p-6">
      <div className="flex items-center gap-6">
        {company.logo_url ? (
          <img src={company.logo_url} alt={company.name} className="h-20 w-20 object-contain" />
        ) : (
          <div className="h-20 w-20 bg-gray-100 flex items-center justify-center">Logo</div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">{company.name}</h1>
          <p className="text-sm text-gray-600">{company.email || "-"}</p>
          <p className="text-sm text-gray-600">{company.contact_no || "-"}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium">Address</h3>
        <p className="text-sm text-gray-700">{company.address || "-"}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => navigate(`/admin/company/${id}/edit`)} className="bg-yellow-500 px-4 py-2 rounded text-white">Edit</button>
        <button onClick={() => navigate("/admin/companies")} className="px-4 py-2 border rounded">Back</button>
      </div>
    </div>
  );
}
