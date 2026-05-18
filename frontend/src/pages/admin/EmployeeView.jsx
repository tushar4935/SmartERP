import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployee } from "../../api/employees";

export default function EmployeeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployee(id)
      .then(setEmp)
      .catch(() => { alert("Failed to load employee"); navigate("/admin/employees"); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!emp) return null;

  const fields = [
    { label: "Full Name", value: emp.full_name },
    { label: "CNIC", value: emp.cnic },
    { label: "Contact", value: emp.contact },
    { label: "Designation", value: emp.designation },
    { label: "Branch", value: emp.branch_title || emp.branch_id },
  ];

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee Details</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/admin/employees/${id}/edit`)}
            className="bg-indigo-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
          <button onClick={() => navigate("/admin/employees")} className="px-3 py-1 border rounded">
            Back
          </button>
        </div>
      </div>

      <dl className="divide-y">
        {fields.map(({ label, value }) => (
          <div key={label} className="py-3 flex">
            <dt className="w-1/3 text-sm text-gray-500">{label}</dt>
            <dd className="w-2/3 text-sm font-medium">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
