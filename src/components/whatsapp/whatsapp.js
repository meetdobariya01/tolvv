import React, { useState } from "react";
import "./whatsapp.css";

const WhatsappButton = () => {
  const [open, setOpen] = useState(false);

  // States for inputs
  const [birthdate, setBirthdate] = useState("");
  const [firstLetter, setFirstLetter] = useState("");

  const handleSend = () => {
    const message = `My birthdate is: ${birthdate}, The first letter of my name: ${firstLetter}`;
    const phone = "919824257356";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <>
      {/* Popup */}
      {open && (
        <div className="wa-popup">
          <div className="wa-popup-header">
            <strong>Chat with us</strong>
            <span className="wa-close" onClick={() => setOpen(false)}>
              ×
            </span>
          </div>

          <div className="wa-popup-body">
            <p>Hi 👋 Please enter your Birthdate and first letter of my name</p>

            {/* Birthdate input */}
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="wa-input"
              placeholder="Enter your birthdate"
            />

            {/* First letter input */}
            <input
              type="text"
              maxLength="1"
              value={firstLetter}
              onChange={(e) => setFirstLetter(e.target.value)}
              className="wa-input"
              placeholder="First letter of your name"
            />

            <button onClick={handleSend} className="wa-send-btn">
              Start Chat
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <div className="whatsapp-container" onClick={() => setOpen(true)}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="whatsapp-icon"
        />
      </div>
    </>
  );
};

export default WhatsappButton;
