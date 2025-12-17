import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home/home';
import Recentorder from './components/recentorder/recentorder';
import Login from './pages/login/login';
import Product from './pages/product/product';
import Order from './pages/order/order';
import Signin from './pages/signin/singin';
import Customers from './pages/customers/customer';
import OrderTrackingDashboard from './pages/Orders.tarcking/OrderTracking';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/admin/dashboard" element={<Home />} />
      <Route path="/order" element={<Recentorder />} />
      <Route path="/" element={<Login />} />
      <Route path="/product" element={<Product />} />
      <Route path="/orders" element={<Order/>} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/orders-tracking" element={<OrderTrackingDashboard />} />

      {/* Add more routes as needed */}
    </Routes>
  </Router>
);
reportWebVitals();
