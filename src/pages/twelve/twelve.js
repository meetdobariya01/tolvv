// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./twelve.css";
// import axios from "axios";
// import Calculator from "../../components/calculator/calculator";
// import { Row, Col } from "react-bootstrap";
// import { motion } from "framer-motion";
// import Cookies from "js-cookie";

// const Twelve = () => {
//   const [active, setActive] = useState(null);
//   const zodiacData = {
//     Aries: {
//       name: "Aries",
//       date: "March 21 - April 19",
//       color: "#7A1318",
//       icon: "./images/zodiac/1.png",
//       description:
//         "Aries is bold, fiery, and instinctive—driven by courage, ambition, and passion. They lead naturally, embrace challenges, and inspire fearless action.",
//       letters: "A, L, E",
//       energy: "Courage",
//       stamina: "High",
//       colorText: "Red",
//       element: "Fire",
//       planet: "Mars",
//       herbs: [
//         "./images/ginger.png",
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },

//     Taurus: {
//       name: "Taurus",
//       date: "April 20 - May 20",
//       color: "#7A8B3D",
//       icon: "./images/zodiac/2.png",
//       description:
//         "Taurus is steady, loyal, and grounded—valuing comfort, beauty, and stability. Patient and persistent, they build lasting success through calm determination and consistency.",
//       letters: "B, V, U",
//       energy: "Stability",
//       stamina: "Strong",
//       colorText: "Green",
//       element: "Earth",
//       planet: "Venus",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },

//     Gemini: {
//       name: "Gemini",
//       date: "May 21 - June 20",
//       color: "#BB892C",
//       icon: "./images/zodiac/3.png",
//       description:
//         "Gemini is curious, witty, and adaptable—thriving on communication and learning. Creative and versatile, they inspire innovation and fresh perspectives.",
//       letters: "K, C, H, G",
//       energy: "Adaptability",
//       stamina: "Medium",
//       colorText: "Yellow",
//       element: "Air",
//       planet: "Mercury",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },

//     Cancer: {
//       name: "Cancer",
//       date: "June 21 - July 22",
//       color: "#8A8C8E",
//       icon: "./images/zodiac/4.png",
//       description:
//         "Cancer is emotional, intuitive, and nurturing—loyal and protective. They value family, empathy, and emotional security, offering gentle, healing love.",
//       letters: "D, H",
//       energy: "Emotional Intelligence",
//       stamina: "Moderate",
//       colorText: "Blue",
//       element: "Water",
//       planet: "Moon",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },

//     Leo: {
//       name: "Leo",
//       date: "July 23 - August 22",
//       color: "#E8C43A",
//       icon: "./images/zodiac/5.png",
//       description:
//         "Leo is confident, charismatic, and warm-hearted—generous and loyal. They inspire, lead with passion, shine brightly, and embrace joyful self-expression.",
//       letters: "M, T",
//       energy: "Confidence",
//       stamina: "High",
//       colorText: "Gold",
//       element: "Fire",
//       planet: "Sun",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },

//     Virgo: {
//       name: "Virgo",
//       date: "August 23 - September 22",
//       color: "#DC4D2D",
//       icon: "./images/zodiac/6.png",
//       description:
//         "Virgo is intelligent, detail-oriented, and analytical—calm, humble, and caring. They seek order, precision, and improvement, guiding through thoughtful, structured actions..",
//       letters: "P, T, N",
//       energy: "Precision",
//       stamina: "Strong",
//       colorText: "Light Green",
//       element: "Earth",
//       planet: "Mercury",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },
//     Libra: {
//       name: "Libra",
//       date: "September 23 - October 22",
//       color: "#FF4E4C",
//       icon: "./images/zodiac/7.png",
//       description:
//         "Libra is social, graceful, and fair—seeking harmony, beauty, and meaningful relationships. They balance emotions, inspire peace, and live elegantly.",
//       letters: "R, T",
//       energy: "Harmony",
//       stamina: "Medium",
//       colorText: "Pink",
//       element: "Air",
//       planet: "Venus",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },
//     Scorpio: {
//       name: "Scorpio",
//       date: "October 23 - November 21",
//       color: "#000000",
//       icon: "./images/zodiac/8.png",
//       description:
//         "Scorpio is intense, mysterious, and transformative—loyal, passionate, and insightful. They embrace power, authenticity, and emotional depth, inspiring personal growth.",
//       letters: "N, Y",
//       energy: "Intensity",
//       stamina: "Very High",
//       colorText: "Maroon",
//       element: "Water",
//       planet: "Pluto / Mars",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },
//     Sagittarius: {
//       name: "Sagittarius",
//       date: "November 22 - December 21",
//       color: "#74489D",
//       icon: "./images/zodiac/9.png",
//       description:
//         "Sagittarius is adventurous, optimistic, and free-spirited—seeking truth, knowledge, and freedom. They inspire exploration, honesty, positivity, and open-minded living.",
//       letters: "B, D, P",
//       energy: "Optimism",
//       stamina: "High",
//       colorText: "Orange",
//       element: "Fire",
//       planet: "Jupiter",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },
//     Capricorn: {
//       name: "Capricorn",
//       date: "December 22 - January 19",
//       color: "#F1E1CF",
//       icon: "./images/zodiac/10.png",
//       description:
//         "Capricorn is disciplined, ambitious, and practical—valuing structure, patience, and hard work. They lead steadily, achieving long-term success through dedication.",
//       letters: "K, J",
//       energy: "Discipline",
//       stamina: "Strong",
//       colorText: "Black",
//       element: "Earth",
//       planet: "Saturn",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },
//     Aquarius: {
//       name: "Aquarius",
//       date: "January 20 - February 18",
//       color: "#519AA2",
//       icon: "./images/zodiac/11.png",
//       description:
//         "Aquarius is innovative, independent, and visionary—valuing freedom, originality, and humanitarian ideals. They inspire change, think differently, and improve society.",
//       letters: "G, S, Sh",
//       energy: "Innovation",
//       stamina: "Medium",
//       colorText: "Sky Blue",
//       element: "Air",
//       planet: "Uranus / Saturn",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },
//     Pisces: {
//       name: "Pisces",
//       date: "February 19 - March 20",
//       color: "#043D5D",
//       icon: "./images/zodiac/12.png",
//       description:
//         "Pisces is sensitive, intuitive, and artistic—compassionate and spiritual. They inspire creativity, empathy, healing, and kindness, seeing the world through soulful perception.",
//       letters: "D, Ch, Z, Th",
//       energy: "Intuition",
//       stamina: "Low",
//       colorText: "Purple",
//       element: "Water",
//       planet: "Neptune / Jupiter",
//       herbs: [
//         "./images/cinnamon.png",
//         "./images/coconut.png",
//         "./images/ginger.png",
//       ],
//       products: [
//         { name: "Bath Gel", size: "200 ml", img: "./images/bb.png" },
//         { name: "Body Lotion", size: "200 ml", img: "./images/bl.png" },
//         { name: "Perfume", size: "50 ml", img: "./images/pr.png" },
//         { name: "Essential Oil", size: "30 ml", img: "./images/eo.png" },
//         { name: "Soap", size: "100 gm", img: "./images/sp.png" },
//       ],
//     },
//   };

//   const zodiacSigns = [
//     { name: "Aries", color: "#7A1318", image: "./images/zodiac/1.png" },
//     { name: "Taurus", color: "#7A8B3D", image: "./images/zodiac/2.png" },
//     { name: "Gemini", color: "#BB892C", image: "./images/zodiac/3.png" },
//     { name: "Cancer", color: "#8A8C8E", image: "./images/zodiac/4.png" },
//     { name: "Leo", color: "#E8C43A", image: "./images/zodiac/5.png" },
//     { name: "Virgo", color: "#DC4D2D", image: "./images/zodiac/6.png" },
//     { name: "Libra", color: "#FF4E4C", image: "./images/zodiac/7.png" },
//     { name: "Scorpio", color: "#000000", image: "./images/zodiac/8.png" },
//     { name: "Sagittarius", color: "#74489D", image: "./images/zodiac/9.png" },
//     { name: "Capricorn", color: "#F1E1CF", image: "./images/zodiac/10.png" },
//     { name: "Aquarius", color: "#519AA2", image: "./images/zodiac/11.png" },
//     { name: "Pisces", color: "#043D5D", image: "./images/zodiac/12.png" },
//   ];
//   const API_URL = process.env.REACT_APP_API_URL;

//   const [activeKey, setActiveKey] = useState(null);
//   const [productsByZodiac, setProductsByZodiac] = useState({});
//   const navigate = useNavigate();
//   const Zodiac = [
//     "Aries",
//     "Taurus",
//     "Gemini",
//     "Cancer",
//     "Leo",
//     "Virgo",
//     "Libra",
//     "Scorpio",
//     "Sagittarius",
//     "Capricorn",
//     "Aquarius",
//     "Pisces",
//   ];
//   const token = localStorage.getItem("token");
//   const [selectedZodiac, setSelectedZodiac] = useState(zodiacData["Aries"]);
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/products`);
//         const data = res.data;

//         const grouped = {};
//         Zodiac.forEach((cat) => (grouped[cat] = []));

//         data.forEach((prod) => {
//           const Zodiac = prod.Zodiac?.trim();
//           if (grouped[Zodiac]) {
//             // 🚫 Prevent duplicates
//             if (!grouped[Zodiac].find((p) => p._id === prod._id)) {
//               grouped[Zodiac].push(prod);
//             }
//           }
//         });

//         setProductsByZodiac(grouped);
//       } catch (err) {
//         console.error("Failed to fetch products:", err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // const handleBuyNow = async (productId) => {

//   //   if (!token) {
//   //     alert("Please login first!");
//   //     navigate("/login");
//   //     return;
//   //   }

//   //   try {
//   //     await axios.post(
//   //       `${API_URL}/add-to-cart`,
//   //       { productId, quantity: 1 },
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );
//   //     navigate("/cart");
//   //   } catch (err) {
//   //     console.error("Add to cart failed:", err);
//   //     alert("Failed to add product to cart.");
//   //   }
//   // };
//   const handleBuyNow = async (product) => {
//     if (!product) return;

//     // ✅ LOGGED-IN USER
//     if (token) {
//       try {
//         await axios.post(
//           `${API_URL}/api/add-to-cart`,
//           {
//             productId: product._id,
//             quantity: 1,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         navigate("/cart");
//       } catch (error) {
//         console.error("Add to cart error:", error.response || error);

//         if (error.response?.status === 401) {
//           alert("Session expired. Please login again.");
//           localStorage.removeItem("token");
//           navigate("/login");
//         }
//       }
//     }

//     // ✅ GUEST USER
//     else {
//       let cart = [];

//       try {
//         const stored = Cookies.get("guestCart");
//         cart = stored ? JSON.parse(stored) : [];
//         if (!Array.isArray(cart)) cart = [];
//       } catch {
//         cart = [];
//       }

//       const existing = cart.find(
//         (item) => item.productId === product._id
//       );

//       if (existing) {
//         existing.quantity += 1;
//       } else {
//         cart.push({
//           type: "product",
//           productId: product._id,
//           quantity: 1,
//           price: product.ProductPrice,
//           name: product.ProductName,
//           img: product.Photos,
//         });
//       }

//       Cookies.set("guestCart", JSON.stringify(cart), { expires: 7 });
//       navigate("/cart");
//     }
//   };

//   return (
//     <div>
//       {/* TOP SECTION */}
//       <div className="twelve-section">
//         <div className="container">
//           <div className="row align-items-center text-white">
//             {/* LEFT TEXT */}
//             <div className="col-12 col-md-4 text-center text-md-start left-text">
//               <h2 className="tangerine-bold">The Twelve</h2>
//               <p className="subtitle">
//                 EXPLORE BY YOUR SUN,
//                 <br />
//                 MOON OR RISING SIGN
//               </p>
//               <Calculator />
//             </div>

//             {/* ZODIAC GRID */}
//             <div className="col-12 col-md-7 zodiac-grid-wrapper">
//               <div className="row zodiac-row justify-content-center">
//                 {zodiacSigns.map((sign, index) => (
//                   <div
//                     key={index}
//                     className="col-3 zodiac-item text-center"
//                     onClick={() => setSelectedZodiac(zodiacData[sign.name])}
//                   >
//                     <div
//                       className="zodiac-circle"
//                       style={{ backgroundColor: sign.color }}
//                     >
//                       <img
//                         src={sign.image}
//                         alt={sign.name}
//                         className="zodiac-image"
//                       />
//                     </div>
//                     <p className="zodiac-name">{sign.name}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* RIGHT VERTICAL TEXT */}
//             <div className="col-md-1 d-none d-md-flex justify-content-end">
//               <div className="vertical-text">NURTURE YOUR NATURE</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* RED SECTION (Dynamic Content) */}
//       <section
//         className="aries-section text-center"
//         style={{ backgroundColor: selectedZodiac.color }}
//       >
//         <div className="aries-content container">
//           <h1
//             className="aries-title"
//             style={{
//               color: selectedZodiac.name === "Capricorn" ? "black" : "",
//             }}
//           >
//             {selectedZodiac.name}
//           </h1>

//           <div className="aries-icon-circle">
//             <img
//               src={selectedZodiac.icon}
//               alt="icon"
//               className="aries-icon-img"
//             />
//           </div>

//           <p
//             className="aries-date"
//             style={{
//               color: selectedZodiac.name === "Capricorn" ? "black" : "",
//             }}
//           >
//             Date : {selectedZodiac.date}
//           </p>

//           <p
//             className="aries-description"
//             style={{
//               color: selectedZodiac.name === "Capricorn" ? "black" : "",
//             }}
//           >
//             {selectedZodiac.description}
//           </p>

//           <p
//             className="aries-details"
//             style={{
//               color: selectedZodiac.name === "Capricorn" ? "black" : "",
//             }}
//           >
//             <span>Corresponding Letters : {selectedZodiac.letters}</span> &nbsp;
//             | &nbsp;
//             <span>Astral Energy : {selectedZodiac.energy}</span> &nbsp; | &nbsp;
//             <span>Stamina : {selectedZodiac.stamina}</span>
//             <br />
//             <span>Colour : {selectedZodiac.colorText}</span> &nbsp; | &nbsp;
//             <span>Element : {selectedZodiac.element}</span> &nbsp; | &nbsp;
//             <span>Ruling Planet : {selectedZodiac.planet}</span>
//           </p>
//         </div>

//         {/* Herbs Section */}
//         <div className="aries-images container d-flex justify-content-center gap-5 flex-wrap">
//           {selectedZodiac.herbs.map((img, i) => (
//             <img key={i} src={img} alt="herb" className="half-out-image" />
//           ))}
//         </div>

//         {/* PRODUCTS */}
//         {/* PRODUCTS – WHITE BACKGROUND */}
//         <div className="product-wrapper py-5">
//           <h2 className="product-heading the-artisan-font mb-4 text-center">
//             {selectedZodiac.name} Products
//           </h2>

//           <div className="container">
//             <div className="product-grid">
//               {productsByZodiac[selectedZodiac.name]?.map((p, index) => (
//                 <div className="product-card" key={index}>
//                   <div className="product-box-zodiac">
//                     <img
//                       src={p.Photos}
//                       alt={p.ProductName}
//                       className="product-img"
//                     />

//                     <div className="product-info">
//                       <p className="name">{p.ProductName}</p>
//                       <p className="size">{p.size}</p>
//                       <p className="price">₹{p.ProductPrice}</p>

//                       <div className="underline" />
//                       <button
//                         className="buy-btn mt-1"
//                         onClick={() => handleBuyNow(p)}
//                       >
//                         Buy Now
//                       </button>

//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Twelve;+

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Zodic from "../Zodiacs/zodics";
import "./twelve.css";
import Moonsection from "../../components/moonsection/moonsection";

const Twelve = () => {
  return (
    <div>
      {/* HEADER */}
      <Header />

      <section className="zodiac-hero">
        <motion.img
          src="/images/tolvv.jpg" // 👈 your banner image
          alt="Hero Banner"
          className="zodiac-hero-img"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </section>

      {/* ZODIAC COMPONENT */}
      <Zodic />

      <section className="zodiac-quote-section">
        <div className="zodiac-quote-text">
          Like us, plants are guided by cosmic energies. Their essential oils
          carry these forces from above to earth, helping you align with
          astrological energies and transform your life. Step into your
          radiance—become the star you are.
        </div>

        <div className="zodiac-divider">
          <span className="zodiac-line" />
          <span className="zodiac-star">✦</span>
          <span className="zodiac-line" />
        </div>
      </section>

      <Moonsection />
      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Twelve;
