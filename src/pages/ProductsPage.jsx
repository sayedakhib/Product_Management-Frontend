import React, { useEffect, useState } from 'react';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import SearchFilter from '../components/SearchFilter';
import InventoryHistorySidebar from '../components/InventoryHistorySidebar';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  exportProducts,
  getHistory,
  searchProducts
} from '../api/productApi';
import { Modal, Button } from 'react-bootstrap';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyProductName, setHistoryProductName] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load products

  const fetchProducts = async (pageOverride) => {
    let res;
    const currentPage = pageOverride || page;
    if (searchTerm) {
      // Optionally, add pagination to searchProducts if backend supports it
      res = await searchProducts(searchTerm); // No pagination for search
      setTotalPages(1);
      setPage(1);
    } else {
      const params = { page: currentPage };
      if (category) params.category = category;
      res = await getProducts(params);
      setTotalPages(res.data.pages || 1);
      setPage(res.data.page || 1);
    }
    setProducts(res.data.products);
    // Extract unique categories for filter
    const uniqueCategories = [...new Set(res.data.products.map(p => p.category))];
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, page]);

  // Add product
  const handleAdd = async (formData) => {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    await addProduct(data);
    setShowForm(false);
    fetchProducts();
  };

  // Inline edit handlers
  const handleEditInit = (product) => {
    setEditRowId(product._id);
    setEditRowData({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setEditRowData({ ...editRowData, [name]: files[0] });
    } else {
      setEditRowData({ ...editRowData, [name]: value });
    }
  };

  const handleEditSave = async () => {
    const data = new FormData();
    Object.keys(editRowData).forEach(key => {
      data.append(key, editRowData[key]);
    });
    await updateProduct(editRowId, data);
    setEditRowId(null);
    setEditRowData({});
    fetchProducts();
  };

  const handleEditCancel = () => {
    setEditRowId(null);
    setEditRowData({});
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  // Show history
  const handleHistory = async (id) => {
    setHistoryLoading(true);
    setShowHistory(true);
    const product = products.find(p => p._id === id);
    setHistoryProductName(product ? product.name : '');
    try {
      const res = await getHistory(id);
      setHistory(res.data);
    } catch (e) {
      setHistory([]);
    }
    setHistoryLoading(false);
  };

  // Import CSV
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await importProducts(formData);
      fetchProducts();
    }
  };

  // Export CSV
  const handleExport = async () => {
    const res = await exportProducts();
    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

    return (
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{minHeight: '100vh', minWidth: '100vw', zIndex: 0, background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', fontFamily: 'Segoe UI, Roboto, Arial, sans-serif'}}>
        {/* Header */}
        <header className="w-100 bg-white shadow-sm px-4 px-md-5 py-3 d-flex align-items-center justify-content-between" style={{position: 'sticky', top: 0, zIndex: 100}}>
          <div className="d-flex align-items-center gap-2">
            <span className="fs-4 fw-bold text-primary" style={{letterSpacing: '1px'}}>Product App</span>
          </div>
          <span className="text-muted d-none d-md-block" style={{fontSize: '1.1rem'}}>Inventory & Stock Management</span>
        </header>
        <div className="d-flex flex-column w-100 h-100" style={{paddingTop: '80px'}}>
          <div className="w-100 h-100 px-0 px-sm-2 px-md-3 px-lg-4">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 pt-4 w-100 px-2 px-md-0">
              <div>
                <h2 className="fw-bold mb-1" style={{fontFamily: 'inherit', letterSpacing: '0.5px'}}>Product Management</h2>
                <p className="text-muted mb-0" style={{fontSize: '1.08rem'}}>Manage your products, inventory, and history efficiently.</p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                  id="importFile"
                />
                <Button variant="success" className="shadow-sm rounded-pill px-4 fw-semibold" onClick={() => { setShowForm(true); setEditData(null); }}>
                  Add New Product
                </Button>
                <Button variant="secondary" className="shadow-sm rounded-pill px-4 fw-semibold" onClick={() => document.getElementById('importFile').click()}>
                  Import CSV
                </Button>
                <Button variant="primary" className="shadow-sm rounded-pill px-4 fw-semibold" onClick={handleExport}>
                  Export CSV
                </Button>
              </div>
            </div>
            <div className="card shadow-lg mb-0 w-100 h-100 border-0" style={{minHeight: '0', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.95)'}}>
              <div className="card-body d-flex flex-column p-2 p-sm-4 p-md-5 h-100" style={{minHeight: '0'}}>
                <SearchFilter
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  category={category}
                  onCategoryChange={setCategory}
                  categories={categories}
                  onSearchResults={(results) => setProducts(results)}
                />
                <div className="table-responsive flex-grow-1 w-100" style={{minHeight: '0'}}>
                  <ProductTable
                    products={products}
                    onEditInit={handleEditInit}
                    onEditChange={handleEditChange}
                    onEditSave={handleEditSave}
                    onEditCancel={handleEditCancel}
                    editRowId={editRowId}
                    editRowData={editRowData}
                    onDelete={handleDelete}
                    onHistory={handleHistory}
                  />
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-2 my-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span>Page {page} of {totalPages}</span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Modal removed for edit, only used for add */}
        <Modal show={showForm} onHide={() => setShowForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ProductForm
              onSubmit={handleAdd}
              initialData={{}}
            />
          </Modal.Body>
        </Modal>
        {showHistory && (
          <InventoryHistorySidebar
            history={history}
            onClose={() => setShowHistory(false)}
            productName={historyProductName}
            loading={historyLoading}
          />
        )}
      </div>
    );
};

export default ProductsPage;
