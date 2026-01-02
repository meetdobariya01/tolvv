import React from "react";
import "./homeproduct.css";
import { NavLink } from "react-router-dom";

const products = [
  {
    name: "Bath Gel",
    size: "200 ml",
    img: "./images/bb.png",
    link: "/product",
  },
  {
    name: "Body Lotion",
    size: "200 ml",
    img: "./images/bl.png",
    link: "/product",
  },
  {
    name: "Perfume",
    size: "50 ml",
    img: "./images/pr.png",
    link: "/product",
  },
  {
    name: "Essential Oil",
    size: "30 ml",
    img: "./images/eo.png",
    link: "/product",
  },
  {
    name: "Soap",
    size: "100 gm",
    img: "./images/sp.png",
    link: "/product",
  },
   {
    name: "Hamper",
    size: "5 Products",
    img: "./images/2.png",
    link: "/product",
  },
];
const Homeproduct = () => {
  return (
    <div>
      <section className="product-section">
        <h2 className="product-heading the-artisan-font">Products</h2>

        <div className="container">
          <div className="row justify-content-center">
            {products.map((p, index) => (
              <div className="col-6 col-md-4 col-lg-2 product-card" key={index}>
                <NavLink to={p.link} className="card product-box">
                  <img src={p.img} alt={p.name} className="product-img-1" />

                  <div className="product-info">
                    <p className="name">
                      {p.name} <span className="arrow">›</span>
                    </p>
                    <p className="size">{p.size}</p>
                    <div className="underline" />
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homeproduct;
