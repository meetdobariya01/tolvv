import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./calculator.css";

const Calculator = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [result, setResult] = useState("");

  // DATE-WISE ZODIAC MAP
  const zodiacByDate = {
    Aries: { start: [3, 21], end: [4, 19] },
    Taurus: { start: [4, 20], end: [5, 20] },
    Gemini: { start: [5, 21], end: [6, 20] },
    Cancer: { start: [6, 21], end: [7, 22] },
    Leo: { start: [7, 23], end: [8, 22] },
    Virgo: { start: [8, 23], end: [9, 22] },
    Libra: { start: [9, 23], end: [10, 22] },
    Scorpio: { start: [10, 23], end: [11, 21] },
    Sagittarius: { start: [11, 22], end: [12, 21] },
    Capricorn: { start: [12, 22], end: [1, 19] },
    Aquarius: { start: [1, 20], end: [2, 18] },
    Pisces: { start: [2, 19], end: [3, 20] },
  };

  const calculateZodiac = () => {
    if (!birthdate) return;

    const date = new Date(birthdate);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    for (const sign in zodiacByDate) {
      const { start, end } = zodiacByDate[sign];

      if (
        (month === start[0] && day >= start[1]) ||
        (month === end[0] && day <= end[1]) ||
        (start[0] > end[0] &&
          ((month === start[0] && day >= start[1]) ||
            (month === end[0] && day <= end[1])))
      ) {
        setResult(sign);
        return;
      }
    }
  };

  return (
    <>
      <motion.button
        className="zod-btn"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
      >
        Zodiac Calculator
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* MODAL AT TOP */}
            <motion.div
              className="modal-content top-modal"
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
            >
              {/* CLOSE BUTTON */}
              <button
                className="modal-close"
                onClick={() => {
                  setOpen(false);
                  setName("");
                  setBirthdate("");
                  setResult("");
                }}
              >
                ✕
              </button>

              <h2>Zodiac Calculator</h2>

              <label className="label">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label className="label">Birthdate</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />

              <button className="calc-btn" onClick={calculateZodiac}>
                Get Zodiac Sign
              </button>

              {result && (
                <p className="result">
                  Your Zodiac Sign: <strong>{result}</strong>
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Calculator;
