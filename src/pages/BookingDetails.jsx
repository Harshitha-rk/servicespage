import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../components/supabaseClient";
import "./BookingDetails.css";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.warn("User not logged in");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Booking fetch error:", error.message);
      } else {
        setBooking(data);
      }

      setLoading(false);
    };

    fetchBookingDetails();
  }, [id]);

  if (loading) {
    return <p className="loading">Loading booking...</p>;
  }

  if (!booking) {
    return <p className="empty">Booking not found</p>;
  }

  return (
    <div className="booking-details-wrapper">
      {/* ✅ TOP LEFT BACK BUTTON */}
      <button className="back-arrow" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="booking-details-container">
        <h2>Booked Service Details</h2>

        <div className="details-card">
          <p><strong>Name:</strong> {booking.customer_name}</p>
          <p><strong>Status:</strong> {booking.payment_status.toUpperCase()}</p>
          <p>
            <strong>Date & Time:</strong>{" "}
            {booking.booking_date} at {booking.booking_time}
          </p>
          <p><strong>Total:</strong> ₹{booking.total_amount}</p>
          <p><strong>Phone:</strong> {booking.phone_number}</p>
          <p><strong>Address:</strong> {booking.full_address}</p>

          <hr />

          <h3>Services</h3>

          {booking.services?.map((s, i) => (
            <div key={i} className="service-box">
              <p><strong>{s.name || s.title}</strong></p>
              {s.type && <p>Type: {s.type}</p>}
              {s.duration && <p>Duration: {s.duration}</p>}
              {s.staff && <p>Staff: {s.staff}</p>}
              {s.extras && <p>Extras: {s.extras.join(", ")}</p>}
              <p>Price: ₹{s.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
