import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import Recentorder from "../../components/recentorder/recentorder";
import Header from "../header/header";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
);

const Home = () => {
  const [stats, setStats] = useState({
    avgSales: 0,
    totalIncome: 0,
    users: [],
    popularProducts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch from your backend routes
        const [avgRes, totalRes, bestProductsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats/average-sale", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/stats/total-sales", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/stats/best-products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Convert backend best products to chart format
        const popularProducts = bestProductsRes.data.map((p) => ({
          name: p.productName || "Unknown",
          totalSold: p.totalQty,
        }));

        setStats({
          avgSales: avgRes.data.avgSale || 0,
          totalIncome: totalRes.data.totalSales || 0,
          users: [
            // Placeholder real-like data (backend does not provide user spending stats yet)
            { name: "Total Orders", totalSpent: totalRes.data.ordersCount || 0 },
          ],
          popularProducts,
        });
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );

  // ✅ Charts data prepared from backend
  const barData = {
    labels: stats.users.map((u) => u.name),
    datasets: [
      {
        label: "Total Orders",
        data: stats.users.map((u) => u.totalSpent),
        backgroundColor: "#007bff",
      },
    ],
  };

  const pieData = {
    labels: stats.popularProducts.map((p) => p.name),
    datasets: [
      {
        data: stats.popularProducts.map((p) => p.totalSold),
        backgroundColor: [
          "#28a745",
          "#007bff",
          "#fd7e14",
          "#6f42c1",
          "#dc3545",
        ],
      },
    ],
  };

  return (
    <div>
      <Header />
      <Container fluid className="p-4 container">
        <h4 className="mb-4">Dashboard Overview</h4>

        {/* Statistic Cards */}
        <Row className="g-3 mb-4">
          <Col xs={12} sm={6} lg={3}>
            <Card className="text-white bg-success h-100">
              <Card.Body>
                <Card.Title>Average Order Value</Card.Title>
                <h4>₹{stats.avgSales.toFixed(2)}</h4>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} lg={3}>
            <Card className="text-white bg-info h-100">
              <Card.Body>
                <Card.Title>Total Revenue</Card.Title>
                <h4>₹{stats.totalIncome.toFixed(2)}</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Card>
              <Card.Body>
                <h5>Orders Overview</h5>
                <Bar data={barData} />
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="h-100">
              <Card.Body>
                <h5>Top Selling Products</h5>
                <Pie data={pieData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Recentorder />
    </div>
  );
};

export default Home;
