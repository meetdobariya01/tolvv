import React, { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "./cartsidebar.css";

const products = [
  {
    name: "Aries Body Lotion",
    size: "200 ml",
    price: "750",
    img: "./images/product/aries-bath-gel.webp",
  },
  {
    name: "Aries Essential Oil",
    size: "30 ml",
    price: "750",
    img: "./images/product/aries-bath-gel.webp",
  },
  {
    name: "Aries Perfume",
    size: "50 ml",
    price: "1800",
    img: "./images/product/aries-bath-gel.webp",
  },
  {
    name: "Aries Soap",
    size: "100 gms",
    price: "200",
    img: "./images/product/aries-bath-gel.webp",
  },
];

const CartSidebar = ({ show, handleClose }) => {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");

  const checkDelivery = () => {
    if (country && city && zip) {
      setDeliveryMsg(
        "Estimated delivery: Your order will arrive within 5–7 business days.",
      );
    } else {
      setDeliveryMsg("Please enter your shipping details.");
    }
  };
  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      className="cart-sidebar sora"
    >
      <Offcanvas.Header>
        <Offcanvas.Title>CART</Offcanvas.Title>
        <span className="close-btn-1 ms-auto" onClick={handleClose}>
          ×
        </span>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {/* Cart Item */}
        <div className="cart-item-1 ">
          <img
            src="./images/product/aries-bath-gel.webp"
            alt="product"
            className="cart-img"
          />

          <div className="cart-details">
            <p className="cart-name">Aries Bath Gel</p>

            <div className="qty-box">
              <button>-</button>
              <span>1</span>
              <button>+</button>
            </div>
          </div>

          <div className="cart-price">
            ₹750
            <FiTrash2 className="delete-icon" />
          </div>
        </div>

        <hr />

        {/* Estimate Shipping */}
        <div className="shipping-box mt-5">
          <p className="shipping-title">Estimate shipping</p>

          <div className="shipping-inputs d-flex flex-row gap-2">
            <input
              placeholder="Country"
              className="w-25"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />

            <input
              placeholder="City"
              className="w-25"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <input
              placeholder="Postal/ZIP Code"
              value={zip}
              className="w-50"
              onChange={(e) => setZip(e.target.value)}
            />
          </div>

          <button className="check-btn" onClick={checkDelivery}>
            CHECK DELIVERY TIME
          </button>

          {deliveryMsg && <p className="delivery-msg mt-2">{deliveryMsg}</p>}
        </div>

        <hr />

        {/* Subtotal */}
        <div className="subtotal-box">
          <div className="subtotal-row">
            <span>Subtotal</span>
          </div>

          <div className="subtotal-row">
            <span>Aries Bath Gel</span>
            <span>₹750</span>
          </div>

          <div className="subtotal-row">
            <span>
              <b>Total</b>
            </span>
            <span>
              <b>₹750</b>
            </span>
          </div>

          <div className="d-flex justify-content-end">
            <button className="checkout-btn w-auto">CHECKOUT</button>
          </div>
        </div>

        {/* Suggestions */}
        <section className="product-section-1">
          <Container>
            <Row className="g-1">
              <h5>You may also like</h5>
              {products.map((product, index) => (
                <Col lg={3} md={6} sm={6} xs={6} key={index}>
                  <motion.div
                    className="product-card p-1"
                    whileHover={{ y: -10 }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="product-img-box">
                      <img src={product.img} alt={product.name} />
                    </div>

                    <div className="product-info">
                      <h6>{product.name}</h6>

                      <div className="product-meta">
                        <span className="size">{product.size}</span>

                        <span className="price">
                          <span className="dot"></span> ₹ {product.price}
                        </span>
                      </div>

                      <div className="divider"></div>

                      <button className="add-btn">ADD TO CART</button>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section className="product-section-1">
          <Container>
            <Row className="g-1">
              <h5>Best Seller</h5>
              {products.map((product, index) => (
                <Col lg={3} md={6} sm={6} xs={6} key={index}>
                  <motion.div
                    className="product-card p-1"
                    whileHover={{ y: -10 }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="product-img-box">
                      <img src={product.img} alt={product.name} />
                    </div>

                    <div className="product-info">
                      <h6>{product.name}</h6>

                      <div className="product-meta">
                        <span className="size">{product.size}</span>

                        <span className="price">
                          <span className="dot"></span> ₹ {product.price}
                        </span>
                      </div>

                      <div className="divider"></div>

                      <button className="add-btn">ADD TO CART</button>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartSidebar;
