import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div>
    <Header />
    <div style={styles.container}>
        
      <div style={styles.card}>
        <h1 style={styles.errorCode}>404</h1>
        <h2 style={styles.title}>Payment Failed</h2>
        <p style={styles.text}>
          Unfortunately, your payment could not be processed.
          <br />
          Please try again or contact support if the issue persists.
        </p>

        <div style={styles.buttonGroup}>
          {/* <button
            style={styles.primaryBtn}
            onClick={() => navigate("/checkout")}
          >
            Try Again
          </button> */}

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/")}
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6f8",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  errorCode: {
    fontSize: "72px",
    margin: "0",
    color: "#ff4d4f",
  },
  title: {
    fontSize: "26px",
    marginBottom: "10px",
  },
  text: {
    fontSize: "15px",
    color: "#666",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  primaryBtn: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  secondaryBtn: {
    background: "#000",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default PaymentFailed;