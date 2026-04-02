import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart } from "react-icons/fi";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
// import Cookies from "js-cookie";
import Zodiacdetails from "../../components/zodiac-details/zodiacdetails";

const API_URL = process.env.REACT_APP_API_URL;

const productInfo = {
  bath: {
    title: "BATH GEL",
    images: [
      "/images/icon-1.png",
      "/images/icon-2.png",
      "/images/icon-3.png",
      "/images/icon-4.png",
    ],
    howToUse:
      "Wet your skin, then work a small amount of 12’s Bath Gel into a lather using a loofah or your hands. Gently massage over your body, rinse thoroughly and pat dry.",
    ingredients:
      "Natural Foam Booster, Natural Essential Oil, Glycerin, Vitamin E, Vitamin C, Castor Oil, Coconut Oil, Energized Water",
    caution:
      "Avoid eye contact. In case of contact, rinse immediately with water. Store in a cool, dry place.",
  },
  soap: {
    title: "SOAP",
    images: [
      "/images/icon-1.png",
      "/images/icon-2.png",
      "/images/icon-3.png",
      "/images/icon-4.png",
    ],
    howToUse:
      "Rediscover purity in every wash. Gentle ingredients inspired by nature, free from harshness.",
    ingredients:
      "Coconut Oil, Glycerin, Castor Oil, Natural Essential Oil, Vitamin C, Energized Water",
    caution:
      "Avoid eye contact. Discontinue use if irritation occurs. Keep out of reach of children.",
  },
  oil: {
    title: "ESSENTIAL OIL",
    images: [
      "/images/icon-1.png",
      "/images/icon-2.png",
      "/images/icon-3.png",
      "/images/icon-4.png",
    ],
    howToUse:
      "12’s Essential Oil is best used in three ways—by inhaling through a diffuser, applying on your skin after mixing with a carrier oil, or adding to your bath after proper dilution.",
    ingredients: "100% Pure Essential Oil Extracts, Natural Essential Oils.",
    caution:
      "Always dilute before use. Avoid eye contact. Do not ingest. Keep away from children. Do a patch test.",
  },
  eaudeperfumes: {
    title: "PERFUMES",
    images: [
      "/images/icon-1.png",
      "/images/icon-2.png",
      "/images/icon-3.png",
      "/images/icon-4.png",
    ],
    howToUse:
      "12’s Perfumes are designed for gentle elegance. Spray on pulse points like wrists and neck to uplift your spirit.",
    ingredients:
      "Denatured Spirit, Aromatic Substances, Dipropylene Glycol, Quantum Satis",
    caution:
      "Flammable. Keep away from heat and direct sunlight. Avoid Eye Contact.",
  },
  bodylotion: {
    title: "BODY LOTION",
    images: [
      "/images/icon-1.png",
      "/images/icon-2.png",
      "/images/icon-3.png",
      "/images/icon-4.png",
    ],
    howToUse:
      "Apply on slightly damp skin. Gently massage in upward circular motions until fully absorbed for a radiant glow.",
    ingredients:
      "Aloe Vera Extract, Honey, Vitamin E Acetate, Shea Butter, Jojoba Seed Oil, Hyaluronic Acid",
    caution:
      "Store in a cool, dry place away from direct sunlight. Avoid eye contact.",
  },
  hamper: {
    title: "CURATED ZODIAC HAMPER",
    images: [
      "/images/icon-1.png",
      "/images/icon-2.png",
      "/images/icon-3.png",
      "/images/icon-4.png",
    ],
    howToUse:
      "This hamper contains a curated selection of products. Refer to each individual product within the hamper for specific usage instructions.",
    // ingredients:
    //   "A proprietary blend of Bath Gel, Soap, Essential Oil, and Perfume tailored to your Zodiac energy.",
    caution:
      "Perform a patch test for each product. Store in a cool place. Keep away from direct sunlight.",
  },
};

const categoryMap = {
  "bath gel": "bath",
  bathgel: "bath",
  soap: "soap",
  "essential oil": "oil",
  essentialoil: "oil",
  oil: "oil",
  perfumes: "eaudeperfumes",
  perfume: "eaudeperfumes",
  "eau de perfumes": "eaudeperfumes",
  "body lotion": "bodylotion",
  bodylotion: "bodylotion",
  hamper: "hamper",
  hampers: "hamper",
};

const Productdetails = ({ handleCartOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("bath");
  const [activeTab, setActiveTab] = useState("bath");
  const [dbProduct, setDbProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product data (unchanged)
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/${id}`);
        const product = response.data;
        if (!product) setDbProduct(null);
        else {
          setDbProduct(product);
          const dbCat = product.Category?.toLowerCase().trim();
          if (dbCat && categoryMap[dbCat]) setActiveTab(categoryMap[dbCat]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error.response || error);
        setDbProduct(null);
        setLoading(false);
      }
    };
    if (id) fetchProductData();
  }, [id]);

  // Add to cart (guest or logged-in)
  const addToCart = async () => {
    if (!dbProduct) return;
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await axios.post(
          `${API_URL}/cart/add`,
          { productId: dbProduct._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (handleCartOpen) handleCartOpen();
      } catch (error) {
        console.error("Add to cart error:", error.response?.data || error);

        if (error.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } else {
      let cart = [];

      try {
        const stored = localStorage.getItem("guestCart");
        cart = stored ? JSON.parse(stored) : [];
      } catch {
        cart = [];
      }

      const existing = cart.find((i) => i.productId === dbProduct._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          productId: dbProduct._id,
          quantity: 1,
          price: dbProduct.ProductPrice,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(cart));

      window.dispatchEvent(new Event("cartUpdated"));

      if (handleCartOpen) handleCartOpen();
    }
  };
  // UI rendering (unchanged)
  if (loading)
    return (
      <div className="text-center py-5">
        <h3>Loading...</h3>
      </div>
    );
  if (!dbProduct)
    return (
      <div className="text-center py-5">
        <h3>Product Not Found</h3>
      </div>
    );

  return (
    <div>
      <Header />
      {/* <section className="zodiac-hero">
        <motion.img
          src="/images/bg.png"
          alt="Hero Banner"
          className="zodiac-hero-img"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </section> */}
      <Container fluid className="py-5 container sora">
        <Row className="align-items-start">
          <Col md={4}>
            {dbProduct.Photos && Array.isArray(dbProduct.Photos) && dbProduct.Photos.length > 0 && (
              <motion.img
                key={dbProduct.Photos[0]}
                src={
                  dbProduct.Photos[0].startsWith("http")
                    ? dbProduct.Photos[0]
                    : `/images/${dbProduct.Photos[0].replace("images/", "")}`
                }
                alt={dbProduct.ProductName}
                className="img-fluid rounded shadow-sm w-100 mb-4 mb-md-0"
                style={{ objectFit: "cover", maxHeight: "600px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </Col>

          <Col md={4}>
            {dbProduct.Photos && Array.isArray(dbProduct.Photos) && dbProduct.Photos.length > 1 && (
              <motion.img
                key={dbProduct.Photos[1]}
                src={
                  dbProduct.Photos[1].startsWith("http")
                    ? dbProduct.Photos[1]
                    : `/images/${dbProduct.Photos[1].replace("images/", "")}`
                }
                alt={dbProduct.ProductName}
                className="img-fluid rounded shadow-sm w-100 mb-4 mb-md-0"
                style={{ objectFit: "cover", maxHeight: "600px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </Col>
          <Col md={4}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="fw-bold playfair-display text-uppercase mb-3">
                  {dbProduct.ProductName}
                </h1>
                <Row className="mb-4 g-3">
                  {productInfo[activeTab]?.images?.map((img, idx) => (
                    <Col xs={6} md={3} key={idx} className="text-center">
                      <motion.img
                        src={img}
                        alt="feature icon"
                        className="img-fluid"
                        style={{ maxHeight: "100px" }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Col>
                  ))}
                </Row>
                <div className="details-text">
                  <h6 className="fw-bold">HOW TO USE</h6>
                  <p>{productInfo[activeTab]?.howToUse}</p>
                  {productInfo[activeTab]?.ingredients && (
                    <>
                      <h6 className="fw-bold">INGREDIENTS</h6>
                     <p>{productInfo[activeTab]?.ingredients}</p>
                    </>
                  )}
                  <h6 className="fw-bold">CAUTION</h6>
                  <p className="small">{productInfo[activeTab]?.caution}</p>
                </div>
                <Nav.Link
                  href="/refund-policy"
                  className="text-decoration-none"
                >
                  <h6 className="fw-bold">
                    Refund Policy <span>›</span>
                  </h6>
                </Nav.Link>
                {/* <h2 className="mt-4">₹{dbProduct.ProductPrice}</h2> */}
                <button
                  onClick={addToCart}
                  className="btn btn-outline-dark mt-3"
                >
                  ADD TO CART <FiShoppingCart className="ms-1" size={22} />
                </button>
              </motion.div>
            </AnimatePresence>
          </Col>
        </Row>
        <hr />
        <Row className="mt-5 text-center">
          {[
            { key: "bath", label: "BATH LOTION" },
            { key: "soap", label: "SOAP" },
            { key: "oil", label: "ESSENTIAL OIL" },
            { key: "eaudeperfumes", label: "EAU DE PERFUMES" },
            { key: "bodylotion", label: "BATH GEL" },
            { key: "hamper", label: "HAMPER" },
          ].map((item) => (
            <Col xs={4} md={2} key={item.key}>
              <span
                className={`product-link ${active === item.key ? "active" : ""}`}
                onClick={() => setActive(item.key)}
              >
                {item.label}
              </span>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ZODIAC DETAILS */}
      <Zodiacdetails />

      <Footer />
    </div>
  );
};

export default Productdetails;
