// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import reportWebVitals from './reportWebVitals';
// import Homepage from './pages/homepage/homepage';
// import Connect from './pages/connect/connect';
// import Faqs from './pages/faqs/faqs';
// import Knowus from './pages/knowus/knowus';
// import Benifits from './pages/benifits/benifits';
// import Product from './components/product-images/product';
// import Mainproduct from './pages/product/mainproduct';
// import Login from './pages/login/login';
// import Signup from './pages/signup/signup';
// import Forgotpassword from './pages/forgotpassword/passoword';
// import Cart from './pages/cart/cart';
// import Checkout from './pages/checkout/checkout';
// import Twelve from './pages/twelve/twelve';
// import Payment from './pages/payment/payment';
// import Error from './pages/error/error';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//  <Router basename="/">
//     <Routes>
//       <Route path="/" element={<Homepage />} />
//       <Route path="/connect" element={<Connect />} />
//       <Route path="/faqs" element={<Faqs/>} />
//       <Route path="/know-us" element={<Knowus/>} />
//       <Route path="/benefits" element={<Benifits/>} />
//       <Route path="/product" element={<Mainproduct />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/forgot-password" element={<Forgotpassword />} />
//       <Route path="/cart" element={<Cart />} />
//       <Route path="/Check-out" element={<Checkout />} />
//       <Route path="/twelve" element={<Twelve />} />
//       <Route path='/payment' element={<Payment/>}/>
//        <Route path="*" element={<Error/>} />
//     </Routes>
//   </Router>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Pages
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
import RefundPolicy from './pages/refundpolicy/refundpolicy';
import ShippingPolicy from './pages/shipingpolicy/shipingpolicy';
import Termsconditions from './pages/termsandcondition/termsandcondition';
import Privacypolicy from './pages/privacypolicy/privacypolicy';
import ProductPage from './pages/ProductPage.jsx/ProductPage';
import Productdetails from './pages/productdetails/productdetails';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/privacy-policy" element={<Privacypolicy />} />
      <Route path="/terms-and-condition" element={<Termsconditions />} />
      <Route path="/shipping-policy" element={<ShippingPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicy/>} />
      <Route path="/ProductPage" element={<ProductPage/>} />
      <Route path="/productdetails" element={<Productdetails/>} />
        <Route path="*" element={<Error/>} />
      </Routes>
    </Router>
  </GoogleOAuthProvider>
);

reportWebVitals();
