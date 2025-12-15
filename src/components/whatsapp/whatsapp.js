import React, { useState } from "react";
import "./whatsapp.css";

const WhatsappButton = () => {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (sent) return;

    const message = "How can I help you?";
    const phone = "919824257356";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

    setSent(true);     // prevent multiple messages
    setOpen(false);    // close popup
  };

  return (
    <>
      {open && (
        <div className="wa-popup">
          <div className="wa-popup-header">
            <strong>Chat with us</strong>
            <span className="wa-close" onClick={() => setOpen(false)}>
              ×
            </span>
          </div>

          <div className="wa-popup-body">
            <p>Hello 👋</p>

            <button
              onClick={handleSend}
              className="wa-send-btn"
              disabled={sent}
            >
              {sent ? "Message Sent ✅" : "Start Chat"}
            </button>
          </div>
        </div>
      )}

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
