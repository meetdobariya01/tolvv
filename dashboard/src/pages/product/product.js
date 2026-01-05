import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Table } from "react-bootstrap";
import Header from "../header/header";

const API_BASE = "http://localhost:4000/api/admin/products";
const IMAGE_BASE = "http://localhost:4000";

const getAdminAxiosConfig = () => {
  const token = localStorage.getItem("adminToken");
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  };
};

function Product() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    ProductName: "",
    ProductPrice: "",
    Category: "",
    Zodiac: "",
    Description: "",
    Photos: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUnauthorized = () => {
    alert("Session expired or unauthorized. Please login again.");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_BASE, getAdminAxiosConfig());
      setProducts(res.data);
    } catch (error) {
      if (error.response?.status === 401) handleUnauthorized();
      else console.error("Fetch Products Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({
      ProductName: "",
      ProductPrice: "",
      Category: "",
      Zodiac: "",
      Description: "",
      Photos: ""
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setSelectedId(product._id);
    setFormData(product);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${API_BASE}/${selectedId}`, formData, getAdminAxiosConfig());
      } else {
        await axios.post(API_BASE, formData, getAdminAxiosConfig());
      }
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      if (error.response?.status === 401) handleUnauthorized();
      else console.error("Save Product Error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, getAdminAxiosConfig());
      fetchProducts();
    } catch (error) {
      if (error.response?.status === 401) handleUnauthorized();
      else console.error("Delete Product Error:", error);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return `${IMAGE_BASE}/images/placeholder.png`; // fallback image
    return `${IMAGE_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div className="p-4">
      <Header />
      <Button onClick={openAddModal}>+ Add Product</Button>

      <Table striped bordered className="mt-3">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Zodiac</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">No Products</td>
            </tr>
          )}

          {products.map((p) => (
            <tr key={p._id}>
              <td>
                <img
                  src={getImageUrl(p.Photos)}
                  alt={p.ProductName}
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  onError={(e) => { e.target.onerror = null; e.target.src = `${IMAGE_BASE}/images/placeholder.png`; }}
                />
              </td>
              <td>{p.ProductName}</td>
              <td>{p.ProductPrice}</td>
              <td>{p.Category}</td>
              <td>{p.Zodiac}</td>
              <td>
                <Button size="sm" onClick={() => openEditModal(p)}>Edit</Button>{" "}
                <Button size="sm" variant="danger" onClick={() => handleDelete(p._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>

            {formData.Photos && (
              <div className="mb-3 text-center">
                <img
                  src={getImageUrl(formData.Photos)}
                  alt="Preview"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  onError={(e) => { e.target.onerror = null; e.target.src = `${IMAGE_BASE}/images/placeholder.png`; }}
                />
              </div>
            )}

            <Form.Group className="mb-2">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                name="ProductName"
                value={formData.ProductName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="ProductPrice"
                value={formData.ProductPrice}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="Category"
                value={formData.Category}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Zodiac</Form.Label>
              <Form.Control
                name="Zodiac"
                value={formData.Zodiac}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Image Path</Form.Label>
              <Form.Control
                name="Photos"
                value={formData.Photos}
                onChange={handleChange}
                placeholder="/images/product/soap/leo-soap.jpg"
              />
            </Form.Group>

            <Button type="submit" className="mt-3">{editMode ? "Update" : "Save"}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Product;
