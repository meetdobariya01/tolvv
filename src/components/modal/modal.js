import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import "./modal.css";

const HomeModal = () => {
  const [show, setShow] = useState(false);

  // ⏱ Auto open after 3 sec
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      size="lg"
      className="custom-modal sora"
    >
      <Modal.Body className="p-0">
        <div className="row g-0 modal-wrapper">
          {/* LEFT IMAGE */}
          <div className="col-md-6 d-none d-md-block">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="modal-image"
            >
              <img
                src="./images/modal-image.png" // 👉 replace with your image path
                alt="ritual"
                className="img-fluid h-100 w-100 object-fit-cover"
              />
            </motion.div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-md-6 col-12 d-flex align-items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="px-4 w-100"
            >
              {/* CLOSE BUTTON */}
              <div className="text-end">
                <button
                  className="btn-close"
                  onClick={() => setShow(false)}
                ></button>
              </div>

              <h4 className="mb-4 fw-semibold text-center text-md-start">
                <span className="artisan-font begin-text">Begin</span><span className="tolvv-name"> Your TOLVV Ritual</span>
              </h4>

              <div className="form-check mt-3 ">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label small">
                  Subscribe to our newsletter and get <br />{" "}
                  <b>Extra 10% off</b> on your first order
                </label>
              </div>

              <div className="mb-3">
                <label className="form-label small">YOUR EMAIL ID</label>
                <input
                  type="email"
                  className="form-control border-0 underline-input text-form border-bottom rounded-0"
                  placeholder="xyz@gmail.com"
                />
              </div>

              <button className="btn btn-outline-dark btn-sm get-code-btn">
                GET A CODE
              </button>

              <p className="small mt-3 text-muted">
                Your inbox has a little surprise waiting for you.
              </p>
            </motion.div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default HomeModal;
