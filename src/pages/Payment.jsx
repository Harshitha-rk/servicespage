import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import "./Payment.css";
import { supabase } from "../components/supabaseClient";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  let { services = [], date, time, month, year } = location.state || {};

  if (typeof services === "string") {
    try {
      services = JSON.parse(services);
    } catch {
      services = [];
    }
  }

  const selectedServices = useMemo(() => services || [], [services]);

  /* ================= FORM STATE ================= */

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [message, setMessage] = useState("");

  /* ================= AUTO-FILL FROM PROFILE ================= */

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profile") // ✅ correct table
        .select("full_name, email, phone, address, pincode")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error.message);
        return;
      }

      if (data) {
        setFirstName(data.full_name || "");
        setLastName("");
        setEmail(data.email || user.email || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setCity("");
        setZip(data.pincode || "");
      }
    };

    loadProfile();
  }, []);

  /* ================= TOTAL ================= */

  const totalAmount = useMemo(() => {
    return selectedServices.reduce((sum, s) => {
      const price = Number(String(s.price || "0").replace(/[^0-9]/g, ""));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  }, [selectedServices]);

  /* ================= CONTINUE ================= */

  const handleContinue = () => {
    navigate("/checkout", {
      state: {
        services: selectedServices,
        total: totalAmount,
        booking: { date, time, month, year },
        customer: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          zip,
          message,
        },
      },
    });
  };

  /* ================= UI ================= */

  return (
    <div className="payment-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="page-title">Booking Form</h1>

      <div className="main-row">
        <div className="left">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name *"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
          <input
            value={email}
            disabled
            placeholder="Email *"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone *"
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Zip"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
          />
        </div>

        <div className="right">
          <h3 className="section-title">Service Details</h3>

          {selectedServices.map((s, i) => (
            <div key={i} className="service-card">
              <strong>{s.title || s.name}</strong>
              <div>{s.duration}</div>
              <div>{s.price}</div>
              <div>
                {date} {MONTHS[month]} {year} at {time}
              </div>
            </div>
          ))}

          <div className="total-row">
            <span>Total</span>
            <strong>₹{totalAmount}</strong>
          </div>

          <button className="primary-btn" onClick={handleContinue}>
            Continue to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
