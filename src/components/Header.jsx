import React from "react";
import { FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import "./Header.css";

export default function Header({ searchText, setSearchText }) {
  return (
    <header className="header">
      {/* Top Row */}
      <div className="header-top">
        <h1 className="logo">NEATIFY</h1>

        <div className="header-icons">
          <FiShoppingCart size={22} />
          <FiUser size={22} />
        </div>
      </div>

      {/* Centered Search Bar */}
      <div className="header-search">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search services"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {searchText && (
            <button
              className="clear-btn"
              onClick={() => setSearchText("")}
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
