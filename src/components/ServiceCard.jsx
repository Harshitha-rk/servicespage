import React from "react";
import "../Services.css";
import "./ServiceCard.css";

export default function ServiceCard({ service, onView, onBookNow }) {
  return (
    <div className="service-card">
      {service.image && (
        <img
          src={service.image}
          alt={service.title}
          className="service-card-image"
          loading="lazy"
        />
      )}

      <div className="service-card-content">
        <h3 className="service-title">{service.title}</h3>

        <p className="service-duration">{service.duration}</p>

        <span className="service-price-badge">{service.price}</span>

        <div className="actions">
          <button
            type="button"
            className="view-service-btn"
            onClick={onView}
          >
            View Service
          </button>

          {onBookNow && (
            <button
              type="button"
              className="book-now-btn"
              onClick={onBookNow}
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
