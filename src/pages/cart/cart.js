import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

/* PRODUCTS */
const products = {
  "Body Lotion": {
    price: 750,
    desc: "Deeply nourishing body lotion for smooth and hydrated skin.",
  },
  Perfume: {
    price: 1200,
    desc: "Long-lasting premium fragrance crafted with fine oils.",
  },
  "Essential Oil": {
    price: 950,
    desc: "Pure essential oil for relaxation and aromatherapy.",
  },
  Soap: {
    price: 350,
    desc: "Gentle soap made with natural cleansing ingredients.",
  },
};

const Cart = () => {
  const [selectedProduct, setSelectedProduct] = useState("Body Lotion");
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const product = products[selectedProduct];
  const total = product.price * qty;

  const handleProductClick = (item) => {
    const slug = item.toLowerCase().replace(/\s+/g, "-");
    navigate("./mainproduct");
  };

  return (
    <div>
      <Header />

      <div className="cart-wrapper">
        <div className="container">
          <div className="row min-vh-100">

            {/* LEFT SIDE */}
            <div className="col-lg-6 left-panel">
              <h6 className="section-title">You may also like</h6>

              <ul className="suggest-list">
                {Object.keys(products).map((item) => (
                  <li
                    key={item}
                    className={item === selectedProduct ? "active" : ""}
                    onClick={() => handleProductClick(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-lg-6 right-panel my-5">
              <div className="cart-header">
                <h6>CART</h6>
                <span className="close">×</span>
              </div>

              {/* PRODUCT DETAIL */}
              <div className="cartpage-item">
                <div className="product-img" />

                <div className="product-info">
                  <p className="fw-bold">{selectedProduct}</p>
                  <p className="small text-muted">{product.desc}</p>

                  <div className="qty-box">
                    <button onClick={() => qty > 1 && setQty(qty - 1)}>
                      -
                    </button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(qty + 1)}>+</button>
                  </div>
                </div>

                <div className="price">
                  ₹ {total}
                  <span className="delete">🗑</span>
                </div>
              </div>

              {/* SHIPPING */}
              <div className="shipping mt-5">
                <h6>Estimate shipping</h6>
                <input placeholder="Country >" />
                <input placeholder="City >" />
                <input placeholder="Postal / ZIP Code >" />
                <button className="btn btn-outline-dark">
                  CHECK DURATION
                </button>
              </div>

              {/* NOTE */}
              <div className="note mt-5 rounded">
                <h6>Add a note</h6>
                <textarea />
              </div>

              {/* TOTAL */}
              <div className="total-box">
                <div className="row-line">
                  <span>Subtotal</span>
                  <span>₹ {total}</span>
                </div>
                <div className="row-line bold">
                  <span>Total</span>
                  <span>₹ {total}</span>
                </div>

                <button className="btn btn-outline-dark">
                  CHECKOUT
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
