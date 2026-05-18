import { useEffect, useState } from "react";
import { fetchBranches } from "../../../api/branches";

export default function BranchSelector({ value, onChange }) {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetchBranches()
      .then(d => setBranches(d.branches || []))
      .catch(console.error);
  }, []);

  return (
    <select className="erp-select" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">— Select Branch —</option>
      {branches.map(b => (
        <option key={b.id} value={b.title}>{b.title}</option>
      ))}
    </select>
  );
}
