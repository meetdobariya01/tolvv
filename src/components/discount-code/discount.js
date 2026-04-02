import React from "react";
import "./discount.css";

const TopBanner = () => {
  const text = "Launch Offer - 5% Off | USE CODE - LAUNCH5";

  return (
    <div className="top-banner sora">
      <div className="scroll-track">
        <div className="scroll-content">
          {[...Array(10)].map((_, i) => (
            <span key={i}>
              Launch Offer - 5% Off | <b>USE CODE - LAUNCH5</b>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div className="scroll-content">
          {[...Array(10)].map((_, i) => (
            <span key={i}>
              Launch Offer - 5% Off | <b>USE CODE - LAUNCH5</b>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
