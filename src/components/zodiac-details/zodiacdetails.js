import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./zodiacdetails.css";

const Zodiacdetails = () => {
  const zodiacData = {
    Aries: {
      name: "Aries",
      date: "March 21 - April 19",
      color: "#C10230",
      icon: "/images/zodiac/1.png",
      description:
        "Aries, the natural ruler of healthy self-esteem, ego, fresh beginnings, spring, and physical presence, embodies the essence of selfhood. It is the sign of initiation—the spark that gives rise to identity and expression. At its core, Aries represents the formation of a strong, authentic sense of Self. Yet true evolution for Aries comes not only through bold individuality, but also through learning adaptability—acting with conviction while recognizing its role as a vital part of the greater whole.",
      letters: "A, L, E, I, O",
      energy: "Courage, Smamina",
      stamina: "High",
      colorText: "Red",
      element: "Fire",
      planet: "Mars",
      herbs: [
        "/images/ingredient/Ginger-12.png",
        "/images/ingredient/Cinnamon-07.png",
        "/images/ingredient/Coconut-Oil-10.png",
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
      color: "#4D5A31",
      icon: "/images/zodiac/2.png",
      description:
        "Grounded, sensual, and steadfast — Taurus reigns as the most earthy of the earth signs, embodying loyalty, prosperity, and a deep-rooted kindness. This sign’s true evolution lies in mastering the art of balance — embracing inevitable change while staying connected to its innate power to create, nurture, and build enduring foundations.",
      letters: "B, V, U",
      energy: "Stability, sensuality",
      stamina: "Strong",
      colorText: "Forest Green",
      element: "Earth",
      planet: "Venus",
      herbs: [
        "/images/ingredient/Vanilla-20.png",
        "/images/ingredient/Rose-06.png",
        "/images/ingredient/Sandalwood-11.png",
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
      color: "#7E622D",
      icon: "/images/zodiac/3.png",
      description:
        "Masters of the information age, Geminis are natural shape shifters — swift, curious, and everevolving. They move effortlessly between realms of thought and feeling, bridging the conscious and the unseen, the earthly and the divine. Intelligent, expressive, and endlessly adaptable, Gemini’s true growth unfolds when they release the need for mental control and surrender to stillness — allowing truth to rise naturally into clarity and deeper understanding.",
      letters: "K, Chh, Gh, Q, C",
      energy: "Divine Intelligence",
      stamina: "Medium",
      colorText: "Orange ",
      element: "Air",
      planet: "Mercury",
      herbs: [
        "/images/ingredient/Lavender-04.png",
        "/images/ingredient/Lemon-08.png",
        "/images/ingredient/Basil-15.png",
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
      color: "#5F504D",
      icon: "/images/zodiac/4.png",
      description:
        "The Cancer archetype embodies The Great Mother and The Queen — the divine nurturer within us all. Guided by instinct and attuned to the needs of others, Cancer offers unconditional care and emotional depth. Ruled by the Moon, they ebb and flow with life’s unseen tides, sensing what lies beneath the surface. Natural homemakers and protectors, their evolution comes through expanding that sacred sense of belonging — extending the love of home and family to embrace the earth and all living beings.",
      letters: "Dd, H",
      energy: "Caring, Empathy",
      stamina: "Moderate",
      colorText: "Deep Blue, Violet",
      element: "Water",
      planet: "The Moon",
      herbs: [
        "/images/ingredient/Coconut-Oil-10.png",
        "/images/ingredient/Rosemary-01.png",
        "/images/ingredient/Sandalwood-11.png",
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
      color: "#D7982B",
      icon: "/images/zodiac/5.png",
      description:
        "Like the Lion, Leo stands proud — confident, noble, and generous at heart. Playful and expressive, they thrive in the spotlight, drawn to create, perform, and be seen. Yet true Leo maturity unfolds in the realization that their purpose is not to be the light’s source, but its radiant expression — to shine with warmth, creativity, and love, offering their brilliance as a gift of joy and blessing to the world.",
      letters: "M, T",
      energy: "Beholding Beauty",
      stamina: "High",
      colorText: "Gold",
      element: "Fire",
      planet: "The Sun",
      herbs: [
        "/images/ingredient/Honey-16.png",
        "/images/ingredient/Alo-Vera-Extract-02.png",
        "/images/ingredient/Cinnamon-07.png",
        "/images/ingredient/Orange-17.png",
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
      color: "#85422B",
      icon: "/images/zodiac/6.png",
      description:
        "The grounded face of Mercury, Virgo embodies precision, practicality, and quiet mastery. Attuned to body, mind, and environment, Virgos move through life with purpose and care, guided by an innate desire for order and well-being. Their true evolution begins when they transcend the divide born from constant self-critique and analysis — awakening instead to a higher wisdom of inclusiveness, compassion, and the seamless unity between themselves and the world they so thoughtfully tend.",
      letters: "P, Tha, N, T, Sha",
      energy: "Analysis, Order",
      stamina: "Strong",
      colorText: "Brown",
      element: "Earth",
      planet: "Mercury",
      herbs: [
        "/images/ingredient/Lavender-04.png",
        "/images/ingredient/Fennel-21.png",
        "/images/ingredient/Lemongrass-18.png",
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
      color: "#AE1857",
      icon: "/images/zodiac/7.png",
      description:
        "Bearers of beauty, balance, and justice, Libras embody grace in connection. Naturally social and harmonizing, they seek depth and wisdom in partnership, valuing relationships as mirrors of growth and meaning. Libra’s true evolution unfolds in the realization that wholeness begins within — that through self-awareness and authentic connection, they serve both personal harmony and the greater equilibrium of all life.",
      letters: "R, T",
      energy: "Balance, Relating",
      stamina: "Medium",
      colorText: "Pink",
      element: "Air",
      planet: "Venus",
      herbs: [
        "/images/ingredient/Rose-06.png",
        "/images/ingredient/Lavender-04.png",
        "/images/ingredient/Shea-Butter-19.png",
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
      color: "#2D2A26",
      icon: "/images/zodiac/8.png",
      description:
        "The innate master of transformation, Scorpio governs the realms of rebirth, depth, and emotional power. Co-ruled by Mars and Pluto, this sign moves through life with intensity and purpose, unafraid to explore the shadows in pursuit of truth. Scorpio’s true liberation arises in the cycle of surrender — in releasing the identities they so passionately build, only to be reborn, again and again, into greater authenticity and freedom.",
      letters: "N, Y",
      energy: "Alchemy, Transformation",
      stamina: "Very High",
      colorText: "Burgundy",
      element: "Water",
      planet: "Pluto / Mars",
      herbs: [
        "/images/ingredient/Jojaba-Seed-14.png",
        "/images/ingredient/Jasmine-09.png",
        "/images/ingredient/Black-Pepper-13.png",
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
      color: "#490E67",
      icon: "/images/zodiac/9.png",
      description:
        "Sagittarius, the Zodiac’s freedom-loving explorer, thrives on curiosity, philosophy, and visionary ideals. Open-minded and discerning, they recognize the limits of all belief systems, finding meaning in both worldly journeys and inner, spiritual quests. True evolution for Sagittarius comes when they surrender the pursuit of perfection, embracing instead the rich, messy reality of humanity as it is — discovering joy and wisdom in life’s imperfect truths.",
      letters: "Bh, Dh, Ph, Ddh",
      energy: "Freedom, Divinity",
      stamina: "High",
      colorText: "Purple",
      element: "Fire",
      planet: "Jupiter",
      herbs: [
        "/images/ingredient/Clove-05.png",
        "/images/ingredient/Ginger-12.png",
        "/images/ingredient/Black-Pepper-13.png",
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
      color: "#726B54",
      icon: "/images/zodiac/10.png",
      description:
        "Ruled by Saturn, Capricorn excels at constructing both tangible and mental frameworks. Practical, disciplined, and results-driven, they often shine in business and endeavours requiring focus and mastery. True Capricorn maturity arises when they move beyond merely preserving tradition, channelling their drive to create innovative structures that serve, uplift, and honour the evolving world around them.",
      letters: "Kh, J",
      energy: "Driven, Ambitious",
      stamina: "Strong",
      colorText: "Grey",
      element: "Earth",
      planet: "Saturn",
      herbs: [
        "/images/ingredient/CARNATION-FLOWER-03.png",
        "/images/ingredient/Rosemary-01.png",
        "/images/ingredient/Lavender-04.png",
        "/images/ingredient/Lemongrass-18.png",
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
      color: "#005D63",
      icon: "/images/zodiac/11.png",
      description:
        "Co-ruled by Saturn and Uranus, Aquarius embodies the spirit of creative individuality. Independent yet deeply connected, they navigate life with intellect, originality, and a forward-thinking edge. Often altruistic and socially aware, Aquarians thrive on innovation and postconventional insight. Their true evolution emerges when they recognize that personal growth and the advancement of humanity are intertwined — that the highest expression of their power lies in serving the greater whole.",
      letters: "G, S, Sh",
      energy: "Visionary Creativity",
      stamina: "Medium",
      colorText: "Turquoise",
      element: "Air",
      planet: "Uranus / Saturn",
      herbs: [
        "/images/ingredient/Lemon-08.png",
        "/images/ingredient/Jasmine-09.png",
        "/images/ingredient/Sandalwood-11.png",
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
      color: "#006098",
      icon: "/images/zodiac/12.png",
      description:
        "Pisces is sensitive, intuitive, and artistic—compassionate and spiritual. They inspire creativity, empathy, healing, and kindness, seeing the world through soulful perception.",
      letters: "D, Ch, Z, Th",
      energy: "Creativity, Mysticism",
      stamina: "Low",
      colorText: "Sea Foam Green",
      element: "Water",
      planet: "Neptune / Jupiter",
      herbs: [
        "/images/ingredient/Sandalwood-11.png",
        "/images/ingredient/Lavender-04.png",
        "/images/ingredient/Clove-05.png",
        "/images/ingredient/Rose-06.png",
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
    { name: "Aries", color: "#7A1318", image: "/images/zodiac/1-2.png" },
    { name: "Taurus", color: "#7A8B3D", image: "/images/zodiac/2-2.png" },
    { name: "Gemini", color: "#BB892C", image: "/images/zodiac/3-2.png" },
    { name: "Cancer", color: "#8A8C8E", image: "/images/zodiac/4-2.png" },
    { name: "Leo", color: "#E8C43A", image: "/images/zodiac/5-2.png" },
    { name: "Virgo", color: "#DC4D2D", image: "/images/zodiac/6-2.png" },
    { name: "Libra", color: "#FF4E4C", image: "/images/zodiac/7-2.png" },
    { name: "Scorpio", color: "#000000", image: "/images/zodiac/8-2.png" },
    { name: "Sagittarius", color: "#74489D", image: "/images/zodiac/9-2.png" },
    { name: "Capricorn", color: "#F1E1CF", image: "/images/zodiac/10-2.png" },
    { name: "Aquarius", color: "#519AA2", image: "/images/zodiac/11-2.png" },
    { name: "Pisces", color: "#043D5D", image: "/images/zodiac/12-2.png" },
  ];

  const API_URL = process.env.REACT_APP_API_URL;

  // const [activeKey, setActiveKey] = useState(null);
  const [productsByZodiac, setProductsByZodiac] = useState({});
  // const navigate = useNavigate();
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
  // const token = localStorage.getItem("token");
  const [selectedZodiac, setSelectedZodiac] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        const data = res.data;

        const grouped = {};
        Zodiac.forEach((cat) => (grouped[cat] = []));

        data.forEach((prod) => {
          const zodiac = prod.Zodiac?.trim();
          if (grouped[zodiac]) {
            if (!grouped[zodiac].find((p) => p._id === prod._id)) {
              grouped[zodiac].push(prod);
            }
          }
        });

        setProductsByZodiac(grouped);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  });

  return (
    <div>
      <div>
        {/* TOP SECTION */}
        <div className="twelve-section-details py-5">
          <div className="container">
            <div className="row align-items-center text-white">
              {/* LEFT TEXT */}
              {/* <div className="col-12 col-md-4 text-center  left-text">
                <h2 className="artisan-font">The Twelves</h2>
                <p className="subtitle sora">EXPLORE BY YOUR SUN SIGN</p>
                <div className="my-5">
                  <Calculator />
                </div>
              </div> */}

              {/* ZODIAC GRID */}
              <div className="container details-zodiac-section text-center sora">
                <h5 className="mb-4 text-dark fw-semibold text-start">
                  Explore Other Sun Sign
                </h5>

                <div className="row justify-content-center details-zodiac-row">
                  {zodiacSigns.map((sign, index) => (
                    <div
                      key={index}
                      className="col-3 col-sm-3 col-md-2 col-lg-1 details-zodiac-item"
                      onClick={() => setSelectedZodiac(zodiacData[sign.name])}
                    >
                      <div className="details-zodiac-circle">
                        <img
                          src={sign.image}
                          alt={sign.name}
                          className="details-zodiac-image"
                        />
                      </div>
                      <p className="details-zodiac-name mt-2 text-dark">
                        {sign.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT VERTICAL TEXT */}
              {/* <div className="col-md-1 d-none d-md-flex ">
                <div className="vertical-text">
                  NURTURE <span className="fw-light">YOUR</span> NATURE
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* RED SECTION (Dynamic Content) */}
        {selectedZodiac && (
          <section
            className="aries-section text-center"
            style={{ backgroundColor: selectedZodiac.color }}
          >
            <div className="aries-content inter container sora">
              <div className="zodiac-header text-white text-center">
                {/* <p className="aries-date mb-3">{selectedZodiac.date}</p> */}

                <div className="d-none d-md-block">
                  <div className="d-flex justify-content-center align-items-center gap-5  ">
                    <div className="d-block">
                      <h1 className="aries-title gt-super mb-0">
                        {selectedZodiac.name}
                      </h1>
                      <p className="aries-date mb-3 gt-super">
                        {selectedZodiac.date}
                      </p>
                    </div>
                    <div
                      className="aries-icon-circle d-flex justify-content-center align-items-center"
                      style={{ backgroundColor: selectedZodiac.color }}
                    >
                      <img
                        src={selectedZodiac.icon}
                        alt="icon"
                        className="aries-icon-img"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-block d-md-none">
                <div className="zodiac-header text-white d-flex justify-content-center align-items-center text-center">
                  <div>
                    <div
                      className="aries-icon-circle d-flex justify-content-center align-items-center mx-auto"
                      style={{ backgroundColor: selectedZodiac.color }}
                    >
                      <img
                        src={selectedZodiac.icon}
                        alt="icon"
                        className="aries-icon-img"
                      />
                    </div>

                    <h1 className="aries-title text-center gt-super mb-0">
                      {selectedZodiac.name}
                    </h1>
                    <p className="aries-date gt-super mb-3">
                      {selectedZodiac.date}
                    </p>
                  </div>
                </div>
              </div>

              <p className="aries-description mt-3">
                {selectedZodiac.description}
              </p>

              <p className="aries-details">
                <span>Corresponding Letters : {selectedZodiac.letters}</span>{" "}
                &nbsp; | &nbsp;
                <span>Astral Energy : {selectedZodiac.energy}</span> &nbsp; |
                &nbsp;
                <span>Stamina : {selectedZodiac.stamina}</span>
                <br />
                <span>Colour : {selectedZodiac.colorText}</span> &nbsp; | &nbsp;
                <span>Element : {selectedZodiac.element}</span> &nbsp; | &nbsp;
                <span>Ruling Planet : {selectedZodiac.planet}</span>
              </p>
            </div>

            <p className="gt-super ingredients">INGREDIENTS</p>

            {/* Herbs Section */}
            <div className="aries-images container d-flex justify-content-around  flex-wrap">
              {selectedZodiac.herbs.map((img, i) => (
                <img key={i} src={img} alt="herb" className="half-out-image" />
              ))}
            </div>

            {/* PRODUCTS */}
            {/* PRODUCTS – WHITE BACKGROUND */}
            <div className="product-wrapper py-5">
              {/* <h2 className="product-text mb-4 text-center sora">
            {xyz.find((item) => item.name === selectedZodiac.name)?.xyz1}
          </h2> */}

              <div className="container sora">
                <div className="product-grid mt-5">
                  {productsByZodiac[selectedZodiac.name]?.map((p, index) => (
                    <NavLink
                      to={`/productdetails/${p._id}`}
                      className="text-decoration-none"
                    >
                      <div className="product-card" key={index}>
                        <div className="product-box-zodiac p-1">
                          <img
                            src={
                              p.Photos?.[0]?.startsWith("http")
                                ? p.Photos[0]
                                : `/images/${p.Photos?.[0]?.replace("images/", "")}`
                            }
                            alt={p.ProductName}
                            className="zodiac-product-img"
                          />

                          <div className="product-info">
                            <p className="name">
                              {p.ProductName} <span>›</span>
                            </p>
                            {/* <p className="name">{p.ProductName}</p> */}
                            {/* <p className="size">{p.size}</p> */}
                            <div className="price-with-dot-1">
                              <span
                                className="zodiac-dot"
                                style={{
                                  backgroundColor: selectedZodiac.color,
                                }}
                              ></span>

                              <span className="zodiac-price">
                                ₹ {p.ProductPrice}
                              </span>
                            </div>

                            <div className="underline" />
                            <p className="size">{p.size}</p>
                            {/* <button
                        className="btn btn-outline-dark mt-1"
                        onClick={() => handleBuyNow(p)}
                      >
                        Buy Now
                      </button> */}
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Zodiacdetails;
