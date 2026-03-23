import React from "react";
import "./payment.css";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { useState, useEffect } from "react";
import axios from "axios";
//import { API_URL } from "../../config";
import Cookies from "js-cookie";

const Payment = () => {
 const API_URL = process.env.REACT_APP_API_URL;

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const getImageUrl = (photo) => {
    if (!photo) return "/images/product-grid.png";
    if (photo.startsWith("http")) return photo;
    return `/${photo.replace(/^\/+/, "")}`;
  };
useEffect(() => {
  const fetchBestSellers = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/best-sellers`);

      console.log("BEST SELLERS DATA 👉", res.data);

      if (res.data.length > 0) {
        setBestSellers(res.data);
      } else {
        // ✅ FALLBACK (IMPORTANT)
        const allProducts = await axios.get(`${API_URL}/products`);
        setBestSellers(allProducts.data.slice(0, 4));
      }

    } catch (err) {
      console.error("Best seller error:", err);
    }
  };

  fetchBestSellers();
}, []);
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);

        // 👉 simple fallback (no cart here)
        setRelatedProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error("Related products error:", err);
      }
    };

    fetchRelatedProducts();
  }, []);
  const addToCart = async (product) => {
    if (!product) return;

    const token = localStorage.getItem("token");

    try {
      if (token) {
        await axios.post(
          `${API_URL}/cart/add`,
          { productId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        let guestCart = JSON.parse(Cookies.get("guestCart") || "[]");

        const existingItem = guestCart.find(
          (i) => i.productId === product._id
        );

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          guestCart.push({
            productId: product._id,
            quantity: 1,
            price: product.ProductPrice,
          });
        }

        Cookies.set("guestCart", JSON.stringify(guestCart), {
          expires: 2,
        });
      }

      // ✅ SUCCESS ALERT
      alert("✅ Product added to cart successfully!");

    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };
  return (
    <div>
      {/* Header section*/}
      <Header />

      <div className="pay-wrapper">
        <div className="pay-card animate__animated animate__fadeInDown">
          {/* Success Icon */}
          <div className="pay-icon">
            <div className="checkmark"></div>
          </div>
           <div>
              <div>
                <h6 className="title mt-5">PAYMENT SUCCESSFUL</h6>

                <p className="desc mt-4 mb-1">
                  Your order is on its way to a little moment of indulgence.
                </p>
                <p className="desc mt-4">
                  Get ready to unwrap self-care, <br /> crafted just for you.
                </p>

                <p className="view-order mt-5">
                  Order received. View your order <span>›</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Payment;