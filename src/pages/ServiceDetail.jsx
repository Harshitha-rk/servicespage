import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../components/supabaseClient";
import { useCart } from "../context/Context";
import "./ServiceDetail.css";

export default function ServiceDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const service = state?.service;

  const { addToCart, isInCart } = useCart();

  const [showSummary, setShowSummary] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  /* ================= FETCH SERVICES ================= */
  useEffect(() => {
    supabase
      .from("services")
      .select("id, title, duration, price, image")
      .then(({ data }) => {
        if (data) setAvailableServices(data);
      });
  }, []);

  /* ================= INIT SELECTED SERVICE ================= */
  useEffect(() => {
    if (service) {
      setSelectedServices([
        {
          id: service.id,
          title: service.title,
          duration: service.duration,
          price: service.price,
          image: service.image,
        },
      ]);
    }
  }, [service]);

  /* ================= HELPERS ================= */
  const handleBookNow = () => {
    if (!service) return;
    setShowSummary(true);
  };

  const addService = (svc) => {
    if (selectedServices.find((s) => s.id === svc.id)) return;
    setSelectedServices((prev) => [...prev, svc]);
    setShowAddService(false);
    setShowSummary(true);
  };

  const removeService = (id) => {
    if (selectedServices.length === 1) return;
    setSelectedServices((prev) => prev.filter((s) => s.id !== id));
  };

  const descriptionLines = useMemo(() => {
    if (!service) return [];
    return (service.description || "")
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((l) => l.trim());
  }, [service]);

  if (!service) return <div>Service not found</div>;

  return (
    <div className="service-detail">
      <img src={service.image} alt={service.title} className="hero-img" />

      <div className="content">
        <h1>{service.title}</h1>
        <p>
          {service.duration} • {service.price}
        </p>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="actions">
          <button type="button" className="primary" onClick={handleBookNow}>
            Book Now
          </button>

          <div className="cart-group">
            <button
              type="button"
              className="secondary"
              onClick={() => {
                if (isInCart(service.id)) {
                  alert("Already in cart");
                  return;
                }
                addToCart(service);
                alert("Added to cart");
              }}
            >
              🛒
            </button>

            <button
              type="button"
              className="my-cart"
              onClick={() => navigate("/cart")}
            >
              My Cart
            </button>
          </div>
        </div>

        <h3>Description</h3>
        {descriptionLines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}

        {Array.isArray(service.gallery_images) && (
          <div className="gallery">
            {service.gallery_images.map((img, i) => (
              <img key={i} src={img} alt="" />
            ))}
          </div>
        )}
      </div>

      {/* ================= APPOINTMENT SUMMARY ================= */}
      {showSummary && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button
              className="modal-close"
              onClick={() => setShowSummary(false)}
            >
              
            </button>

            <h2 className="modal-title">Appointment Summary</h2>

            {selectedServices.map((s) => (
              <div key={s.id} className="summary-item">
                <span className="service-name">{s.title}</span>
                <span className="service-time">{s.duration}</span>
                <span className="service-price">{s.price}</span>

                {selectedServices.length > 1 && (
                  <button onClick={() => removeService(s.id)}>Remove</button>
                )}
              </div>
            ))}

            <button
              className="add-service-btn"
              onClick={() => {
                setShowSummary(false);
                setShowAddService(true);
              }}
            >
              + Add Another Service
            </button>

            <button
              className="schedule-btn"
              onClick={() =>
                navigate("/booking", { state: { services: selectedServices } })
              }
            >
              Schedule Appointment
            </button>
          </div>
        </div>
      )}

      {/* ================= ADD SERVICE MODAL ================= */}
      {showAddService && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button
              className="modal-close"
              onClick={() => {
                setShowAddService(false);
                setShowSummary(true);
              }}
            >
              ✕
            </button>

            <h2 className="modal-title">Add Another Service</h2>

            {availableServices
              .filter(
                (s) => !selectedServices.find((sel) => sel.id === s.id)
              )
              .map((svc) => (
                <div key={svc.id} className="summary-item">
                  <span className="service-name">{svc.title}</span>
                  <span className="service-time">{svc.duration}</span>
                  <span className="service-price">{svc.price}</span>
                  <button
                    className="add-service-btn"
                    onClick={() => addService(svc)}
                  >
                    + Add
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
