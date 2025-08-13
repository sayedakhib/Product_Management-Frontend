import React from 'react';


const ProductTable = ({
  products,
  onEditInit,
  onEditChange,
  onEditSave,
  onEditCancel,
  editRowId,
  editRowData,
  onDelete,
  onHistory
}) => {
  return (
    <table className="table table-bordered table-hover table-striped align-middle rounded-3 overflow-hidden shadow-sm">
      <thead className="table-dark">
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Unit</th>
          <th>Category</th>
          <th>Brand</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.length > 0 ? (
          products.map((p) => (
            <tr key={p._id}>
              {editRowId === p._id ? (
                <>
                  <td>
                    {editRowData.image && typeof editRowData.image === 'string' ? (
                      <img src={editRowData.image} alt={editRowData.name} className="rounded-circle border border-2" style={{ width: 48, height: 48, objectFit: 'cover' }} />
                    ) : (
                      <span className="text-muted">No Image</span>
                    )}
                    <input type="file" name="image" className="form-control mt-1" accept="image/*" onChange={onEditChange} />
                  </td>
                  <td><input className="form-control" name="name" value={editRowData.name} onChange={onEditChange} /></td>
                  <td><input className="form-control" name="unit" value={editRowData.unit} onChange={onEditChange} /></td>
                  <td><input className="form-control" name="category" value={editRowData.category} onChange={onEditChange} /></td>
                  <td><input className="form-control" name="brand" value={editRowData.brand} onChange={onEditChange} /></td>
                  <td><input className="form-control" name="stock" value={editRowData.stock} onChange={onEditChange} /></td>
                  <td>
                    <select className="form-select" name="status" value={editRowData.status} onChange={onEditChange}>
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-success" title="Save" onClick={onEditSave}>
                        <i className="bi bi-check"></i> Save
                      </button>
                      <button className="btn btn-sm btn-secondary" title="Cancel" onClick={onEditCancel}>
                        <i className="bi bi-x"></i> Cancel
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="rounded-circle border border-2" style={{ width: 48, height: 48, objectFit: 'cover' }} />
                    ) : (
                      <span className="text-muted">No Image</span>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.unit}</td>
                  <td>{p.category}</td>
                  <td>{p.brand}</td>
                  <td>{p.stock}</td>
                  <td className={p.status === 'In Stock' ? 'text-success' : 'text-danger'}>
                    {p.status}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-primary" title="Edit" onClick={() => onEditInit(p)}>
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-danger" title="Delete" onClick={() => onDelete(p._id)}>
                        <i className="bi bi-trash"></i> Delete
                      </button>
                      <button className="btn btn-sm btn-info text-white" title="History" onClick={() => onHistory(p._id)}>
                        <i className="bi bi-clock-history"></i> History
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center">No Products Found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ProductTable;
