import React from "react";
import "./twelve.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const icons = [
  {
    key: "aries",
    label: "Aries",
    file: "./images/zodiac/1.png",
    color: "#9b1b1b",
  },
  {
    key: "taurus",
    label: "Taurus",
    file: "./images/zodiac/2.png",
    color: "#8fb04a",
  },
  {
    key: "gemini",
    label: "Gemini",
    file: "./images/zodiac/3.png",
    color: "#e9b23b",
  },
  {
    key: "cancer",
    label: "Cancer",
    file: "./images/zodiac/4.png",
    color: "#bfc3c6",
  },
  { key: "leo", label: "Leo", file: "./images/zodiac/5.png", color: "#e8c83a" },
  {
    key: "virgo",
    label: "Virgo",
    file: "./images/zodiac/6.png",
    color: "#e1562e",
  },
  {
    key: "libra",
    label: "Libra",
    file: "./images/zodiac/7.png",
    color: "#ff7b7b",
  },
  {
    key: "scorpio",
    label: "Scorpio",
    file: "./images/zodiac/8.png",
    color: "#000000",
  },
  {
    key: "sagittarius",
    label: "Sagittarius",
    file: "./images/zodiac/9.png",
    color: "#8a43c6",
  },
  {
    key: "capricorn",
    label: "Capricorn",
    file: "./images/zodiac/10.png",
    color: "#e8dcc0",
  },
  {
    key: "aquarius",
    label: "Aquarius",
    file: "./images/zodiac/11.png",
    color: "#5ac5d3",
  },
  {
    key: "pisces",
    label: "Pisces",
    file: "./images/zodiac/12.png",
    color: "#115b86",
  },
];
const planets = [
  { name: "Moon", color: "#4A1F6F", effect: "Calm" },
  { name: "Sun", color: "#d6b300", effect: "Energy" },
  { name: "Mercury", color: "#d89b00", effect: "Clarity" },
  { name: "Venus", color: "#0b6b41", effect: "Radiance" },
  { name: "Mars", color: "#9b0c0c", effect: "Passion" },
  { name: "Jupiter", color: "#2c2d85", effect: "Optimism" },
  { name: "Saturn", color: "#0f0c0c", effect: "Wisdom" },
];

const Twelve = () => {
  return (
    <div>
      {/* Header Spacer */}
      <Header />

      <section className="twelve-section-1">
        {/* TOP HERO IMAGE */}
        <div className="twelve-hero">
          <img
            src="./images/twelve.jpg"
            alt="The Twelve wheel"
            className="twelve-hero-img"
          />
        </div>

        {/* CONTENT AREA */}
        <div className="twelve-content container">
          <div className="twelve-left">
            <h3 className="twelve-kicker">The Twelve</h3>
            <p className="twelve-desc">
              EXPLORE BY YOUR SUN,
              <br /> MOON OR RISING SIGN
            </p>
          </div>

          <div className="twelve-grid-wrap">
            <div className="twelve-grid" aria-label="zodiac-icons">
              {icons.map((ic, i) => (
                <div
                  className="zodiac-cell"
                  key={ic.key}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <a
                    href={`/twelve/${ic.key}`}
                    className="zodiac-btn"
                    aria-label={ic.label}
                  >
                    <div
                      className="zodiac-circle"
                      style={{ background: ic.file ? "transparent" : ic.color }}
                    >
                      {/* if icon file missing, show glyph letter fallback */}
                      <img
                        src={ic.file}
                        alt={ic.label}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          // fallback circle letter shown by CSS :before (no extra handling required)
                        }}
                        className="zodiac-icon"
                      />
                    </div>
                  </a>
                  <div className="zodiac-label">{ic.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="twelve-right-vertical">
            <span>NURTURE YOUR NATURE</span>
          </div>
        </div>
      </section>

      <div className="rp-container">
        <p className="rp-top-text">
          Like us, plants are guided by cosmic energies. Their essential oils
          carry these forces from above to earth, helping you align with
          astrological energies and transform your life. Step into your
          radiance— become the star you are.
        </p>

        <div className="rp-divider">
          <span className="rp-star">✧</span>
        </div>

        <h2 className="rp-title">EXPLORE BY YOUR RULING PLANET</h2>

        <div className="rp-row">
          {planets.map((p, i) => (
            <div className="rp-item" key={i}>
              <div className="rp-circle" style={{ background: p.color }}></div>

              <p className="rp-name">{p.name}</p>

              <div className="rp-arrow">↓</div>

              <p className="rp-effect">{p.effect}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Twelve;
