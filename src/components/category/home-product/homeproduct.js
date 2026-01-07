import React from "react";
import "./homeproduct.css";
import { Container, Row, Col } from "react-bootstrap";

const products = [
  { title: "Bath Gel", size: "200 ml", img: "/images/bl.png" },
  { title: "Body Lotion", size: "200 ml", img: "/images/bb.png" },
  { title: "Perfume", size: "50 ml", img: "/images/pr.png" },
  { title: "Essential Oil", size: "30 ml", img: "/images/eo.png" },
  { title: "Soap", size: "100 gsm", img: "/images/sp.png" },
  { title: "Hampers", size: "", img: "/images/hamper.jpg" },
];

const Homeproduct = () => {
  return (
    <section className="products-section">
      <Container>
        <h2 className="products-heading allura-regular">Products</h2>

        <Row className="gx-4 gy-3">
          {products.map((item, index) => (
            <Col
              key={index}
              xs={6} // ✅ MOBILE → 2 ITEMS
              sm={6}
              md={4}
              lg={2}
            >
              <div className="product-card">
                <div className="product-img-card">
                  <img src={item.img} alt={item.title} />
                </div>

                <div className="product-info-collection">
                  <h5>
                    {item.title} <span>›</span>
                  </h5>
                  <div className="underline" />
                  <p>{item.size}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Homeproduct;
