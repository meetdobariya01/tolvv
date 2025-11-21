import React from "react";
import "./product.css";

const itemsData = [
  { name: "BATH GEL", img: "./images/bath-gel.jpg" },
  { name: "BATH LOTION", img: "./images/body-lotion.jpg" },
  { name: "SOAP", img: "./images/soap.jpg" },
  { name: "ESSENTIAL OIL", img: "./images/oil.jpg" },
  { name: "EAU DE PERFUMES", img: "./images/perfume.jpg" },
];

const Product = () => {
  return (
    <div className="aries-wrapper">
      <div className="container text-center py-5">
        <p className="aries-top-text animate__animated animate__fadeInDown">
          Experience the goodness of Ginger, Cinnamon and Coconut in our Aries
          products
        </p>

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

        <p className="aries-bottom-text animate__animated animate__fadeInUp">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed <br />
          diam nonummy nibh euismod
        </p>
      </div>
    </div>
  );
};

export default Product;
