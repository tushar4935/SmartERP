import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPurchase } from "../../api/purchases";
import { fetchSuppliers } from "../../api/suppliers";
import { fetchStockItems } from "../../api/stock";
import { X, Plus, ShoppingBag, Trash2 } from "lucide-react";

export default function NewPurchase() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [cart, setCart] = useState([]);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSuppliers().then(d => setSuppliers(Array.isArray(d) ? d : d.suppliers || [])).catch(console.error);
    fetchStockItems().then(d => setStockItems(Array.isArray(d) ? d : d.items || [])).catch(console.error);
  }, []);

  const addItem = (item) => {
    if (cart.find(c => c.id === item.id)) return;
    setCart(prev => [...prev, { ...item, qty: 1, unit_price: 0 }]);
  };

  const updateCart = (idx, field, value) => {
    setCart(prev => prev.map((c, i) => i === idx ? { ...c, [field]: Number(value) } : c));
  };

  const removeItem = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));

  const total = cart.reduce((s, c) => s + c.qty * c.unit_price, 0);

  const submit = async () => {
    if (!supplierId) return alert("Please select a supplier");
    if (cart.length === 0) return alert("Add at least one item");
    setSaving(true);
    try {
      await createPurchase({ supplier_id: supplierId, items: cart, total_amount: total });
      alert("Purchase created successfully!");
      navigate("/purchases");
    } catch (err) { alert("Failed: " + err.message); }
    finally { setSaving(false); }
  };

  const filtered = stockItems.filter(i => i.item_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><ShoppingBag size={22} className="text-indigo-500" /> New Purchase</h1>
          <p className="page-sub">Create a new purchase order</p>
        </div>
        <button onClick={() => navigate("/purchases")} className="btn-outline flex items-center gap-1"><X size={16}/> Cancel</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: supplier + item selector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="erp-card p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Supplier *</label>
            <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="erp-select">
              <option value="">-- Select Supplier --</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplier_name} — {s.company || ""}</option>)}
            </select>
          </div>

          <div className="erp-card p-5">
            <h3 className="font-semibold text-slate-700 mb-3">Select Items</h3>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stock items..." className="erp-input mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {filtered.map(item => (
                <button key={item.id} onClick={() => addItem(item)}
                  className="text-left p-2 border-2 border-slate-200 rounded-lg text-sm hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 flex items-center gap-2">
                  <Plus size={14} className="text-indigo-500 shrink-0" />
                  <span className="truncate">{item.item_name}</span>
                </button>
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <div className="erp-card p-5 animate-fadeIn">
              <h3 className="font-semibold text-slate-700 mb-3">Purchase Items</h3>
              <div className="overflow-x-auto">
                <table className="erp-table">
                  <thead><tr><th>Item</th><th>Qty</th><th>Unit Price (PKR)</th><th>Total</th><th></th></tr></thead>
                  <tbody>
                    {cart.map((c, idx) => (
                      <tr key={idx}>
                        <td className="font-medium">{c.item_name}</td>
                        <td><input type="number" min="1" value={c.qty} onChange={e => updateCart(idx, "qty", e.target.value)} className="erp-input w-20" /></td>
                        <td><input type="number" min="0" value={c.unit_price} onChange={e => updateCart(idx, "unit_price", e.target.value)} className="erp-input w-28" /></td>
                        <td className="font-semibold text-indigo-700">PKR {(c.qty * c.unit_price).toLocaleString()}</td>
                        <td><button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 transition"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: summary */}
        <div className="erp-card p-5 h-fit space-y-4 animate-slideInRight">
          <h3 className="font-semibold text-slate-700 text-lg border-b pb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Items</span><span>{cart.length}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>PKR {total.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span className="text-indigo-600">PKR {total.toLocaleString()}</span></div>
          </div>
          <button onClick={submit} disabled={saving} className="btn-primary w-full text-center">
            {saving ? "Saving..." : "Confirm Purchase"}
          </button>
        </div>
      </div>
    </div>
  );
}
