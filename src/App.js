import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from "./components/supabaseClient";

/* PAGES */
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Services from "./Services";
import Profile from "./pages/Profile";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Checkout from "./pages/Checkout";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import Cart from "./pages/Cart"; // ✅ ADDED

/* COMPONENTS */
import Footer from "./components/Footer";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/"
          element={user ? <Navigate to="/services" /> : <Login />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/services" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/services" /> : <Signup />}
        />

        {/* PROTECTED */}
        <Route
          path="/services"
          element={user ? <Services /> : <Navigate to="/login" />}
        />
        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/service/:id"
          element={user ? <ServiceDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/booking"
          element={user ? <Booking /> : <Navigate to="/login" />}
        />
        <Route
          path="/payment"
          element={user ? <Payment /> : <Navigate to="/login" />}
        />
        <Route
          path="/checkout"
          element={user ? <Checkout /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-bookings"
          element={user ? <MyBookings /> : <Navigate to="/login" />}
        />
        <Route
          path="/booking-details/:id"
          element={user ? <BookingDetails /> : <Navigate to="/login" />}
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </Router>
  );
}
