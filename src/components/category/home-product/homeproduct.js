import React from "react";
import "./homeproduct.css";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const products = [
  {
    title: "Bath Gel",
    size: "200 ml",
    img: "/images/bl.png",
    link: "/product",
  },
  {
    title: "Body Lotion",
    size: "200 ml",
    img: "/images/bb.png",
    link: "/product",
  },
  {
    title: "Perfume",
    size: "50 ml",
    img: "/images/pr.png",
    link: "/product",
  },
  {
    title: "Essential Oil",
    size: "30 ml",
    img: "/images/eo.png",
    link: "/product",
  },
  {
    title: "Soap",
    size: "100 gms",
    img: "/images/sp.png",
    link: "/product",
  },
  {
    title: "Hampers",
    size: "",
    img: "/images/hamper.jpg",
    link: "/product",
  },
];

const Homeproduct = () => {
  return (
    <section className="products-section">
      <Container>
        <h2 className="products-heading artisan-font">All Sun Signs</h2>
        <h5 className="products-subheading text-center mb-5 text-uppercase sora">Product</h5>

        <Row className="gx-4 gy-3">
          {products.map((item, index) => (
            <Col
              key={index}
              xs={4} // ✅ MOBILE → 2 ITEMS
              sm={4}
              md={4}
              lg={2}
            >
              <div className="product-card-collection">
                <Link to={item.link} className="text-decoration-none">
                  <div className="product-img-card">
                    <img src={item.img} alt={item.title} />
                  </div>

                  <div className="product-info-collection sora">
                    <h5 className="d-flex justify-content-between">
                      {item.title} <span className="">›</span>
                    </h5>
                    <div className="underline" />
                    <p>{item.size}</p>
                  </div>
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Homeproduct;
