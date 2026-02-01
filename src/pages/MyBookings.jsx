import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../components/supabaseClient";
import "./MyBookings.css";

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");

  /* ================= FETCH BOOKINGS ================= */

  const fetchMyBookings = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not logged in");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error.message);
      setBookings([]);
    } else {
      setBookings(data || []);
    }

    setLoading(false);
  };

  /* ================= LOAD ================= */

  useEffect(() => {
    fetchMyBookings();
  }, []);

  /* ================= FILTERS ================= */

  const currentBookings = useMemo(
    () => bookings.filter((b) => b.payment_status !== "completed"),
    [bookings]
  );

  const completedBookings = useMemo(
    () => bookings.filter((b) => b.payment_status === "completed"),
    [bookings]
  );

  const visibleBookings =
    activeTab === "current" ? currentBookings : completedBookings;

  /* ================= UI ================= */

  if (loading) {
    return <p className="loading">Loading bookings...</p>;
  }

  return (
    <div className="my-bookings-container">
      <h2 className="title">My Bookings</h2>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "current" ? "active" : ""}
          onClick={() => setActiveTab("current")}
        >
          Current Bookings ({currentBookings.length})
        </button>

        <button
          className={activeTab === "completed" ? "active" : ""}
          onClick={() => setActiveTab("completed")}
        >
          Completed Bookings ({completedBookings.length})
        </button>
      </div>

      {/* LIST */}
      {visibleBookings.length === 0 ? (
        <p className="empty">
          {activeTab === "current"
            ? "No current bookings"
            : "No completed bookings"}
        </p>
      ) : (
        visibleBookings.map((b) => (
          <div key={b.id} className="card">
            <div className="card-header">
              <h3 className="name">{b.customer_name}</h3>

              <span
                className={`status ${
                  b.payment_status === "completed"
                    ? "completed"
                    : "pending"
                }`}
              >
                {b.payment_status?.toUpperCase()}
              </span>
            </div>

            <p className="meta">
              {b.booking_date} at {b.booking_time}
            </p>

            <p className="meta">Total: ₹{b.total_amount}</p>

            {/* VIEW BUTTON */}
            <button
              className="view-btn"
              onClick={() => navigate(`/booking-details/${b.id}`)}
            >
              View
            </button>
          </div>
        ))
      )}
    </div>
  );
}
