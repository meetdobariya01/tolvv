import React from "react";
import "./leoproduct.css";

const itemsData = [
  { name: "BATH GEL", img: "./images/product/bath-gel/leo-bath-gel.jpg" },
  { name: "BATH LOTION", img: "./images/product/body-lotion/leo-body-lotion.jpg" },
  { name: "SOAP", img: "./images/product/soap/leo-soap.jpg" },
  { name: "ESSENTIAL OIL", img: "./images/product/essential-oil/leo-essential-oil.jpg" },
  { name: "EAU DE PERFUMES", img: "./images/product/perfume/leo-perfume.jpg" },
];

const Leoproduct = () => {
  return (
    <div>
      <div className="aries-wrapper">
        <div className="container text-center py-5">
          <div className="row g-4 justify-content-center aries-grid">
            {itemsData.map((item, index) => (
              <div className="col-6 col-md-4 col-lg-2 aries-col" key={index}>
                <div className="aries-card animate__animated animate__zoomIn">
                  <img src={item.img} alt={item.name} className="aries-img" />
                  <h6 className="aries-name">{item.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leoproduct;
