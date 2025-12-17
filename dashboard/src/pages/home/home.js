import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/header";
// import "./dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE = "http://localhost:5000/api/admin";

const getAdminAxiosConfig = () => {
  const token = localStorage.getItem("adminToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

function Home() {
  const [totalSales, setTotalSales] = useState(0);
  const [avgSale, setAvgSale] = useState(0);
  const [bestProducts, setBestProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleUnauthorized = () => {
    alert("Session expired. Please login again.");
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  const fetchDashboardStats = async () => {
    try {
      const totalRes = await axios.get(
        `${API_BASE}/stats/total-sales`,
        getAdminAxiosConfig()
      );
      setTotalSales(totalRes.data.totalSales || 0);

      const avgRes = await axios.get(
        `${API_BASE}/stats/average-sale`,
        getAdminAxiosConfig()
      );
      setAvgSale(avgRes.data.avgSale || 0);

      const bestRes = await axios.get(
        `${API_BASE}/stats/best-products?top=5`,
        getAdminAxiosConfig()
      );
      setBestProducts(bestRes.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to load dashboard stats.");
      }
    }
  };

  return (
    <div className="dashboard-container container-fluid">
      <Header />

      <h2 className="dashboard-title">Admin Dashboard</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* STATS */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-4">
          <div className="card stat-card h-100">
            <div className="card-body">
              <h6 className="text-muted">Total Sales</h6>
              <h3 className="fw-bold">${totalSales}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card stat-card h-100">
            <div className="card-body">
              <h6 className="text-muted">Average Sale</h6>
              <h3 className="fw-bold">${avgSale.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* BEST PRODUCTS TABLE */}
      <div className="card table-card">
        <div className="card-body">
          <h5 className="mb-3">Best Selling Products</h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Sold Qty</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {bestProducts.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No data available
                    </td>
                  </tr>
                )}

                {bestProducts.map((p) => (
                  <tr key={p.productId}>
                    <td>{p.productName || "Unknown"}</td>
                    <td>{p.totalQty}</td>
                    <td className="fw-semibold">${p.totalSales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
