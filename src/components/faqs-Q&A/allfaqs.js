import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./allfaqs.css";

const faqData = [
  {
    q: "What makes your self-care products different from others in the market?",
    a: "Our products blend luxury skincare with the unique energy of each zodiac sign. Every fragrance and ingredient is intentionally chosen to match the personality of your sign, creating a personalized self-care ritual you won’t find anywhere else.",
  },
  {
    q: "Are your products natural, organic, or cruelty-free?",
    a: "Yes, our products are created with naturally derived ingredients and clean, cruelty-free formulations. Many of our botanicals are organic and responsibly sourced.",
  },
  {
    q: "Are your products dermatologically or clinically tested?",
    a: "Yes, our skincare range is dermatologically tested to ensure safety, gentleness, and effectiveness for all skin types.",
  },
  {
    q: "Where do you source your ingredients from?",
    a: "We source high-quality plant extracts, essential oils, and nourishing bases from trusted global suppliers chosen for purity and energetic alignment with each zodiac formula.",
  },
  {
    q: "Are your products safe for sensitive skin?",
    a: "Yes, our formulas are designed to be gentle, hydrating, and non-irritating. However, for extremely sensitive skin, we recommend a patch test.",
  },
  {
    q: "Where can I buy your products – online or in store?",
    a: "You can purchase our full Zodiac Collection directly through our online store. Select boutique partners also carry our products.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we offer worldwide shipping so you can enjoy your zodiac-aligned self-care anywhere in the world.",
  },
  {
    q: "What is your return or exchange policy?",
    a: "We offer a simple return or exchange policy for unused, unopened items within 7–14 days. Customer satisfaction is our priority.",
  },
  {
    q: "Are they suitable for men, women, and teenagers alike?",
    a: "Absolutely. Our fragrances and formulations are gender-neutral and suitable for both adults and teens.",
  },
  {
    q: "Are your products safe during pregnancy or breastfeeding?",
    a: "Our products are made with gentle ingredients, but we recommend consulting your doctor—especially when using essential-oil-based products.",
  },
];

const Allfaqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <div className="faq-wrapper minimal sora">
        {faqData.map((item, index) => (
          <div className="faq-line" key={index}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span className="q-num">{index + 1}.</span>
              <p>{item.q}</p>
            </div>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="faq-divider"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Allfaqs;
