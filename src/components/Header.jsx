import React, { useState } from "react";
import { FiUser, FiX, FiSearch, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useCart } from "../context/Context";
import "./Header.css";

export default function Header({ searchText, setSearchText }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { cartItems } = useCart();

  const handleProfile = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-top">
        {/* LEFT GROUP */}
        <div className="header-left">
          <img
            src="/logo.png"
            alt="Neatify"
            className="logo"
            onClick={() => navigate("/")}
          />

          <div className="nav-links">
            <span onClick={() => navigate("/")}>Home</span>
            <span onClick={() => navigate("/services")}>Services</span>
            <span>Contact</span>
          </div>
        </div>

        {/* RIGHT GROUP */}
        <div className="header-icons">
          {/* SEARCH BAR */}
          <div className="search-wrapper right-search">
            <div className="search-icon">
              <FiSearch size={16} />
            </div>

            <input
              type="text"
              placeholder="Search for services"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {searchText && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setSearchText("")}
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* ✅ CART — CLICKABLE FIX */}
          <div
            className="cart-wrapper"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/cart")}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate("/cart");
            }}
            style={{ cursor: "pointer" }}
          >
            <FiShoppingCart size={22} />

            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </div>

          {/* USER MENU */}
          <div className="user-menu">
            <div
              className="user-circle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FiUser size={18} />
            </div>

            {dropdownOpen && (
              <div className="dropdown">
                <p onClick={handleProfile}>Profile</p>
                <p onClick={handleLogout}>Logout</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
