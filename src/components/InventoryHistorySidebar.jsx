import React, { useEffect, useRef } from 'react';

const InventoryHistorySidebar = ({ history, onClose, productName, loading }) => {
  const sidebarRef = useRef();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className="position-fixed top-0 end-0" style={{ zIndex: 1050, height: '100%', width: '100vw', pointerEvents: 'auto' }}>
      <div
        ref={sidebarRef}
        className="bg-white border-start shadow-lg p-4 animate__animated animate__fadeInRight position-absolute top-0 end-0"
        style={{ width: '340px', height: '100%', overflowY: 'auto', borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold mb-0">Inventory History</h5>
            {productName && <div className="text-muted small">{productName}</div>}
          </div>
          <button className="btn btn-close" aria-label="Close" onClick={onClose}></button>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <div>Loading history...</div>
          </div>
        ) : history.length > 0 ? (
          history.map((log) => (
            <div key={log._id} className="border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                <span className="fw-semibold">{new Date(log.date).toLocaleString()}</span>
              </div>
              <div className="d-flex flex-wrap gap-2 mb-1">
                <span className="badge bg-secondary">Old Qty: {log.oldQty}</span>
                <span className="badge bg-success">New Qty: {log.newQty}</span>
                <span className="badge bg-info text-dark">User: {log.user}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No history available</p>
        )}
      </div>
    </div>
  );
};

export default InventoryHistorySidebar;
