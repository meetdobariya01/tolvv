import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./calculator.css";

const Calculator = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birthtime, setBirthtime] = useState("");
  const [birthplace, setBirthplace] = useState("");

  const [result, setResult] = useState("");

  // Mapping
  const zodiacByLetter = {
    Aries: ["A", "L", "E"],
    Taurus: ["B", "V", "U"],
    Gemini: ["K", "C", "G"],
    Cancer: ["H", "D"],
    Leo: ["M", "T"],
    Virgo: ["P", "TH"],
    Libra: ["R"],
    Scorpio: ["N", "Y"],
    Sagittarius: ["BH", "F", "DH"],
    Capricorn: ["KH", "J"],
    Aquarius: ["S", "SH"],
    Pisces: ["D", "CH", "Z"],
  };

  const calculateZodiac = () => {
    if (!name) return;

    const firstLetter = name.trim().charAt(0).toUpperCase();

    for (const zodiac in zodiacByLetter) {
      if (zodiacByLetter[zodiac].includes(firstLetter)) {
        setResult(zodiac);
        return;
      }
    }

    setResult("No matching zodiac found");
  };

  return (
    <>
      <motion.button
        className="zod-btn"
        whileHover={{ scale: 1.1 }}
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
            <motion.div
              className="modal-content"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
            >
              <h2>Zodiac Calculator</h2>

              {/* NAME */}
              <label className="label">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* BIRTHDATE */}
              <label className="label">Birthdate</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />

              <button className="calc-btn" onClick={calculateZodiac}>
                Get Zodiac
              </button>

              {result && (
                <p className="result">
                  Your Zodiac: <strong>{result}</strong>
                </p>
              )}

              <button
                className="close-btn"
                onClick={() => {
                  setOpen(false);
                  setName("");
                  setBirthdate("");
                  setBirthtime("");
                  setBirthplace("");
                  setResult("");
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Calculator;
