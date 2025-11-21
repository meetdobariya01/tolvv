import React, { useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import './mainproduct.css'

const Mainproduct = () => {
  const [activeKey, setActiveKey] = useState(null);

  // YOUR WHATSAPP NUMBER IN INTERNATIONAL FORMAT
  const whatsappNumber = "919913644455";

  // Function to open WhatsApp
  const sendToWhatsApp = (product) => {
    const message = `I want to buy:\nProduct Name: ${product.name}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  const categories = [
    "Bath Gel",
    "Soap",
    "Perfume",
    "Essential Oil",
    "Body Lotion",
  ];

  // ---------- 60 Products (12 per category) ----------
  const productsByCategory = {
    "Bath Gel": [
      {
        name: "Aries Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/aries-bath-gel.jpg",
      },
      {
        name: "Taurus Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/taurus-bath-gel.jpg",
      },
      {
        name: "Gemini Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/gemini-bath-gel.jpg",
      },
      {
        name: "Cancer Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/cancer-bath-gel.jpg",
      },
      {
        name: "Leo Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/leo-bath-gel.jpg",
      },
      {
        name: "Virgo Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/virgo-bath-gel.jpg",
      },
      {
        name: "Libra Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/libra-bath-gel.jpg",
      },
      {
        name: "Scorpio Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/scorpio-bath-gel.jpg",
      },
      {
        name: "Sagittarius Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/sagittarius-bath-gel.jpg",
      },
      {
        name: "Capricorn Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/capricorn-bath-gel.jpg",
      },
      {
        name: "Aquarius Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/aquarius-bath-gel.jpg",
      },
      {
        name: "Pisces Bath Gel",
        price: "₹750",
        img: "./images/product/bath-gel/pisces-bath-gel.jpg",
      },
    ],

    Soap: [
      {
        name: "Aries Soap",
        price: "₹200",
        img: "./images/product/soap/aries-soap.jpg",
      },
      {
        name: "Taurus Soap",
        price: "₹200",
        img: "./images/product/soap/taurus-soap.jpg",
      },
      {
        name: "Gemini Soap",
        price: "₹200",
        img: "./images/product/soap/gemini-soap.jpg",
      },
      {
        name: "Cancer Soap",
        price: "₹200",
        img: "./images/product/soap/cancer-soap.jpg",
      },
      {
        name: "Leo Soap",
        price: "₹200",
        img: "./images/product/soap/leo-soap.jpg",
      },
      {
        name: "Virgo Soap",
        price: "₹200",
        img: "./images/product/soap/virgo-soap.jpg",
      },
      {
        name: "Libra Soap",
        price: "₹200",
        img: "./images/product/soap/libra-soap.jpg",
      },
      {
        name: "Scorpio Soap",
        price: "₹200",
        img: "./images/product/soap/scorpio-soap.jpg",
      },
      {
        name: "Sagittarius Soap",
        price: "₹200",
        img: "./images/product/soap/sagittarius-soap.jpg",
      },
      {
        name: "Capricorn Soap",
        price: "₹200",
        img: "./images/product/soap/capricorn-soap.jpg",
      },
      {
        name: "Aquarius Soap",
        price: "₹200",
        img: "./images/product/soap/aquarius-soap.jpg",
      },
      {
        name: "Pisces Soap",
        price: "₹200",
        img: "./images/product/soap/pisces-soap.jpg",
      },
    ],

    Perfume: [
      {
        name: "Aries Perfume",
        price: "₹1800",
        img: "./images/product/perfume/aries-perfume.jpg",
      },
      {
        name: "Taurus Perfume",
        price: "₹1800",
        img: "./images/product/perfume/taurus-perfume.jpg",
      },
      {
        name: "Gemini Perfume",
        price: "₹1800",
        img: "./images/product/perfume/gemini-perfume.jpg",
      },
      {
        name: "Cancer Perfume",
        price: "₹1800",
        img: "./images/product/perfume/cancer-perfume.jpg",
      },
      {
        name: "Leo Perfume",
        price: "₹1800",
        img: "./images/product/perfume/leo-perfume.jpg",
      },
      {
        name: "Virgo Perfume",
        price: "₹1800",
        img: "./images/product/perfume/virgo-perfume.jpg",
      },
      {
        name: "Libra Perfume",
        price: "₹1800",
        img: "./images/product/perfume/libra-perfume.jpg",
      },
      {
        name: "Scorpio Perfume",
        price: "₹1800",
        img: "./images/product/perfume/scorpio-perfume.jpg",
      },
      {
        name: "Sagittarius Perfume",
        price: "₹1800",
        img: "./images/product/perfume/sagittarius-perfume.jpg",
      },
      {
        name: "Capricorn Perfume",
        price: "₹1800",
        img: "./images/product/perfume/capricorn-perfume.jpg",
      },
      {
        name: "Aquarius Perfume",
        price: "₹1800",
        img: "./images/product/perfume/aquarius-perfume.jpg",
      },
      {
        name: "Pisces Perfume",
        price: "₹1800",
        img: "./images/product/perfume/pisces-perfume.jpg",
      },
    ],

    "Essential Oil": [
      {
        name: "Aries Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/aries-essential-oil.jpg",
      },
      {
        name: "Taurus Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/taurus-essential-oil.jpg",
      },
      {
        name: "Gemini Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/gemini-essential-oil.jpg",
      },
      {
        name: "Cancer Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/cancer-essential-oil.jpg",
      },
      {
        name: "Leo Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/leo-essential-oil.jpg",
      },
      {
        name: "Virgo Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/virgo-essential-oil.jpg",
      },
      {
        name: "Libra Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/libra-essential-oil.jpg",
      },
      {
        name: "Scorpio Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/scorpio-essential-oil.jpg",
      },
      {
        name: "Sagittarius Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/sagittarius-essential-oil.jpg",
      },
      {
        name: "Capricorn Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/capricorn-essential-oil.jpg",
      },
      {
        name: "Aquarius Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/aquarius-essential-oil.jpg",
      },
      {
        name: "Pisces Essential Oil",
        price: "₹750",
        img: "./images/product/essential-oil/pisces-essential-oil.jpg",
      },
    ],

    "Body Lotion": [
      {
        name: "Aries Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/aries-body-lotion.jpg",
      },
      {
        name: "Taurus Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/taurus-body-lotion.jpg",
      },
      {
        name: "Gemini Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/gemini-body-lotion.jpg",
      },
      {
        name: "Cancer Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/cancer-body-lotion.jpg",
      },
      {
        name: "Leo Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/leo-body-lotion.jpg",
      },
      {
        name: "Virgo Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/virgo-body-lotion.jpg",
      },
      {
        name: "Libra Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/libra-body-lotion.jpg",
      },
      {
        name: "Scorpio Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/scorpio-body-lotion.jpg",
      },
      {
        name: "Sagittarius Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/sagittarius-body-lotion.jpg",
      },
      {
        name: "Capricorn Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/capricorn-body-lotion.jpg",
      },
      {
        name: "Aquarius Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/aquarius-body-lotion.jpg",
      },
      {
        name: "Pisces Body Lotion",
        price: "₹750",
        img: "./images/product/body-lotion/pisces-body-lotion.jpg",
      },
    ],
  };

  return (
    <div>
      {/* Header Section */}
      <Header />

      {/* Product Accordion Section */}

      <div className="container py-5">
        <Accordion activeKey={activeKey}>
          {categories.map((cat, index) => (
            <Accordion.Item
              eventKey={index.toString()}
              key={index}
              onClick={() =>
                setActiveKey(
                  activeKey === index.toString() ? null : index.toString()
                )
              }
            >
              <Accordion.Header>{cat}</Accordion.Header>

              <Accordion.Body>
                <div className="row">
                  {productsByCategory[cat].map((item, i) => (
                    <div className="col-6 col-md-3 mb-4" key={i}> 
                      <Card className="border-0">
                        <Card.Img variant="top" src={item.img} />

                        <Card.Body className="text-center">
                          <Card.Title className="main-product-name">
                            {item.name}
                          </Card.Title>

                          <p className="text-muted fw-bold">{item.price}</p>

                          {/* WhatsApp Button */}
                          <Button
                            variant="dark"
                            size="sm"
                            className="rounded-0 w-100"
                            onClick={() => sendToWhatsApp(item)}
                          >
                            BUY NOW 
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Mainproduct;
