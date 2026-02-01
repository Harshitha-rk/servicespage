import React from "react";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-left">
          <h2>
            Ready for a <br /> Cleaner Home?
          </h2>
          <p>
            Experience the difference with The Neatify Team.
            Professional, reliable, and strictly monochromatic.
          </p>
        </div>

        {/* CENTER */}
        <div className="footer-center">
          <h3>Contact Us</h3>

          <div className="contact-item">
            <FiPhone />
            <a href="https://wa.me/917617618567" target="_blank" rel="noreferrer">
              +91 7617618567
            </a>
          </div>

          <div className="contact-item">
            <FiMail />
            <a href="mailto:info@theneatifyteam.com">
              info@theneatifyteam.com
            </a>
          </div>

          <div className="contact-item">
            <FiMapPin />
            <span>Hyderabad, Telangana</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="footer-right">
          <div className="qr-box">
            <img src="/qr.png" alt="Scan to Book" />
            <p>Scan to Book <br /> on WhatsApp</p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <span>© 2026 The Neatify Team™</span>
        <span>Terms and conditions apply for all services.</span>
      </div>
    </footer>
  );

}
