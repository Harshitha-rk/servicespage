import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../components/supabaseClient";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  /* ================= LOAD USER & PROFILE ================= */
  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        navigate("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");

      const { data } = await supabase
        .from("profile")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setPincode(data.pincode || "");
      }
    };

    loadData();
  }, [navigate]);

  /* ================= SAVE PROFILE ================= */
  const handleSaveProfile = async () => {
    if (!userId) return;

    const { error } = await supabase.from("profile").upsert({
      id: userId,
      full_name: fullName,
      email,
      phone,
      address,
      pincode,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile saved successfully");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>

        <input
          placeholder="Full Name"
          className="profile-input"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input className="profile-input" value={email} disabled />

        <input
          placeholder="Phone Number"
          className="profile-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Address"
          className="profile-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          placeholder="Pincode"
          className="profile-input"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />

        <button className="primary-btn" onClick={handleSaveProfile}>
          Save Profile
        </button>

        {/* ✅ FIXED BUTTON WRAPPER */}
        <div className="profile-actions">
          <button
            className="secondary-btn"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
