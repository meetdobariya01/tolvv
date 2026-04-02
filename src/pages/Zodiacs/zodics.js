import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./zodics.css";
import axios from "axios";
import Calculator from "../../components/calculator/calculator";
// import { Row, Col } from "react-bootstrap";
// import { motion } from "framer-motion";
// import Cookies from "js-cookie";

const Zodic = () => {
  // const [active, setActive] = useState(null);

  const zodiacColors = { Aries: "#7A1318", Taurus: "#7A8B3D", Gemini: "#BB892C", Cancer: "#8A8C8E", Leo: "#E8C43A", Virgo: "#DC4D2D", Libra: "#F04E4C", Scorpio: "#000000", Sagittarius: "#74489D", Capricorn: "#CCC29F", Aquarius: "#519AA2", Pisces: "#043D5D", }

  const zodiacData = {
    Aries: {
      name: "Aries",
      date: "March 21 - April 19",
      color: "#C10230",
      icon: "./images/zodiac/1.png",
      description:
        "Aries is the sign of bold beginnings—spirited, confident, and full of life force. Ruled by Mars and the element of Fire, it embodies courage and vitality. Our Aries blend reflects this vibrant energy with Coconut, Cinnamon, and Ginger. Coconut brings grounding nourishment, Cinnamon mirrors Aries’ warmth and passion, while Ginger adds an invigorating spark-awakening stamina and drive. A blend that celebrates the radiant spirit of Aries",
      letters: "A, L, E, I, O",
      energy: "Courage, Smamina",
      stamina: "High",
      colorText: "Red",
      element: "Fire",
      planet: "Mars",
      herbs: [
        "./images/ingredient/Ginger-12.png",
        "./images/ingredient/Cinnamon-07.png",
        "./images/ingredient/Coconut-Oil-10.png",
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
      icon: "./images/zodiac/2.png",
      description:
        "Taurus is the sign of grounding and abundance—steady, sensual, and deeply connected to nature. Ruled by Venus and the element of Earth, it embodies stability, comfort, and quiet strength. Our Taurus blend reflects this essence with Vanilla, Rose, and Sandalwood. Soft Vanilla brings warmth and comfort, Rose reflects Taurus’ love for beauty and sensuality, while Sandalwood offers a grounding depth—mirroring its calm strength and enduring nature. A blend that celebrates the serene, nurturing spirit of Taurus",
      letters: "B, V, U",
      energy: "Stability, sensuality",
      stamina: "Strong",
      colorText: "Forest Green",
      element: "Earth",
      planet: "Venus",
      herbs: [
        "./images/ingredient/Vanilla-20.png",
        "./images/ingredient/Rose-06.png",
        "./images/ingredient/Sandalwood-11.png",
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
      icon: "./images/zodiac/3.png",
      description:
        "Gemini is the sign of curiosity and expression—quick-witted, adaptable, and endlessly inquisitive. Ruled by Mercury and the element of Air, it reflects intelligence, communication, and lively energy. Our Gemini blend captures this spirit with Lavender, Lemon, and Basil. Calming Lavender brings moments of stillness, bright Lemon mirrors Gemini’s fresh, uplifting energy, while Basil adds clarity and focus—supporting its curious, active mind. A blend that celebrates the vibrant, thoughtful spirit of Gemini",
      letters: "K, Chh, Gh, Q, C",
      energy: "Divine Intelligence",
      stamina: "Medium",
      colorText: "Orange ",
      element: "Air",
      planet: "Mercury",
      herbs: [
        "./images/ingredient/Lavender-04.png",
        "./images/ingredient/Lemon-08.png",
        "./images/ingredient/Basil-15.png",
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
      icon: "./images/zodiac/4.png",
      description:
        "Cancer is the sign of nurturing and emotional depth—intuitive, protective, and deeply connected to home and belonging. Ruled by the Moon and the element of Water, it embodies empathy, care, and gentle strength. Our Cancer blend reflects this warmth with Coconut Oil, Rosemary, and Sandalwood. Nourishing Coconut Oil comforts and protects, Rosemary brings clarity and vitality, while Sandalwood offers grounding calm—mirroring Cancer’s nurturing and soulful nature. A blend that celebrates the caring spirit of Cancer.",
      letters: "Dd, H",
      energy: "Caring, Empathy",
      stamina: "Moderate",
      colorText: "Deep Blue, Violet",
      element: "Water",
      planet: "The Moon",
      herbs: [
        "./images/ingredient/Coconut-Oil-10.png",
        "./images/ingredient/Rosemary-01.png",
        "./images/ingredient/Sandalwood-11.png",
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
      icon: "./images/zodiac/5.png",
      description:
        "Leo is the sign of radiance and creativity—confident, expressive, and generous at heart. Ruled by the Sun and the element of Fire, it embodies warmth, vitality, and joyful selfexpression. Our Leo blend reflects this vibrant spirit with Aloe Vera, Cinnamon, Orange, and Honey. Soothing Aloe Vera nurtures the skin, bright Orange mirrors Leo’s joyful energy, while Cinnamon and Honey add warmth and richness—capturing the sign’s radiant presence. A blend that celebrates the luminous spirit of Leo",
      letters: "M, T",
      energy: "Beholding Beauty",
      stamina: "High",
      colorText: "Gold",
      element: "Fire",
      planet: "The Sun",
      herbs: [
        "./images/ingredient/Honey-16.png",
        "./images/ingredient/Alo-Vera-Extract-02.png",
        "./images/ingredient/Cinnamon-07.png",
        "./images/ingredient/Orange-17.png",
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
      icon: "./images/zodiac/6.png",
      description:
        "Virgo is the sign of refinement and care—practical, thoughtful, and quietly dedicated to wellbeing. Ruled by Mercury and the element of Earth, it reflects clarity, order, and mindful living. Our Virgo blend captures this essence with Lavender, Fennel, and Lemongrass. Calming Lavender brings balance, Fennel supports gentle restoration, while fresh Lemongrass offers clarity and lightness—echoing Virgo’s thoughtful precision. A blend that celebrates the pure, harmonious spirit of Virgo.",
      letters: "P, Tha, N, T, Sha",
      energy: "Analysis, Order",
      stamina: "Strong",
      colorText: "Brown",
      element: "Earth",
      planet: "Mercury",
      herbs: [
        "./images/ingredient/Lavender-04.png",
        "./images/ingredient/Fennel-21.png",
        "./images/ingredient/Lemongrass-18.png",
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
      icon: "./images/zodiac/7.png",
      description:
        "Libra is the sign of harmony and beauty—graceful, thoughtful, and naturally drawn to balance. Ruled by Venus and the element of Air, it reflects connection, elegance, and peaceful equilibrium. Our Libra blend expresses this grace with Lavender, Shea Butter, and Rose. Soothing Lavender brings calm balance, nourishing Shea Butter comforts the skin, while delicate Rose embodies beauty and softness—mirroring Libra’s refined nature. A blend that celebrates the balanced spirit of Libra",
      letters: "R, T",
      energy: "Balance, Relating",
      stamina: "Medium",
      colorText: "Pink",
      element: "Air",
      planet: "Venus",
      herbs: [
        "./images/ingredient/Rose-06.png",
        "./images/ingredient/Lavender-04.png",
        "./images/ingredient/Shea-Butter-19.png",
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
      icon: "./images/zodiac/8.png",
      description:
        "Scorpio is the sign of depth and transformation—intense, intuitive, and powerfully introspective. Ruled by Mars and Pluto with the element of Water, it embodies mystery, strength, and renewal. Our Scorpio blend channels this depth with Jojoba Seed, Jasmine, and Black Pepper. Nourishing Jojoba restores balance, sensual Jasmine reflects emotional richness, while Black Pepper adds warmth and intensity—capturing Scorpio’s transformative spirit. A blend that celebrates the powerful essence of Scorpio",
      letters: "N, Y",
      energy: "Alchemy, Transformation",
      stamina: "Very High",
      colorText: "Burgundy",
      element: "Water",
      planet: "Pluto / Mars",
      herbs: [
        "./images/ingredient/Jojaba-Seed-14.png",
        "./images/ingredient/Jasmine-09.png",
        "./images/ingredient/Black-Pepper-13.png",
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
      icon: "./images/zodiac/9.png",
      description:
        "Sagittarius is the sign of exploration and wisdom—optimistic, curious, and endlessly adventurous. Ruled by Jupiter and the element of Fire, it embodies freedom, vision, and expansive energy. Our Sagittarius blend reflects this vibrant spirit with Clove, Ginger, and Black Pepper. Warming Clove grounds the senses, lively Ginger awakens vitality, while Black Pepper adds bold energy—echoing Sagittarius’ adventurous drive. A blend that celebrates the free-spirited essence of Sagittarius. ",
      letters: "Bh, Dh, Ph, Ddh",
      energy: "Freedom, Divinity",
      stamina: "High",
      colorText: "Purple",
      element: "Fire",
      planet: "Jupiter",
      herbs: [
        "./images/ingredient/Clove-05.png",
        "./images/ingredient/Ginger-12.png",
        "./images/ingredient/Black-Pepper-13.png",
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
      icon: "./images/zodiac/10.png",
      description:
        "Capricorn is the sign of discipline and ambition—steady, focused, and deeply determined. Ruled by Saturn and the element of Earth, it embodies resilience, structure, and purposeful growth. Our Capricorn blend reflects this grounded strength with Lavender, Rosemary, Lemongrass, and Carnation Flower. Lavender soothes and restores balance, Rosemary sharpens clarity, while Lemongrass and Carnation add freshness and quiet elegance—mirroring Capricorn’s composed determination. A blend that celebrates the enduring spirit of Capricorn. ",
      letters: "Kh, J",
      energy: "Driven, Ambitious",
      stamina: "Strong",
      colorText: "Grey",
      element: "Earth",
      planet: "Saturn",
      herbs: [
        "./images/ingredient/CARNATION-FLOWER-03.png",
        "./images/ingredient/Rosemary-01.png",
        "./images/ingredient/Lavender-04.png",
        "./images/ingredient/Lemongrass-18.png",
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
      icon: "./images/zodiac/11.png",
      description:
        "Aquarius is the sign of innovation and individuality—forward-thinking, imaginative, and deeply humanitarian. Ruled by Saturn and Uranus with the element of Air, it reflects vision, intellect, and originality. Our Aquarius blend captures this refreshing energy with Lemon, Jasmine, and Sandalwood. Bright Lemon awakens clarity, delicate Jasmine reflects creative expression, while Sandalwood brings grounding calm—balancing Aquarius’ visionary spirit. A blend that celebrates the unique essence of Aquarius. ",
      letters: "G, S, Sh",
      energy: "Visionary Creativity",
      stamina: "Medium",
      colorText: "Turquoise",
      element: "Air",
      planet: "Uranus / Saturn",
      herbs: [
        "./images/ingredient/Lemon-08.png",
        "./images/ingredient/Jasmine-09.png",
        "./images/ingredient/Sandalwood-11.png",
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
      icon: "./images/zodiac/12.png",
      description:
        "Pisces is the sign of intuition and imagination—compassionate, dreamy, and deeply spiritual. Ruled by Jupiter and Neptune with the element of Water, it embodies empathy, creativity, and inner depth. Our Pisces blend reflects this soulful nature with Lavender, Clove, Rose, and Sandalwood. Lavender calms the mind, Rose nurtures the heart, Clove adds gentle warmth, while Sandalwood offers grounding serenity—echoing Pisces’ mystical essence. A blend that celebrates the dreamy spirit of Pisces.",
      letters: "D, Ch, Z, Th",
      energy: "Creativity, Mysticism",
      stamina: "Low",
      colorText: "Sea Foam Green",
      element: "Water",
      planet: "Neptune / Jupiter",
      herbs: [
        "./images/ingredient/Sandalwood-11.png",
        "./images/ingredient/Lavender-04.png",
        "./images/ingredient/Clove-05.png",
        "./images/ingredient/Rose-06.png",
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
    { name: "Aries", color: "#7A1318", image: "./images/zodiac/1.png" },
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
 // In Zodic.js - Replace the sorting logic

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      const data = res.data;

      // 1. Desired Order - exact match patterns
      const categoryOrder = [
        "Bath Gel",
        "Body Lotion", 
        "Perfume",
        "Essential Oil",
        "Soap",
        "Hamper"
      ];

      // Helper function to get category priority
      const getCategoryPriority = (productName) => {
        // Check for exact match first
        for (let i = 0; i < categoryOrder.length; i++) {
          if (productName.toLowerCase().includes(categoryOrder[i].toLowerCase())) {
            return i;
          }
        }
        // Check for variations
        if (productName.toLowerCase().includes("bath")) return 0;
        if (productName.toLowerCase().includes("lotion")) return 1;
        if (productName.toLowerCase().includes("perfume") || productName.toLowerCase().includes("eau")) return 2;
        if (productName.toLowerCase().includes("essential")) return 3;
        if (productName.toLowerCase().includes("soap")) return 4;
        if (productName.toLowerCase().includes("hamper")) return 5;
        return 99; // Unknown category goes to end
      };

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

      // 2. FIXED SORT LOGIC - Using the helper function
      Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => {
          const priorityA = getCategoryPriority(a.ProductName);
          const priorityB = getCategoryPriority(b.ProductName);
          return priorityA - priorityB;
        });
      });

      setProductsByZodiac(grouped);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };
  fetchProducts();
}, [API_URL]);// Added dependency array to prevent infinite loops

  return (
    <div>
      {/* TOP SECTION */}
      <div className="twelve-section py-5">
        <div className="container">
          <div className="row align-items-center text-white">
            {/* LEFT TEXT */}
            <div className="col-12 col-md-4 text-center  left-text">
              <h2 className="artisan-font">The Twelves</h2>
              <p className="subtitle sora">EXPLORE BY YOUR SUN SIGN</p>
              {/* <p className="subtitle">Find your Zodiac</p> */}
              <div className="my-5">
                <Calculator />
              </div>
            </div>

            {/* ZODIAC GRID */}
            <div className="col-12 col-md-7 zodiac-grid-wrapper">
              <div className="row zodiac-row justify-content-center">
                {zodiacSigns.map((sign, index) => (
                  <div
                    key={index}
                    className="col-4 col-lg-3  zodiac-item text-center"
                    onClick={() => setSelectedZodiac(zodiacData[sign.name])}
                  >
                    <div
                      className="zodiac-circle"
                      // style={{ backgroundColor: sign.color }}
                    >
                      <img
                        src={sign.image}
                        alt={sign.name}
                        className="zodiac-image"
                      />
                    </div>
                    <p className="zodiac-name sora">{sign.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT VERTICAL TEXT */}
            <div className="col-md-1 d-none d-md-flex ">
              <div className="vertical-text">
                NURTURE <span className="fw-light">YOUR</span> NATURE
              </div>
            </div>
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
                <div className="d-flex justify-content-center gap-5  ">
                  <div className="d-block">
                    <h1 className="aries-title gt-super mb-0">
                      {selectedZodiac.name}
                    </h1>
                    <p className="aries-date mb-3 gt-super">{selectedZodiac.date}</p>
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
                  <p className="aries-date gt-super mb-3">{selectedZodiac.date}</p>
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
          <div className="aries-images container d-flex justify-content-center  flex-wrap">
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
                    <div className="product-card-1" key={index}>
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
                          <div className="price-with-dot-1">
                            <span
                              className="zodiac-dot"
                              style={{ backgroundColor: zodiacColors[selectedZodiac.name] }}
                            ></span>

                            <span className="zodiac-price fw-bolder">
                              {p.ProductName} <span>›</span>
                            </span>
                          </div>
                          {/* <p className="name">
                            {p.ProductName} <span>›</span>
                          </p> */}
                          {/* <p className="name">{p.ProductName}</p> */}
                          {/* <p className="size">{p.size}</p> */}
                          <div className="price-with-dot-1">
                            {/* <span
                              className="zodiac-dot"
                              style={{ backgroundColor: selectedZodiac.color }}
                            ></span> */}
                          </div>

                          <div className="underline" />
                          <div className="size-price-row">
                            <span className="size">{p.size}</span>
                            <span className="zodiac-price">
                              ₹ {p.ProductPrice}
                            </span>
                          </div>
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
  );
};

export default Zodic;
