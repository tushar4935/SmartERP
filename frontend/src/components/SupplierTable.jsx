export default function SupplierTable({ data = [], showActions = false, onEdit, onDetails }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Company</th>
            <th>Branch</th>
            <th>Supplier Name</th>
            <th>Contact No</th>
            <th>Email</th>
            <th>Address</th>
            <th>User</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No suppliers found
              </td>
            </tr>
          )}
          {data.map((s) => (
            <tr key={s.id}>
              <td>{s.company}</td>
              <td>{s.branch}</td>
              <td>{s.supplier_name}</td>
              <td>{s.contact_no}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.assigned_user_name}</td>
              {showActions && (
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit && onEdit(s)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onDetails && onDetails(s)}>
                    Details
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
