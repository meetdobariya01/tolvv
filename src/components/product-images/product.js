import React from "react";

const itemsData = [
  { name: "BATH GEL", img: "./images/bath-gel.jpg" },
  { name: "BATH LOTION", img: "./images//body-lotion.jpg" },
  { name: "SOAP", img: "./images/soap.jpg" },
  { name: "ESSENTIAL OIL", img: "./images/oil.jpg" },
  { name: "EAU DE PERFUMES", img: "./images/perfume.jpg" },
  { name: "CANDLE", img: "/images/products/candle.jpg" },
];

const Product = () => {
  return (
    <div>
      <div className="container py-5 text-center">
        {/* Top Text */}
        <p
          className="text-muted mb-4 animate__animated animate__fadeInDown"
          style={{ fontSize: "15px" }}
        >
          Experience the goodness of Ginger, Cinnamon and Coconut in our Aries
          products
        </p>

        {/* Product Grid */}
        <div className="row g-4 justify-content-center">
          {itemsData.map((item, index) => (
            <div
              className="col-6 col-md-4 d-flex justify-content-center"
              key={index}
            >
              <div
                className="product-box animate__animated animate__zoomIn"
                style={{
                  width: "100%",
                  height: "300px",
                  background: "#e0e0e0",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "6px",
                }}
              >
                {/* Product Image */}
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />

                {/* Product Name */}
                <h6
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                    textAlign: "center",
                    color: "#000",
                    fontWeight: "600",
                    letterSpacing: "1px",
                    background: "rgba(255, 255, 255, 0.7)",
                    padding: "8px 0",
                    margin: 0,
                  }}
                >
                  {item.name}
                </h6>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <p
          className="mt-4 animate__animated animate__fadeInUp"
          style={{
            fontSize: "16px",
            color: "#000",
          }}
        >
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed <br />
          diam nonummy nibh euismod
        </p>
      </div>
    </div>
  );
};

export default Product;
