export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 24,
      paddingBottom: 16,
      borderBottom: "1px solid #eee"
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{title}</h1>
        {subtitle && <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}
