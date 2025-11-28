import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Pagination,
  Badge,
  Spinner,
} from "react-bootstrap";
import { FaEye, FaPrint } from "react-icons/fa";
import Header from "../header/header";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/orders"; // ✅ BACKEND API

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    limit: 10,
    page: 1,
  });
  const [loading, setLoading] = useState(false);

  const statusColors = {
    Pending: "warning",
    CHARGED: "success",
    FAILED: "danger",
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // ✅ FETCH ORDERS FROM BACKEND
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          paymentStatus: filters.status || undefined,
        },
      });

      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ STATUS UPDATE USING BACKEND
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/${orderId}/status`,
        { paymentStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  // ✅ PAGINATION FRONTEND
  const startIndex = (filters.page - 1) * filters.limit;
  const paginatedOrders = orders.slice(
    startIndex,
    startIndex + Number(filters.limit)
  );

  const totalPages = Math.ceil(orders.length / filters.limit);

  const renderPagination = () =>
    [...Array(totalPages)].map((_, i) => (
      <Pagination.Item
        key={i + 1}
        active={filters.page === i + 1}
        onClick={() => setFilters({ ...filters, page: i + 1 })}
      >
        {i + 1}
      </Pagination.Item>
    ));

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h4>Orders (Live Backend)</h4>

        {/* FILTERS */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="CHARGED">Charged</option>
              <option value="FAILED">Failed</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={filters.limit}
              onChange={(e) =>
                setFilters({ ...filters, limit: e.target.value, page: 1 })
              }
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </Form.Select>
          </Col>
        </Row>

        {/* TABLE */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Time</th>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Change</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : paginatedOrders.length ? (
              paginatedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customOrderId || order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{order.userId?.name || "Guest"}</td>
                  <td>{order.userId?.mobile || "N/A"}</td>
                  <td>{order.userId?.email || "N/A"}</td>
                  <td>₹{order.totalAmount}</td>

                  <td>
                    <Badge bg={statusColors[order.status] || "secondary"}>
                      {order.status}
                    </Badge>
                  </td>

                  <td>
                    <Form.Select
                      size="sm"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.customOrderId, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="CHARGED">Charged</option>
                      <option value="FAILED">Failed</option>
                    </Form.Select>
                  </td>

                  <td>
                    <Button size="sm" variant="outline-primary">
                      <FaPrint />
                    </Button>
                    <Button size="sm" className="ms-2" variant="outline-secondary">
                      <FaEye />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Pagination className="justify-content-end">
          {renderPagination()}
        </Pagination>
      </div>
    </div>
  );
};

export default Order;
