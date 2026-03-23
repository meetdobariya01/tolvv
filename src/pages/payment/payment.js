import React from "react";
import "./payment.css";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Payment = () => {
  return (
    <div>
      {/* Header section*/}
      <Header />
      <div className="payment-page">
        <div className="thankyou-container sora">
          <div className="row g-0 h-100">
            {/* LEFT SIDE */}
            <div className="col-md-7 left-panel d-flex flex-column justify-content-center align-items-center">
              <h1 className="thank-text artisan-font">Thank You</h1>

              {/* <div className="line"></div> */}

              <p className="back-link mt-5 d-flex align-items-end">
                Go back to shopping <span>›</span>
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-md-5 right-panel d-flex justify-content-center align-items-center">
              <div className="success-box text-center">
                {/* CHECK ICON */}
                <div className="check-icon">
                  <img
                    src="./images/check-circle.png"
                    alt="success"
                    className="check-img"
                  />
                </div>

                <h6 className="title mt-5">PAYMENT SUCCESSFUL</h6>

                <p className="desc mt-4 mb-1">
                  Your order is on its way to a little moment of indulgence.
                </p>
                <p className="desc mt-4">
                  Get ready to unwrap self-care, <br /> crafted just for you.
                </p>

                <p className="view-order mt-5">
                  Order received. View your order <span>›</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Payment;
