import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/NavbarComponent.css";

const NavbarComponent = ({ token, userName }) => {
  return (
    <nav className="navbar">
      {/* Logo or Title */}
      <Link to="/" className="navbar__link">
        {/* Logo Image */}
        <img 
          src="/safecity_logo.png" 
          alt="SafeCity Logo" 
          className="navbar__logo" 
        />
        <h1 className="navbar__title">SafeCity</h1>
      </Link>

      {/* User Greeting + Button */}
      <div className="navbar__user-container">
        {/* Greeting Box */}
        {token && (
          <span className="navbar__greeting">
            Hello, <strong>{userName}</strong>!
          </span>
        )}

        {/* Register Button */}
        {!token && (
          <button
            className="navbar__button navbar__register-btn"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            Register
          </button>
        )}

        {/* Login/Logout Button */}
        <button
          className={`navbar__button navbar__login-logout-btn ${token ? "logout" : ""}`}
          onClick={() => {
            if (token) {
              localStorage.removeItem("token");
              window.location.reload();
            } else {
              window.location.href = "/login";
            }
          }}
        >
          {token ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
};

export default NavbarComponent;
