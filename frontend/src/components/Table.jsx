export default function Table({ columns = [], data = [], loading = false, emptyMessage = "No records found." }) {
  if (loading) return <p style={{ padding: "1rem", color: "#666" }}>Loading...</p>;

  if (!data.length) return <p style={{ padding: "1rem", color: "#666" }}>{emptyMessage}</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={th}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              {columns.map((col) => (
                <td key={col.key} style={td}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "10px 12px", borderBottom: "2px solid #eee", textAlign: "left", fontWeight: 600, background: "#f8f8f8", whiteSpace: "nowrap" };
const td = { padding: "10px 12px", borderBottom: "1px solid #eee" };
