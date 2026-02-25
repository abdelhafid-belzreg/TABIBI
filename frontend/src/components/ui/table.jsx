export function Table({ columns = [], data = [], loading = false, emptyText = "No data found." }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle small mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.style ?? {}}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                <span className="spinner-border spinner-border-sm text-primary me-2" />
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-secondary py-4">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}