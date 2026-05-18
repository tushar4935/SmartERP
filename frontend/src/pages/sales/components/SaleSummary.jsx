export default function SaleSummary({ items = [], totalAmount = 0 }) {
  if (items.length === 0) return null;

  return (
    <div className="erp-card p-4 mt-4 animate-fadeIn">
      <h4 className="font-semibold text-slate-700 mb-3">Sale Summary</h4>
      <table className="erp-table">
        <thead>
          <tr><th>Item</th><th className="text-center">Qty</th><th className="text-right">Unit Price</th><th className="text-right">Total</th></tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td className="font-medium">{item.name || item.item_name}</td>
              <td className="text-center">{item.qty}</td>
              <td className="text-right">PKR {Number(item.price || item.unit_price || 0).toLocaleString()}</td>
              <td className="text-right font-semibold">PKR {(item.qty * (item.price || item.unit_price || 0)).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-right font-bold text-slate-700 py-3 pr-4">Grand Total</td>
            <td className="text-right font-bold text-emerald-600 text-lg py-3">PKR {Number(totalAmount).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
