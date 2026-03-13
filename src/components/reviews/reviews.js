import React from "react";
import { Container, Carousel } from "react-bootstrap";
import "./reviews.css";

const Reviews = () => {
  const reviews = [
    {
      text: "I bought Gemini Bath Gel. It has beautiful texture and such a refined fragrance. It feels gentle on the skin. I feel properly cleansed and refreshed.",
      name: "Preeti Arora",
    },
    {
      text: "I love how soft my skin feels after using Aries Bath Gel. The scent is subtle and calming — it makes my shower feel intentional, not rushed.",
      name: "Saumya Shah",
    },
    {
      text: "I’ve tried many bath gels, but this Virgo Bath Gel feels elevated. It turns a basic shower into something indulgent.",
      name: "Mihir Shah",
    },
  ];
  return (
    <div>
      <section className="reviews-section sora">
        <Container>
          <h2 className="reviews-title text-center artisan-font">Customer Reviews</h2>

          <Carousel
            indicators={false}
            controls={true}
            interval={4000}
            pause={false}
          >
            {reviews.map((review, index) => (
              <Carousel.Item key={index}>
                <div className="review-content">
                  <p className="review-text">{review.text}</p>

                  <h6 className="review-name">- {review.name}</h6>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>
    </div>
  );
};

export default Reviews;
