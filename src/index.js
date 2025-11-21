import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from './reportWebVitals';
import Homepage from './pages/homepage/homepage';
import Connect from './pages/connect/connect';
import Faqs from './pages/faqs/faqs';
import Knowus from './pages/knowus/knowus';
import Benifits from './pages/benifits/benifits';
import Product from './components/product-images/product';
import Mainproduct from './pages/product/mainproduct';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import Forgotpassword from './pages/forgotpassword/passoword';
import Cart from './pages/cart/cart';
import Checkout from './pages/checkout/checkout';
import Twelve from './pages/twelve/twelve';
import Payment from './pages/payment/payment';
import Error from './pages/error/error';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <Router basename="/">
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/faqs" element={<Faqs/>} />
      <Route path="/know-us" element={<Knowus/>} />
      <Route path="/benefits" element={<Benifits/>} />
      <Route path="/product" element={<Mainproduct />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/Check-out" element={<Checkout />} />
      <Route path="/twelve" element={<Twelve />} />
      <Route path='/payment' element={<Payment/>}/>
       <Route path="*" element={<Error/>} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
