import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStock } from "../../../api/stock";
import StockModal from "./StockModal";
import { Package, Plus, Edit2 } from "lucide-react";

export default function StockDetails() {
  const { categoryId } = useParams();
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(false);
  const [editData, setEditData] = useState(null);

  const load = () =>
    fetchStock(categoryId)
      .then(d => {
        const all = Array.isArray(d) ? d : d.items || [];
        setItems(categoryId ? all.filter(i => String(i.category_id) === String(categoryId)) : all);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, [categoryId]);

  const openAdd  = () => { setEditData(null); setOpen(true); };
  const openEdit = (i) => { setEditData(i); setOpen(true); };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Package size={22} className="text-teal-500" /> Stock Items
          </h1>
          <p className="page-sub">{items.length} items in stock</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Product
        </button>
      </div>

      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Category</th>
                <th className="text-center">Qty</th>
                <th>Expiry</th>
                <th>Manufacture</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-400">
                    <Package size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No items found.</p>
                  </td>
                </tr>
              ) : items.map((item, i) => (
                <tr key={item.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{item.item_name}</td>
                  <td className="text-slate-600">{item.category_name || "—"}</td>
                  <td className="text-center">
                    <span className={`badge ${item.current_qty > 10 ? "badge-green" : item.current_qty > 0 ? "badge-orange" : "badge-red"}`}>
                      {item.current_qty}
                    </span>
                  </td>
                  <td className="text-slate-500 text-sm">{item.expiry_date || "—"}</td>
                  <td className="text-slate-500 text-sm">{item.manufacture_date || "—"}</td>
                  <td>
                    <span className={`badge ${item.status ? "badge-green" : "badge-gray"}`}>
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <StockModal
          close={() => setOpen(false)}
          onSaved={() => { setOpen(false); load(); }}
          editData={editData}
        />
      )}
    </div>
  );
}
