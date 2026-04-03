import React from "react";
import { Container, Carousel } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./reviews.css";

const Reviews = () => {
  const reviews = [
    {
      text: "I bought Gemini Bath Gel. It has beautiful texture and such a refined fragrance. It feels gentle on the skin. I feel properly cleansed and refreshed.",
      name: "Preeti Arora",
      heartColor: "#BB892C",
      leftImg: "/images/ingredient/Lemon-08.png",
      rightImg: "/images/ingredient/Lavender-04.png",
    },
    {
      text: "I love how soft my skin feels after using Aries Bath Gel. The scent is subtle and calming — it makes my shower feel intentional, not rushed.",
      name: "Saumya Shah",
      heartColor: "#7A1318",
      leftImg: "./images/ingredient/Ginger-12.png",
      rightImg: "./images/ingredient/Cinnamon-07.png",
    },
    {
      text: "I’ve tried many bath gels, but this Virgo Bath Gel feels elevated. It turns a basic shower into something indulgent.",
      name: "Mihir Shah",
      heartColor: "#DC4D2D",
      leftImg: "/images/ingredient/Fennel-21.png",
      rightImg: "/images/ingredient/Lemongrass-18.png",
    },
  ];

  return (
    <section className="reviews-section sora">
      <Container>
        <h2 className="reviews-title text-center artisan-font">
          Customer Reviews
        </h2>

        <Carousel
          indicators={true}
          controls={false}
          interval={5000}
          pause={false}
        >
          {reviews.map((review, index) => (
            <Carousel.Item key={index}>
              <div className="review-wrapper">
                {/* Left Image */}
                <img
                  src={review.leftImg}
                  alt="decor"
                  className="review-img left-img"
                />

                {/* Content */}
                <div className="review-content">
                  <div className="heart" style={{ color: review.heartColor }}>
                    <FontAwesomeIcon icon={faHeart} size="2xl" />
                  </div>

                  <p className="review-text">{review.text}</p>
                  <h6 className="review-name">- {review.name}</h6>
                </div>

                {/* Right Image */}
                <img
                  src={review.rightImg}
                  alt="decor"
                  className="review-img right-img"
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default Reviews;
