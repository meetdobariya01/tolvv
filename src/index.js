import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";

// ✅ IMPORT SIDEBAR
import CartSidebar from "./components/cartsidebar/cartsidebar";

// Pages
import Homepage from "./pages/homepage/homepage";
import Connect from "./pages/connect/connect";
import Faqs from "./pages/faqs/faqs";
import Knowus from "./pages/knowus/knowus";
import Benifits from "./pages/benifits/benifits";
import Mainproduct from "./pages/product/mainproduct";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Forgotpassword from "./pages/forgotpassword/passoword";
import Cart from "./pages/cart/cart";
import Checkout from "./pages/checkout/checkout";
import Twelve from "./pages/twelve/twelve";
import Payment from "./pages/payment/payment";
import Error from "./pages/error/error";
import RefundPolicy from "./pages/refundpolicy/refundpolicy";
import ShippingPolicy from "./pages/shipingpolicy/shipingpolicy";
import Termsconditions from "./pages/termsandcondition/termsandcondition";
import Privacypolicy from "./pages/privacypolicy/privacypolicy";
import ProductPage from "./pages/ProductPage.jsx/ProductPage";
import Productdetails from "./pages/productdetails/productdetails";
import Category from "./components/category/category";
import AccountPage from "./pages/profile/profile";
import PaymentFailed from "./pages/PaymentFailed/PaymentFailed";
import HamperPage from "./pages/hamper/hamper";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function AppWrapper() {
  // ✅ GLOBAL CART STATE
  const [showCart, setShowCart] = useState(false);

  const handleCartOpen = () => setShowCart(true);
  const handleCartClose = () => setShowCart(false);

  return (
    <>
      {/* ✅ GLOBAL SIDEBAR */}
      <CartSidebar show={showCart} handleClose={handleCartClose} />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/know-us" element={<Knowus />} />
        <Route path="/benefits" element={<Benifits />} />
        <Route
          path="/product"
          element={<Mainproduct handleCartOpen={handleCartOpen} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/check-out" element={<Checkout />} />
        <Route path="/twelve" element={<Twelve />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/privacy-policy" element={<Privacypolicy />} />
        <Route path="/terms-and-condition" element={<Termsconditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/ProductPage" element={<ProductPage />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />

        {/* ✅ PASS handleCartOpen HERE */}
        <Route
          path="/productdetails/:id"
          element={<Productdetails handleCartOpen={handleCartOpen} />}
        />

        <Route path="/category" element={<Category />} />
        <Route path="/profile" element={<AccountPage />} />
        <Route path="/hamper" element={<HamperPage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Router basename="/">
      <AppWrapper />
    </Router>
  </GoogleOAuthProvider>
);

reportWebVitals();