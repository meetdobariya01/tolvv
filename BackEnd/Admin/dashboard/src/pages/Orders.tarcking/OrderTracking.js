import React, { useState } from "react";

// Simple emoji-based icon component (no external libraries needed)
const Icon = ({ status }) => {
  switch (status) {
    case "Delivered":
      return <span style={{ fontSize: "20px" }}>✅</span>;
    case "Shipped":
      return <span style={{ fontSize: "20px" }}>🚚</span>;
    case "Pending":
      return <span style={{ fontSize: "20px" }}>⏳</span>;
    default:
      return <span style={{ fontSize: "20px" }}>📦</span>;
  }
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const trackOrder = async () => {
    if (!orderId) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const result = await res.json();

      if (!result.order) {
        setError("Order not found");
        setData(null);
      } else {
        setData(result);
      }
    } catch (err) {
      setError("Failed to fetch order");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f4f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "20px"
          }}
        >
          Track Your Order
        </h1>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd"
            }}
          />
          <button
            onClick={trackOrder}
            disabled={loading}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}

        {data && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <h2 style={{ fontSize: "18px" }}>Current Status</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "20px",
                  fontWeight: "600"
                }}
              >
                <Icon status={data.order.orderStatus} />
                {data.order.orderStatus}
              </div>
            </div>

            {data.tracking?.history?.map((step, index) => (
              <div
                key={index}
                style={{
                  background: "#f9fafb",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "10px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 600
                  }}
                >
                  <Icon status={step.status} />
                  {step.status}
                </div>
                <div style={{ fontSize: "14px", color: "#555" }}>
                  {step.note}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {new Date(step.updatedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}