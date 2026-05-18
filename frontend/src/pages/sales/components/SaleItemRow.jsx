import { Trash2 } from "lucide-react";

export default function SaleItemRow({ item, index, onUpdate, onRemove }) {
  const handleChange = (field, value) => {
    onUpdate(index, { ...item, [field]: field === "qty" || field === "price" ? Number(value) : value });
  };

  return (
    <tr>
      <td className="font-medium">{item.item_name || item.name}</td>
      <td>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={item.current_qty}
            value={item.qty}
            onChange={e => handleChange("qty", e.target.value)}
            className="w-20 erp-input text-sm py-1"
          />
          <span className="text-xs text-slate-400 whitespace-nowrap">/ {item.current_qty}</span>
        </div>
      </td>
      <td>
        <input
          type="number"
          min={0}
          value={item.price}
          onChange={e => handleChange("price", e.target.value)}
          className="w-24 erp-input text-sm py-1"
        />
      </td>
      <td className="text-right font-semibold text-slate-800">
        PKR {(item.qty * item.price).toLocaleString()}
      </td>
      <td>
        <button
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
