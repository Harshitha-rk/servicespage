import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./ServiceDetail.css";

export default function ServiceDetail() {
  const location = useLocation();
  const service = location.state?.service;

  if (!service) {
    return (
      <div className="not-found">
        <p>Service not found</p>
      </div>
    );
  }

  const renderDescription = () => {
    switch (service.service_type) {
      case "KITCHEN":
        return "A professional kitchen cleaning service focused on removing grease, stains, and bacteria to maintain a hygienic cooking environment.";
      case "BATHROOM":
        return "A detailed bathroom cleaning service designed to leave your bathroom fresh, sanitized, and spotless.";
      default:
        return "A comprehensive deep cleaning service for your home, covering major living spaces for a healthier environment.";
    }
  };

  const renderIncludes = () => {
    switch (service.service_type) {
      case "KITCHEN":
        return [
          "Kitchen countertop cleaning",
          "Stove & chimney degreasing",
          "Sink & tap sanitization",
          "Cabinet exterior wipe-down",
          "Floor sweeping & mopping",
        ];
      case "BATHROOM":
        return [
          "Toilet cleaned & disinfected",
          "Sink & vanity sanitized",
          "Shower / bathtub scrubbed",
          "Mirrors & fittings polished",
          "Floor swept & mopped",
        ];
      default:
        return [
          "Living room & bedroom cleaning",
          "Kitchen surface wipe-down",
          "Floor vacuum & mopping",
          "Trash removal",
          "High-touch area disinfection",
        ];
    }
  };

  return (
    <div className="detail-page">
      {/* Hero Image */}
      <img
        src={service.image}
        alt={service.title}
        className="hero-image"
      />

      <div className="detail-content">
        {/* Title */}
        <h1>{service.title}</h1>

        {/* Meta */}
        <p className="meta">
          {service.duration} • {service.price}
        </p>

        {/* Book Button */}
        <button className="book-btn">Book Now</button>

        {/* Description */}
        <h2>Service Description</h2>
        <p className="description">{renderDescription()}</p>

        {/* Includes */}
        <h2>Includes</h2>
        <ul className="includes">
          {renderIncludes().map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        {/* Gallery */}
        {service.gallery_images?.length > 0 && (
          <>
            <h2>Gallery</h2>
            <div className="gallery">
              {service.gallery_images.map((img, index) => (
                <img key={index} src={img} alt="Gallery" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
