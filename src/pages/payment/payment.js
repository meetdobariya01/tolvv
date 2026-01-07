import React, { useEffect, useState } from "react";
import "./payment.css";
import { NavLink, useParams } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const Payment = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/order/${orderId}`,
          { withCredentials: true }
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div>
      <Header />

      <div className="pay-wrapper">
        <div className="pay-card animate__animated animate__fadeInDown">

          {/* Success Icon */}
          <div className="pay-icon">
            <div className="checkmark"></div>
          </div>

          <h2 className="pay-title">Payment Successful!</h2>

          <p className="pay-subtitle">
            Your order has been confirmed.
          </p>

          <div className="pay-details">
            <p>
              <strong>Order ID:</strong> {order.customOrderId}
            </p>
            <p>
              <strong>Name:</strong> {order.userId?.name || "Customer"}
            </p>
            <p>
              <strong>Amount Paid:</strong> ₹{order.totalAmount}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {order.status === "CHARGED" || order.status === "PAID"
                ? "Paid"
                : order.status}
            </p>
          </div>

          <NavLink to="/" className="pay-btn">
            Continue Shopping
          </NavLink>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;
