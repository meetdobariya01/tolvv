import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./zodics.css";
import axios from "axios";
import Calculator from "../../components/calculator/calculator";

const Zodic = () => {
  const zodiacData = {
    Aries: {
      name: "Aries",
      date: "March 21 - April 19",
      color: "#7A1318",
      icon: "./images/zodiac/1.png",
      description:
        "Aries, the natural ruler of healthy self-esteem, ego, fresh beginnings, spring, and physical presence, embodies the essence of selfhood. It is the sign of initiation—the spark that givesrise to identity and expression. At its core, Aries represents the formation of a strong, authentic sense of Self. Yet true evolution for Aries comes not only through bold individuality, but also through learning adaptability—acting with conviction while recognizing its role as a vital part of the greater whole.",
      letters: "A, L, E, I, O",
      energy: "Courage, Stamina",
      stamina: "High",
      colorText: "Red",
      element: "Fire",
      planet: "Mars",
      herbs: [
        "./images/ginger.png",
        "./images/cinnamon.png",
        "./images/coconut.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },

    Taurus: {
      name: "Taurus",
      date: "April 20 - May 20",
      color: "#7A8B3D",
      icon: "./images/zodiac/2.png",
      description:
        "Grounded, sensual, and steadfast — Taurus reigns as the most earthy of the earth signs, embodying loyalty, prosperity, and a deep-rooted kindness. This sign’s true evolution lies in mastering the art of balance — embracing inevitable change while staying connected to its innate power to create, nurture, and build enduring foundations.",
      letters: "B, V, U",
      energy: "Stability, Sensuality",
      stamina: "Strong",
      colorText: "Forest Green",
      element: "Earth",
      planet: "Venus",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },

    Gemini: {
      name: "Gemini",
      date: "May 21 - June 20",
      color: "#BB892C",
      icon: "./images/zodiac/3.png",
      description:
        "Masters of the information age, Geminis are natural shape shifters — swift, curious, and everevolving. They move effortlessly between realms of thought and feeling, bridging the conscious and the unseen, the earthly and the divine. Intelligent, expressive, and endlessly adaptable, Gemini’s true growth unfolds when they release the need for mental control and surrender to stillness — allowing truth to rise naturally into clarity and deeper understanding.",
      letters: "K, Chh, Gh, Q, C",
      energy: "Divine Intelligence",
      stamina: "Medium",
      colorText: "Orange",
      element: "Air",
      planet: "Mercury",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },

    Cancer: {
      name: "Cancer",
      date: "June 21 - July 22",
      color: "#8A8C8E",
      icon: "./images/zodiac/4.png",
      description:
        "The Cancer archetype embodies The Great Mother and The Queen — the divine nurturer within us all. Guided by instinct and attuned to the needs of others, Cancer offers unconditional care and emotional depth. Ruled by the Moon, they ebb and flow with life’s unseen tides, sensing what lies beneath the surface. Natural homemakers and protectors, their evolution comes through expanding that sacred sense of belonging — extending the love of home and family to embrace the earth and all living beings.",
      letters: "D, H",
      energy: "Caring, Empathy",
      stamina: "Moderate",
      colorText: "Deep Blue, Violets",
      element: "Water",
      planet: "The Moon",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },

    Leo: {
      name: "Leo",
      date: "July 23 - August 22",
      color: "#E8C43A",
      icon: "./images/zodiac/5.png",
      description:
        "Like the Lion, Leo stands proud — confident, noble, and generous at heart. Playful and expressive, they thrive in the spotlight, drawn to create, perform, and be seen. Yet true Leo maturity unfolds in the realization that their purpose is not to be the light’s source, but its radiant expression — to shine with warmth, creativity, and love, offering their brilliance as a gift of joy and blessing to the world.",
      letters: "M, T",
      energy: "Beholding Beauty",
      stamina: "High",
      colorText: "Gold",
      element: "Fire",
      planet: "The Sun",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },

    Virgo: {
      name: "Virgo",
      date: "August 23 - September 22",
      color: "#DC4D2D",
      icon: "./images/zodiac/6.png",
      description:
        "The grounded face of Mercury, Virgo embodies precision, practicality, and quiet mastery. Attuned to body, mind, and environment, Virgos move through life with purpose and care, guided by an innate desire for order and well-being. Their true evolution begins when they transcend the divide born from constant self-critique and analysis — awakening instead to a higher wisdom of inclusiveness, compassion, and the seamless unity between themselves and the world they so thoughtfully tend.",
      letters: "P,Tha, N, T, sha",
      energy: "Analysis, Order",
      stamina: "Strong",
      colorText: "Brown",
      element: "Earth",
      planet: "Mercury",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },
    Libra: {
      name: "Libra",
      date: "September 23 - October 22",
      color: "#FF4E4C",
      icon: "./images/zodiac/7.png",
      description:
        "Bearers of beauty, balance, and justice, Libras embody grace in connection. Naturally social and harmonizing, they seek depth and wisdom in partnership, valuing relationships as mirrors of growth and meaning. Libra’s true evolution unfolds in the realization that wholeness begins within — that through self-awareness and authentic connection, they serve both personal harmony and the greater equilibrium of all life.",
      letters: "R, T",
      energy: "Balance, Relating",
      stamina: "Medium",
      colorText: "Pink",
      element: "Air",
      planet: "Venus",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },
    Scorpio: {
      name: "Scorpio",
      date: "October 23 - November 21",
      color: "#000000",
      icon: "./images/zodiac/8.png",
      description:
        "The innate master of transformation, Scorpio governs the realms of rebirth, depth, and emotional power. Co-ruled by Mars and Pluto, this sign moves through life with intensity and purpose, unafraid to explore the shadows in pursuit of truth. Scorpio’s true liberation arises in the cycle of surrender — in releasing the identities they so passionately build, only to be reborn, again and again, into greater authenticity and freedom.",
      letters: "N, Y",
      energy: "Alchemy, Transformation",
      stamina: "Very High",
      colorText: "Burgundy",
      element: "Water",
      planet: "Pluto / Mars",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },
    Sagittarius: {
      name: "Sagittarius",
      date: "November 22 - December 21",
      color: "#74489D",
      icon: "./images/zodiac/9.png",
      description:
        "Sagittarius, the Zodiac’s freedom-loving explorer, thrives on curiosity, philosophy, and visionary ideals. Open-minded and discerning, they recognize the limits of all belief systems, finding meaning in both worldly journeys and inner, spiritual quests. True evolution for Sagittarius comes when they surrender the pursuit of perfection, embracing instead the rich, messy reality of humanity as it is — discovering joy and wisdom in life’s imperfect truths.",
      letters: "Bh, Dh, Ph, Ddh",
      energy: "Freedom, Devinity",
      stamina: "High",
      colorText: "Purple",
      element: "Fire",
      planet: "Jupiter",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },
    Capricorn: {
      name: "Capricorn",
      date: "December 22 - January 19",
      color: "#F1E1CF",
      icon: "./images/zodiac/10.png",
      description:
        "Ruled by Saturn, Capricorn excels at constructing both tangible and mental frameworks. Practical, disciplined, and results-driven, they often shine in business and endeavours requiring focus and mastery. True Capricorn maturity arises when they move beyond merely preserving tradition, channelling their drive to create innovative structures that serve, uplift, and honour the evolving world around them.",
      letters: "Kh, J",
      energy: "Driven, Ambitious",
      stamina: "Strong",
      colorText: "Grey",
      element: "Earth",
      planet: "Saturn",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },
    Aquarius: {
      name: "Aquarius",
      date: "January 20 - February 18",
      color: "#519AA2",
      icon: "./images/zodiac/11.png",
      description:
        "Co-ruled by Saturn and Uranus, Aquarius embodies the spirit of creative individuality. Independent yet deeply connected, they navigate life with intellect, originality, and a forward-thinking edge. Often altruistic and socially aware, Aquarians thrive on innovation and postconventional insight. Their true evolution emerges when they recognize that personal growth and the advancement of humanity are intertwined — that the highest expression of their power lies in serving the greater whole.",
      letters: "G, S, Sh",
      energy: "Visionary, Creativity",
      stamina: "Medium",
      colorText: "Turquoise",
      element: "Air",
      planet: "Saturn & Uranus",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },
    Pisces: {
      name: "Pisces",
      date: "February 19 - March 20",
      color: "#043D5D",
      icon: "./images/zodiac/12.png",
      description:
        "The imaginative mystic of the Zodiac, Pisces embodies a rich tapestry of intuition, empathy, spirituality, and artistic sensitivity. Deeply attuned to the interconnectedness of all life, they move through the world with compassion and devotion. True growth for Pisces comes not from retreating into illusion, but from embracing the courage to transform themselves — and, in doing so, to leave a meaningful imprint on the world around them.",
      letters: "D, Ch, Z, Th",
      energy: "Cretivity, Mysticism",
      stamina: "Low",
      colorText: "sea foam green",
      element: "Water",
      planet: "Neptune / Jupiter",
      herbs: [
        "./images/cinnamon.png",
        "./images/coconut.png",
        "./images/ginger.png",
      ],
      products: [
        { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
        { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
        { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
        { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
        { name: "Soap", size: "100 gm", img: "./images/sp.png" },
      ],
    },
  };

  const zodiacSigns = [
    { name: "Aries", color: "none", image: "./images/zodiac/aries.png" },
    { name: "Taurus", color: "#7A8B3D", image: "./images/zodiac/2.png" },
    { name: "Gemini", color: "#BB892C", image: "./images/zodiac/3.png" },
    { name: "Cancer", color: "#8A8C8E", image: "./images/zodiac/4.png" },
    { name: "Leo", color: "#E8C43A", image: "./images/zodiac/5.png" },
    { name: "Virgo", color: "#DC4D2D", image: "./images/zodiac/6.png" },
    { name: "Libra", color: "#FF4E4C", image: "./images/zodiac/7.png" },
    { name: "Scorpio", color: "#000000", image: "./images/zodiac/8.png" },
    { name: "Sagittarius", color: "#74489D", image: "./images/zodiac/9.png" },
    { name: "Capricorn", color: "#F1E1CF", image: "./images/zodiac/10.png" },
    { name: "Aquarius", color: "#519AA2", image: "./images/zodiac/11.png" },
    { name: "Pisces", color: "#043D5D", image: "./images/zodiac/12.png" },
  ];
  const API_URL = process.env.REACT_APP_API_URL;

  const [activeKey, setActiveKey] = useState(null);
  const [productsByZodiac, setProductsByZodiac] = useState({});
  const navigate = useNavigate();
  const Zodiac = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  const token = localStorage.getItem("token");
  const [selectedZodiac, setSelectedZodiac] = useState(zodiacData["Aries"]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        const data = res.data;

        const grouped = {};
        Zodiac.forEach((cat) => (grouped[cat] = []));

        data.forEach((prod) => {
          const Zodiac = prod.Zodiac?.trim();
          if (grouped[Zodiac]) {
            // 🚫 Prevent duplicates
            if (!grouped[Zodiac].find((p) => p._id === prod._id)) {
              grouped[Zodiac].push(prod);
            }
          }
        });

        setProductsByZodiac(grouped);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  // const handleBuyNow = async (productId) => {

  //   if (!token) {
  //     alert("Please login first!");
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     await axios.post(
  //       `${API_URL}/add-to-cart`,
  //       { productId, quantity: 1 },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     navigate("/cart");
  //   } catch (err) {
  //     console.error("Add to cart failed:", err);
  //     alert("Failed to add product to cart.");
  //   }
  // };
  const handleBuyNow = async (productId) => {
    if (!token) {
      alert("Please login first!");
      return navigate("/login");
    }

    try {
      await axios.post(
        `${API_URL}/add-to-cart`,
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/cart");
    } catch (err) {
      console.error("Add to cart failed:", err.response || err.message);
      alert(err.response?.data?.message || "Failed to add product to cart.");
    }
  };

  return (
    <div>
      {/* TOP SECTION */}
      <div className="twelve-section">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center text-white p-4 container">
          {/* Left */}
          <div className="left-text text-center mb-4">
            <h2 className="tangerine-bold">The Twelve</h2>
            <p className="subtitle">
              EXPLORE BY YOUR SUN, <br /> MOON OR RISING SIGN
            </p>
            <p className="subtitle">Find Your Zodiac Sign</p>

            <Calculator />
          </div>

          {/* Zodiac Grid */}
          <div className="zodiac-grid container">
            <div className="row g-4 justify-content-center p-5 ">
              {zodiacSigns.map((sign, index) => (
                <div
                  key={index}
                  className="col-4 col-sm-4 col-md-3 text-center pointer"
                  onClick={() => setSelectedZodiac(zodiacData[sign.name])}
                >
                  <div
                    className="zodiac-circle mx-auto"
                    style={{ backgroundColor: sign.color }}
                  >
                    <img
                      src={sign.image}
                      alt={sign.name}
                      className="zodiac-image"
                    />
                  </div>
                  <p className="zodiac-name mt-2">{sign.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Vertical Text */}
          <div className="vertical-text d-none d-md-block">
            <span>NURTURE YOUR NATURE</span>
          </div>
        </div>
      </div>

      {/* RED SECTION (Dynamic Content) */}
      <section
        className="aries-section text-center"
        style={{ backgroundColor: selectedZodiac.color }}
      >
        <div className="aries-content container">
          <h1
            className="aries-title"
            style={{
              color: selectedZodiac.name === "Capricorn" ? "black" : "",
            }}
          >
            {selectedZodiac.name}
          </h1>

          <div className="aries-icon-circle">
            <img
              src={selectedZodiac.icon}
              alt="icon"
              className="aries-icon-img"
            />
          </div>

          <p
            className="aries-date"
            style={{
              color: selectedZodiac.name === "Capricorn" ? "black" : "",
            }}
          >
            Date : {selectedZodiac.date}
          </p>

          <p
            className="aries-description"
            style={{
              color: selectedZodiac.name === "Capricorn" ? "black" : "",
            }}
          >
            {selectedZodiac.description}
          </p>

          <p
            className="aries-details"
            style={{
              color: selectedZodiac.name === "Capricorn" ? "black" : "",
            }}
          >
            <span>Corresponding Letters : {selectedZodiac.letters}</span> &nbsp;
            | &nbsp;
            <span>Astral Energy : {selectedZodiac.energy}</span> &nbsp; | &nbsp;
            <span>Stamina : {selectedZodiac.stamina}</span>
            <br />
            <span>Colour : {selectedZodiac.colorText}</span> &nbsp; | &nbsp;
            <span>Element : {selectedZodiac.element}</span> &nbsp; | &nbsp;
            <span>Ruling Planet : {selectedZodiac.planet}</span>
          </p>
        </div>

        {/* Herbs Section */}
        <div className="aries-images container d-flex justify-content-center gap-5 flex-wrap">
          {selectedZodiac.herbs.map((img, i) => (
            <img key={i} src={img} alt="herb" className="half-out-image" />
          ))}
        </div>

        {/* PRODUCTS */}
        {/* PRODUCTS – WHITE BACKGROUND */}
      </section>
      <div className="product-wrapper py-5">
        <h2 className="product-heading the-artisan-font mb-4 text-center">
          {selectedZodiac.name} Products
        </h2>

        <div className="container">
          <div className="product-grid">
            {productsByZodiac[selectedZodiac.name]?.map((p, index) => (
              <div className="product-card" key={index}>
                <div className="product-box-zodiac">
                  <img
                    src={p.Photos}
                    alt={p.ProductName}
                    className="product-img"
                  />

                  <div className="product-info">
                    <p className="name">{p.ProductName}</p>
                    <p className="size">{p.size}</p>
                    <p className="price">₹{p.ProductPrice}</p>

                    <div className="underline" />
                    <button
                      className="buy-btn mt-1"
                      onClick={() => handleBuyNow(p._id)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zodic;
