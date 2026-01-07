import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Cookies from "js-cookie";

const productInfo = {
  bath: {
    title: "BATH GEL",
    icons: [
      "No Harmful Chemicals",
      "Paraben Free",
      "Skin Friendly",
      "Cruelty Free",
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
    icons: ["Natural Oils", "Paraben Free", "Skin Safe", "Vegan"],
    howToUse:
      "Rediscover purity in every wash. Gentle ingredients inspired by nature, free from harshness.",
    ingredients:
      "Coconut Oil, Glycerin, Castor Oil, Natural Essential Oil, Vitamin C, Energized Water",
    caution:
      "Avoid eye contact. Discontinue use if irritation occurs. Keep out of reach of children.",
  },
  oil: {
    title: "ESSENTIAL OIL",
    icons: ["Pure Oil", "No Additives", "Therapeutic", "Cruelty Free"],
    howToUse:
      "12’s Essential Oil is best used in three ways—by inhaling through a diffuser, applying on your skin after mixing with a carrier oil, or adding to your bath after proper dilution.",
    ingredients: "100% Pure Essential Oil Extracts, Natural Essential Oils.",
    caution:
      "Always dilute before use. Avoid eye contact. Do not ingest. Keep away from children. Do a patch test.",
  },
  eaudeperfumes: {
    title: "PERFUMES",
    icons: ["Natural Oils", "Skin Safe", "Vegan", "Long Lasting"],
    howToUse:
      "12’s Perfumes are designed for gentle elegance. Spray on pulse points like wrists and neck to uplift your spirit.",
    ingredients:
      "Denatured Spirit, Aromatic Substances, Dipropylene Glycol, Quantum Satis",
    caution:
      "Flammable. Keep away from heat and direct sunlight. Avoid Eye Contact.",
  },
  bodylotion: {
    title: "BODY LOTION",
    icons: ["Moisturizing", "No Additives", "Therapeutic", "Skin Friendly"],
    howToUse:
      "Apply on slightly damp skin. Gently massage in upward circular motions until fully absorbed for a radiant glow.",
    ingredients:
      "Aloe Vera Extract, Honey, Vitamin E Acetate, Shea Butter, Jojoba Seed Oil, Hyaluronic Acid",
    caution:
      "Store in a cool, dry place away from direct sunlight. Avoid eye contact.",
  },
  hamper: {
    title: "CURATED ZODIAC HAMPER",
    icons: ["Complete Care", "Premium Gift", "Zodiac Inspired", "Cruelty Free"],
    howToUse:
      "This hamper contains a curated selection of products. Refer to each individual product within the hamper for specific usage instructions.",
    ingredients:
      "A proprietary blend of Bath Gel, Soap, Essential Oil, and Perfume tailored to your Zodiac energy.",
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

const Productdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Added this
  const [active, setActive] = useState("bath");
  const [activeTab, setActiveTab] = useState("bath");
  const [dbProduct, setDbProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/products/${id}`
        );
        const product = response.data;
        setDbProduct(product);

        if (product.Category) {
          const dbCat = product.Category.toLowerCase().trim();
          if (categoryMap[dbCat]) setActiveTab(categoryMap[dbCat]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    if (id) fetchProductData();
  }, [id]);

  const addToGuestCart = () => {
    let cart = [];

    try {
      const stored = Cookies.get("guestCart");
      cart = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    const existing = cart.find((item) => item.productId === dbProduct._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        type: "product",
        productId: dbProduct._id,
        quantity: 1,
        price: dbProduct.ProductPrice,
        name: dbProduct.ProductName,
        img: dbProduct.Photos,
      });
    }

    Cookies.set("guestCart", JSON.stringify(cart), { expires: 7 });
    navigate("/cart");
  };

  const addToCart = async () => {
    if (!dbProduct) return;

    const token = localStorage.getItem("token");

    // ✅ USER LOGGED IN
    if (token) {
      try {
        await axios.post(
          "http://localhost:4000/api/add-to-cart",
          {
            productId: dbProduct._id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        navigate("/cart");
      } catch (error) {
        console.error("Add to cart error:", error.response?.data || error);
        if (error.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    }

    // ✅ GUEST USER
    else {
      let cart = [];

      try {
        const stored = Cookies.get("guestCart");
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

      Cookies.set("guestCart", JSON.stringify(cart), { expires: 7 });
      navigate("/cart");
    }
  };

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

      <section className="zodiac-hero">
        <motion.img
          src="/images/tolvv.jpg " // 👈 your banner image
          alt="Hero Banner"
          className="zodiac-hero-img"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </section>

      <Container fluid className="py-5 container sora">
        <Row className="align-items-start">
          <Col md={6}>
            <motion.img
              key={dbProduct.Photos}
              src={
                dbProduct.Photos.startsWith("http")
                  ? dbProduct.Photos
                  : `http://localhost:4000${dbProduct.Photos}`
              }
              alt={dbProduct.ProductName}
              className="img-fluid rounded shadow-sm w-100"
              style={{ objectFit: "cover", maxHeight: "600px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          </Col>

          <Col md={6}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="fw-bold playfair-display">
                  {dbProduct.ProductName}
                </h1>
                <h3 className="text-muted playfair-display mb-4">
                  {productInfo[activeTab]?.title}
                </h3>

                {dbProduct.Category === "Hamper" && (
                  <div className="mb-3">
                    <span className="badge bg-dark me-2">
                      Zodiac: {dbProduct.Zodiac}
                    </span>
                    <span className="badge bg-secondary">
                      Size: {dbProduct.size}
                    </span>
                  </div>
                )}

                <div className="mb-4 d-flex flex-wrap gap-2">
                  {productInfo[activeTab]?.icons.map((icon, idx) => (
                    <span
                      key={idx}
                      className="badge bg-light text-dark border p-2 px-3"
                    >
                      {icon}
                    </span>
                  ))}
                </div>

                <div className="details-text">
                  <h6 className="fw-bold">HOW TO USE</h6>
                  <p>{productInfo[activeTab]?.howToUse}</p>

                  <h6 className="fw-bold">INGREDIENTS</h6>
                  <p className="text-secondary">
                    {productInfo[activeTab]?.ingredients}
                  </p>

                  <h6 className=" fw-bold">CAUTION</h6>
                  <p className="small ">{productInfo[activeTab]?.caution}</p>
                </div>

                <h2 className="mt-4">₹{dbProduct.ProductPrice}</h2>
                <button
                  onClick={addToCart}
                  className="btn btn-dark btn-lg mt-3 px-5 "
                >
                  ADD TO CART
                </button>
              </motion.div>
            </AnimatePresence>
          </Col>
        </Row>

        <hr />
        {/* PRODUCT SWITCHER */}
        <Row className="mt-5 text-center">
          {[
            { key: "bath", label: "BATH LOTION" },
            { key: "soap", label: "SOAP" },
            { key: "oil", label: "ESSENTIAL OIL" },
            { key: "eaudeperfumes", label: "EAU DE PERFUMES" },
            { key: "bodylotion", label: "BATH GEL" },
          ].map((item) => (
            <Col xs={4} md={2} key={item.key}>
              <span
                className={`product-link ${
                  active === item.key ? "active" : ""
                }`}
                onClick={() => setActive(item.key)}
              >
                {item.label}
              </span>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Productdetails;
