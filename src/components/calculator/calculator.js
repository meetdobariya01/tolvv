import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./calculator.css";

const Calculator = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  // ✅ Updated state (day + month only)
  const [birthdate, setBirthdate] = useState({ day: "", month: "" });

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
    const day = birthdate.day;
    const month = birthdate.month;

    if (!day || !month) return;

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
        className="btn btn-outline-light text-uppercase"
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
            <motion.div
              className="modal-content-1 top-modal"
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
                  setBirthdate({ day: "", month: "" });
                  setResult("");
                }}
              >
                ✕
              </button>

              <h2 className="text-uppercase heading-calculator">
                Know your Sign
              </h2>

              {/* NAME */}
              <input
                type="text"
                placeholder="YOUR NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-uppercase underline-input sora"
              />

              {/* ✅ DAY + MONTH SELECT */}
              <div className="d-flex gap-2 mt-3">
                {/* DAY */}
                <select
                  value={birthdate.day}
                  onChange={(e) =>
                    setBirthdate({
                      ...birthdate,
                      day: parseInt(e.target.value),
                    })
                  }
                  className="underline-input sora"
                >
                  <option value="">DAY</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                {/* MONTH */}
                <select
                  value={birthdate.month}
                  onChange={(e) =>
                    setBirthdate({
                      ...birthdate,
                      month: parseInt(e.target.value),
                    })
                  }
                  className="underline-input sora"
                >
                  <option value="">MONTH</option>
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* BUTTON */}
              <button className="btn btn-outline-dark w-50 sora mt-3" onClick={calculateZodiac}>
                Get Zodiac Sign
              </button>

              {/* RESULT */}
              {result && (
                <p className="result text-uppercase sora mt-4">
                  Your Zodiac Sign{" "}
                  <strong className="text-dark">{result}</strong>
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
