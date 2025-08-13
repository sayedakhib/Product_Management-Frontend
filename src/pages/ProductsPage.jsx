import React, { useEffect, useState } from 'react';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import SearchBar from '../components/SearchFilter';
import CategoryFilter from '../components/categoryFilter';
import InventoryHistorySidebar from '../components/InventoryHistorySidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  exportProducts,
  getHistory,
  getProductsByCategory,
  getAllCategories
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
    // If searching by name, use search API
    if (searchTerm) {
      res = await getProducts({ name: searchTerm, page: currentPage });
    } else if (category) {
      // If filtering by category, use dedicated category API
      res = await getProductsByCategory(category, { page: currentPage });
    } else {
      // Default: get all products
      res = await getProducts({ page: currentPage });
    }
    setTotalPages(res.data.pages || 1);
    setPage(res.data.page || 1);
    setProducts(res.data.products);
  };

  // Fetch all categories for dropdown
  const fetchCategories = async () => {
    const res = await getAllCategories();
    setCategories(res.data || []);
  };


  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add product
  const handleAdd = async (formData) => {
    const data = new FormData();
        Object.keys(formData).forEach(key => {
          data.append(key, formData[key]);
        });
        try {
          await addProduct(data);
          setShowForm(false);
          fetchProducts();
          toast.success('Product added successfully!');
        } catch (err) {
          toast.error('Failed to add product.');
        }
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
        try {
          await updateProduct(editRowId, data);
          setEditRowId(null);
          setEditRowData({});
          fetchProducts();
          toast.success('Product updated successfully!');
        } catch (err) {
          toast.error('Failed to update product.');
        }
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
          try {
            await importProducts(formData);
            fetchProducts();
            toast.success('CSV import successful!');
          } catch (err) {
            let msg = 'CSV import failed.';
            if (err?.response?.data?.message) {
              msg += ' ' + err.response.data.message;
            }
            toast.error(msg);
          }
        }
      };

  // Export CSV
  const handleExport = async () => {
        try {
          const res = await exportProducts();
          const blob = new Blob([res.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'products.csv';
          document.body.appendChild(a);
          a.click();
          a.remove();
          toast.success('Products exported successfully!');
        } catch (err) {
          toast.error('Failed to export products.');
        }
      };

    return (
      <>
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{minHeight: '100vh', minWidth: '100vw', zIndex: 0, background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', fontFamily: 'Segoe UI, Roboto, Arial, sans-serif'}}>
        {/* Header */}
        <header className="w-100 bg-white shadow-sm px-4 px-md-5 py-3 d-flex align-items-center justify-content-between" style={{position: 'sticky', top: 0, zIndex: 100}}>
          <div className="d-flex align-items-center gap-2">
            <span className="fs-4 fw-bold text-primary" style={{letterSpacing: '1px'}}>Product App</span>
          </div>
          
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
                <Button variant="success" className="shadow-sm rounded-pill px-4 fw-semibold" onClick={() => { setShowForm(true); setEditRowData({}); }}>
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
                <div className="d-flex flex-column flex-md-row gap-2 mb-3">
                  <div className="flex-grow-1">
                    <SearchBar
                      searchTerm={searchTerm}
                      onSearchChange={(val) => {
                        setSearchTerm(val);
                        if (val) setCategory(''); // Clear category if searching
                      }}
                    />
                  </div>
                  <div style={{ minWidth: 220 }}>
                    <CategoryFilter
                      category={category}
                      onCategoryChange={(val) => {
                        setCategory(val);
                        if (val) setSearchTerm(''); // Clear search if filtering by category
                      }}
                      categories={categories}
                    />
                  </div>
                </div>
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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </>
    );
};

export default ProductsPage;
