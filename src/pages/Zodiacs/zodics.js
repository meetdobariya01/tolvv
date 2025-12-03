import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./zodics.css";
import axios from "axios";

const Zodic = () => {
  const zodiacData = {
    Aries: {
      name: "Aries",
      date: "March 21 - April 19",
      color: "#7E0D0D",
      icon: "./images/zodiac/1.png",
      description:
        "Aries is the spark of the zodiac — bold, fiery, and born to take the lead. As the first sign, Aries represents new beginnings, fearlessness, and raw ambition. They act before they overthink, trusting their instincts and inner fire to guide them. Aries has a magnetic presence, a daring spirit, and an unstoppable drive that inspires others to follow. They thrive in challenges, enjoy competition, and move through life with passion and courage. Though sometimes impulsive, their heart is pure, direct, and full of enthusiasm. Aries teaches the world how to be brave and chase goals without hesitation.",
      letters: "A, L, E, I, O",
      energy: "Courage",
      stamina: "High",
      colorText: "Red",
      element: "Fire",
      planet: "Mars",
      herbs: [
        "./images/ginger.png",
        "./images/Cinnamon.png",
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
      color: "#7B8E2E",
      icon: "./images/zodiac/2.png",
      description:
        "Taurus is the anchor of the zodiac — steady, loyal, patient, and deeply connected to the physical world. Ruled by Venus, Taurus values beauty, comfort, and emotional stability. They move with calm determination and build their life with strong foundations. Taureans excel in long-term goals, love consistency, and avoid unnecessary risks. Their presence is grounding, soothing, and nurturing. They appreciate luxury, nature, good food, and meaningful relationships. Though stubborn at times, their persistence brings great success. Taurus reminds the world of the power of patience, trust, and slow, steady growth.",
      letters: "B, V, U, W",
      energy: "Stability",
      stamina: "Strong",
      colorText: "Green",
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
      color: "#C6932C",
      icon: "./images/zodiac/3.png",
      description:
        "Gemini is the mind of the zodiac — curious, witty, endlessly imaginative, and always eager to explore new ideas. Ruled by Mercury, Gemini thrives on communication, learning, and intellectual stimulation. They adapt quickly, shift between interests with ease, and bring fresh energy to every situation. Their dual nature allows them to understand multiple perspectives, making them excellent conversationalists. Though sometimes indecisive or scattered, Geminis are creative, charming, and full of youthful spirit. They inspire change, innovation, and new ways of thinking, teaching the world to stay curious and open-minded.",
      letters: "K, C, H, G",
      energy: "Adaptability",
      stamina: "Medium",
      colorText: "Yellow",
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
      color: "#B2B2B2",
      icon: "./images/zodiac/4.png",
      description:
        "Cancer is the heart of the zodiac — emotional, intuitive, nurturing, and deeply connected to memories and loved ones. Ruled by the Moon, their moods shift like tides, but their loyalty and compassion never waver. Cancer values emotional security, family bonds, and safe environments. They feel everything intensely and have a natural ability to sense what others need. Though they may retreat into their shell for protection, their love is healing, protective, and gentle. Cancer teaches the world the power of empathy, intuition, and emotional resilience.",
      letters: "D, M, N",
      energy: "Emotional Intelligence",
      stamina: "Moderate",
      colorText: "Blue",
      element: "Water",
      planet: "Moon",
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
      color: "#D98C00",
      icon: "./images/zodiac/5.png",
      description:
        "Leo is the shining star of the zodiac — confident, creative, warm-hearted, and full of radiant charisma. Ruled by the Sun, Leo brings light wherever they go. They love to express themselves, inspire others, and lead with passion. Leos are generous, loyal, and protective of those they care about. Their natural charm and big-hearted nature make them unforgettable. Though sometimes dramatic or ego-driven, their intentions are noble and full of love. Leo teaches the world how to shine brightly, embrace self-confidence, and live life with joy and purpose.",
      letters: "S, T",
      energy: "Confidence",
      stamina: "High",
      colorText: "Gold",
      element: "Fire",
      planet: "Sun",
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
      color: "#6BA58C",
      icon: "./images/zodiac/6.png",
      description:
        "Virgo is the perfectionist of the zodiac — intelligent, detail-oriented, analytical, and highly dedicated. Ruled by Mercury, Virgo has a sharp mind and a natural ability to solve problems with precision. They seek order, clarity, and improvement in all areas of life. Virgos are humble, service-oriented, and deeply caring, though they often hide their emotions behind logic. Their calm presence brings structure and stability to others. Though they can be overly critical of themselves, their intentions are pure and supportive. Virgo teaches the world the value of hard work, refinement, and thoughtful living.",
      letters: "P, T",
      energy: "Precision",
      stamina: "Strong",
      colorText: "Light Green",
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
      color: "#B399C8",
      icon: "./images/zodiac/7.png",
      description:
        "Libra is the harmonizer of the zodiac — social, graceful, romantic, and deeply attuned to balance and justice. Ruled by Venus, Libra seeks peace, beauty, and meaningful relationships. They have a natural charm that draws people in, and they excel in understanding others' emotions and perspectives. Libras often avoid conflict, striving to create harmony in every situation. Though sometimes indecisive, they are thoughtful, fair, and compassionate. Libra teaches the world the importance of balance, partnership, and living life with elegance and understanding.",
      letters: "R, T",
      energy: "Harmony",
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
      color: "#4B0C2B",
      icon: "./images/zodiac/8.png",
      description:
        "Scorpio is the powerhouse of the zodiac — intense, mysterious, emotional, and transformative. Ruled by Pluto and Mars, Scorpio has a deep inner world and unmatched emotional strength. They feel everything passionately and have a natural ability to see the truth behind the surface. Scorpios value loyalty, depth, and authenticity. Their presence is magnetic, and their instincts are razor sharp. Though they can be secretive or controlling, their purpose is transformation and rebirth. Scorpio teaches the world how to embrace power, heal from within, and evolve into a stronger version of oneself.",
      letters: "N, Y",
      energy: "Intensity",
      stamina: "Very High",
      colorText: "Maroon",
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
      color: "#8C4B00",
      icon: "./images/zodiac/9.png",
      description:
        "Sagittarius is the explorer of the zodiac — free-spirited, optimistic, philosophical, and always seeking truth. Ruled by Jupiter, Sagittarius thrives in adventure, travel, knowledge, and spiritual expansion. They are natural storytellers with a big heart and an honest, straightforward personality. Sagittarians love freedom and resist anything that limits them. Their energy is uplifting, positive, and full of excitement. Though sometimes blunt or restless, they bring inspiration and wisdom to others. Sagittarius teaches the world to dream big, explore without fear, and embrace life with an open mind.",
      letters: "B, D",
      energy: "Optimism",
      stamina: "High",
      colorText: "Orange",
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
      color: "#3B3B3B",
      icon: "./images/zodiac/10.png",
      description:
        "Capricorn is the builder of the zodiac — disciplined, ambitious, wise, and committed to long-term success. Ruled by Saturn, Capricorn values structure, responsibility, and self-mastery. They climb steadily toward their goals, no matter how difficult the journey. Their maturity and practicality make them natural leaders. Though they may appear reserved, they are deeply caring and protective of their loved ones. Capricorns understand the value of patience, hard work, and resilience. They teach the world that great achievements take time, dedication, and unwavering focus.",
      letters: "K, J",
      energy: "Discipline",
      stamina: "Strong",
      colorText: "Black",
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
      color: "#00A7D1",
      icon: "./images/zodiac/11.png",
      description:
        "Aquarius is the visionary of the zodiac — innovative, independent, intellectual, and future-focused. Ruled by Uranus and Saturn, Aquarius thinks far beyond the present and loves breaking old patterns to create new possibilities. They value freedom, originality, and humanitarian ideals. Aquarians are natural thinkers with strong principles and a desire to improve society. Though emotionally detached at times, they are loyal friends and highly dependable. Aquarius teaches the world how to embrace change, think differently, and work toward a better future for all.",
      letters: "G, S, Sh",
      energy: "Innovation",
      stamina: "Medium",
      colorText: "Sky Blue",
      element: "Air",
      planet: "Uranus / Saturn",
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
      color: "#5D5DAF",
      icon: "./images/zodiac/12.png",
      description:
        "Pisces is the dreamer of the zodiac — sensitive, intuitive, artistic, and deeply spiritual. Ruled by Neptune and Jupiter, Pisces has a rich inner world filled with imagination, compassion, and emotional wisdom. They feel the emotions of others as their own and often possess healing abilities. Pisces sees beauty in everything and expresses themselves through creativity and empathy. Though they may struggle with boundaries or escapism, their hearts are pure and full of love. Pisces teaches the world the power of kindness, forgiveness, and seeing life through a soulful lens.",
      letters: "D, Ch, Z, Th",
      energy: "Intuition",
      stamina: "Low",
      colorText: "Purple",
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
    { name: "Aries", color: "#7E0D0D", image: "./images/zodiac/1.png" },
    { name: "Taurus", color: "#7B8E2E", image: "./images/zodiac/2.png" },
    { name: "Gemini", color: "#C6932C", image: "./images/zodiac/3.png" },
    { name: "Cancer", color: "#B2B2B2", image: "./images/zodiac/4.png" },
    { name: "Leo", color: "#E0B900", image: "./images/zodiac/5.png" },
    { name: "Virgo", color: "#E66B3E", image: "./images/zodiac/6.png" },
    { name: "Libra", color: "#FF766B", image: "./images/zodiac/7.png" },
    { name: "Scorpio", color: "#111111", image: "./images/zodiac/8.png" },
    { name: "Sagittarius", color: "#6E4FA8", image: "./images/zodiac/9.png" },
    { name: "Capricorn", color: "#E7E1C5", image: "./images/zodiac/10.png" },
    { name: "Aquarius", color: "#6CC0C9", image: "./images/zodiac/11.png" },
    { name: "Pisces", color: "#003E5E", image: "./images/zodiac/12.png" },
  ];

  const [activeKey, setActiveKey] = useState(null);
  const [productsByZodiac, setProductsByZodiac] = useState({});
  const navigate = useNavigate();
  const Zodiac = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const token = localStorage.getItem("token");
  const [selectedZodiac, setSelectedZodiac] = useState(zodiacData["Aries"]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products");
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

    const handleBuyNow = async (productId) => {
    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/add-to-cart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add product to cart.");
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
            <p className="subtitle">EXPLORE BY YOUR SUN, MOON OR RISING SIGN</p>
            <p className="subtitle">Please Select your Zodics</p>
          </div>

          {/* Zodiac Grid */}
          <div className="zodiac-grid container">
            <div className="row g-4 justify-content-center">
              {zodiacSigns.map((sign, index) => (
                <div
                  key={index}
                  className="col-6 col-sm-4 col-md-3 text-center pointer"
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
          <h1 className="aries-title">{selectedZodiac.name}</h1>

          <div className="aries-icon-circle">
            <img
              src={selectedZodiac.icon}
              alt="icon"
              className="aries-icon-img"
            />
          </div>

          <p className="aries-date">Date : {selectedZodiac.date}</p>

          <p className="aries-description">{selectedZodiac.description}</p>

          <p className="aries-details">
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
        <div className="product-wrapper py-5">
          <h2 className="product-heading mb-4 text-center">{selectedZodiac.name} Products</h2>

          <div className="container">
            <div className="row justify-content-center">
              {productsByZodiac[selectedZodiac.name]?.map((p, index) => (
                <div
                  className="col-6 col-md-4 col-lg-2 product-card"
                  key={index}
                >
                  <div className="card product-box">
                    <img src={p.Photos} alt={p.ProductName} className="product-img" />
                    <div className="product-info">
                      <p className="name">{p.ProductName}</p>
                      <p className="size">₹{p.ProductPrice}</p>
                      <p className="size">{p.size}</p>

                      <div className="underline" />
                      {/* Buy Now Button */}
                      <button className="buy-btn"
                      onClick={() => handleBuyNow(p._id)}>Buy Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Zodic;
