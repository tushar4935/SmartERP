import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStock, fetchCategories } from "../api/stock";
import { Package, FolderOpen, Plus } from "lucide-react";

export default function InventoryPage() {
  const navigate = useNavigate();
  const [items, setItems]       = useState([]);
  const [categories, setCats]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [catFilter, setCatFilter] = useState("");

  useEffect(() => {
    Promise.allSettled([
      fetchStock().then(d => setItems(Array.isArray(d) ? d : d.items || [])),
      fetchCategories().then(d => setCats(Array.isArray(d) ? d : d.categories || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(i => {
    const matchSearch = (i.item_name || "").toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter ? String(i.category_id) === catFilter : true;
    return matchSearch && matchCat;
  });

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Package size={22} className="text-teal-500"/> Inventory</h1>
          <p className="page-sub">Manage stock categories and items</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/admin/stock")} className="btn-outline flex items-center gap-1"><FolderOpen size={16}/> Categories</button>
          <button onClick={() => navigate("/admin/stock")} className="btn-primary flex items-center gap-1"><Plus size={16}/> Add Item</button>
        </div>
      </div>

      <div className="erp-card p-4 flex flex-wrap gap-3 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…" className="erp-input flex-1 min-w-48" />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="erp-select w-52">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="shimmer h-12 rounded"/>)}</div>
        ) : (
          <table className="erp-table">
            <thead><tr><th>#</th><th>Item Name</th><th>Category</th><th className="text-center">Qty in Stock</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-14 text-center text-slate-400"><Package size={36} className="mx-auto mb-2 opacity-30"/><p>No items found.</p></td></tr>
              ) : filtered.map((item, i) => (
                <tr key={item.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-medium">{item.item_name}</td>
                  <td>{categories.find(c => c.id === item.category_id)?.name || "—"}</td>
                  <td className="text-center">
                    <span className={`badge ${item.current_qty > 10 ? "badge-green" : item.current_qty > 0 ? "badge-orange" : "badge-red"}`}>
                      {item.current_qty}
                    </span>
                  </td>
                  <td><span className={`badge ${item.status ? "badge-green" : "badge-gray"}`}>{item.status ? "Active" : "Inactive"}</span></td>
                  <td>
                    <button onClick={() => navigate(`/admin/stock/${item.category_id}`)} className="text-xs text-indigo-600 hover:underline font-medium">Manage →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
