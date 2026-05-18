import { useEffect, useState } from "react";
import { createAccountControl, updateAccountControl, getAccountControl } from "../../../api/accountControls";
import { useNavigate, useParams } from "react-router-dom";

export default function AccountControlForm() {
  const { id } = useParams();
  const [head, setHead] = useState("");
  const [control, setControl] = useState("");
  const [loading, setLoading] = useState(!!id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getAccountControl(id)
      .then((data) => { setHead(data.head_account || ""); setControl(data.control_account || ""); })
      .catch(() => { alert("Failed to load"); navigate("/admin/account-controls"); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (id) {
      await updateAccountControl(id, { head_account: head, control_account: control });
    } else {
      await createAccountControl({ head_account: head, control_account: control });
    }
    navigate("/admin/account-controls");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl mb-4">{id ? "Edit Account Control" : "New Account Control"}</h2>

      <input
        placeholder="Head Account"
        className="border w-full p-2 mb-3"
        value={head}
        onChange={(e) => setHead(e.target.value)}
      />

      <input
        placeholder="Control Account"
        className="border w-full p-2 mb-3"
        value={control}
        onChange={(e) => setControl(e.target.value)}
      />

      <div className="flex gap-2">
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {id ? "Update" : "Create"}
        </button>
        <button type="button" onClick={() => navigate(-1)} className="border px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}
