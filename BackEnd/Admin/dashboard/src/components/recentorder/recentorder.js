import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Badge, Dropdown } from "react-bootstrap";

const API_BASE = "http://localhost:5000/api";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        console.error("No admin token found");
        return;
      }

      const { data } = await axios.get(`${API_BASE}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrders(data.orders || data);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${API_BASE}/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setOrders(prev =>
        prev.map(order =>
          order.customOrderId === orderId
            ? { ...order, orderStatus: newStatus, status: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="recent-orders">
      <h4 className="mb-3">Recent Orders</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const currentStatus = order.orderStatus || order.status || "Pending";

            return (
              <tr key={order.customOrderId}>
                <td>{order.customOrderId}</td>
                <td>{order.user?.name || order.customerName}</td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <Badge
                    bg={
                      currentStatus === "Delivered"
                        ? "success"
                        : currentStatus === "Pending"
                        ? "warning"
                        : currentStatus === "Cancelled"
                        ? "danger"
                        : "secondary"
                    }
                    text={currentStatus === "Pending" ? "dark" : "light"}
                  >
                    {currentStatus}
                  </Badge>
                </td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" size="sm" className="border">
                      {currentStatus}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {["Pending", "Processing", "Delivered", "Cancelled"].map(status => (
                        <Dropdown.Item
                          key={status}
                          onClick={() => handleStatusChange(order.customOrderId, status)}
                        >
                          {status}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default RecentOrders;
