import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSale } from "../../api/sales";
import { fetchCustomers } from "../../api/customers";
import { fetchStockItems } from "../../api/stock";
import { X, Plus, ShoppingCart, Trash2 } from "lucide-react";

export default function NewSale() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [cart, setCart] = useState([]);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers().then(d => setCustomers(Array.isArray(d) ? d : d.customers || [])).catch(console.error);
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
    if (!customerId) return alert("Please select a customer");
    if (cart.length === 0) return alert("Add at least one item");
    setSaving(true);
    try {
      await createSale({ customer_id: customerId, items: cart, total_amount: total });
      alert("Sale created successfully!");
      navigate("/sales");
    } catch (err) { alert("Failed: " + err.message); }
    finally { setSaving(false); }
  };

  const filtered = stockItems.filter(i => i.item_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><ShoppingCart size={22} className="text-indigo-500" /> New Sale</h1>
          <p className="page-sub">Create a new sale invoice</p>
        </div>
        <button onClick={() => navigate("/sales")} className="btn-outline flex items-center gap-1"><X size={16}/> Cancel</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="erp-card p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Customer *</label>
            <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="erp-select">
              <option value="">-- Select Customer --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.customer_name} — {c.area || c.branch || ""}</option>)}
            </select>
          </div>

          <div className="erp-card p-5">
            <h3 className="font-semibold text-slate-700 mb-3">Select Products</h3>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="erp-input mb-3" />
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
              <h3 className="font-semibold text-slate-700 mb-3">Sale Items</h3>
              <table className="erp-table">
                <thead><tr><th>Product</th><th>Qty</th><th>Unit Price (PKR)</th><th>Total</th><th></th></tr></thead>
                <tbody>
                  {cart.map((c, idx) => (
                    <tr key={idx}>
                      <td className="font-medium">{c.item_name}</td>
                      <td><input type="number" min="1" value={c.qty} onChange={e => updateCart(idx, "qty", e.target.value)} className="erp-input w-20" /></td>
                      <td><input type="number" min="0" value={c.unit_price} onChange={e => updateCart(idx, "unit_price", e.target.value)} className="erp-input w-28" /></td>
                      <td className="font-semibold text-emerald-700">PKR {(c.qty * c.unit_price).toLocaleString()}</td>
                      <td><button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 transition"><Trash2 size={16}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="erp-card p-5 h-fit space-y-4 animate-slideInRight">
          <h3 className="font-semibold text-slate-700 text-lg border-b pb-2">Invoice Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Items</span><span>{cart.length}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>PKR {total.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span className="text-emerald-600">PKR {total.toLocaleString()}</span></div>
          </div>
          <button onClick={submit} disabled={saving} className="btn-success w-full text-center">
            {saving ? "Saving..." : "Confirm Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
