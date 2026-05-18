import { useEffect, useState } from "react";
import {
  fetchCategories,
  createStockItem,
  updateStockItem,
} from "../../../api/stock";

export default function StockModal({ close, onSaved, editData }) {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({
    category_id: "",
    item_name: "",
    current_qty: 0,
    expiry_date: "",
    manufacture_date: "",
    status: true,
  });

  useEffect(() => {
    fetchCategories().then(setCats);
    if (editData) {
      setForm(editData);
    }
  }, []);

  const submit = async () => {
    if (editData) {
      await updateStockItem(editData.id, form);
    } else {
      await createStockItem(form);
    }
    onSaved();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[500px] animate-slide-up">
        <h2 className="text-lg font-semibold mb-4">
          {editData ? "Update Item" : "New Stock Item"}
        </h2>

        <select
          className="w-full border p-2 mb-2"
          value={form.category_id}
          onChange={(e) =>
            setForm({ ...form, category_id: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="w-full border p-2 mb-2"
          placeholder="Item name"
          value={form.item_name}
          onChange={(e) =>
            setForm({ ...form, item_name: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full border p-2 mb-2"
          placeholder="Quantity"
          value={form.current_qty}
          onChange={(e) =>
            setForm({ ...form, current_qty: e.target.value })
          }
        />

        <div className="flex gap-2">
          <input
            type="date"
            className="w-full border p-2"
            onChange={(e) =>
              setForm({ ...form, manufacture_date: e.target.value })
            }
          />
          <input
            type="date"
            className="w-full border p-2"
            onChange={(e) =>
              setForm({ ...form, expiry_date: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={close} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
