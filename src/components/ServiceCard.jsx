import React from "react";
import "../Services.css";

export default function ServiceCard({ service, onPress }) {
  return (
    <div className="service-card" onClick={onPress}>
      <img src={service.image} alt={service.title} />
      <div className="service-card-content">
        <h3>{service.title}</h3>
        <p>{service.duration}</p>
        <p>{service.price}</p>
        <div className="view-service-btn">View Service</div>
      </div>
    </div>
  );
}
