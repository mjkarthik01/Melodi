import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid container">
        <div className="site-footer__section">
          <Link to="/" className="site-footer__brand">
            Melodi
          </Link>
          <p>
            Modern bags, curated for everyday luxury. Fast delivery and easy
            returns.
          </p>
        </div>
        <div className="site-footer__section">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/search">Search</Link>
        </div>
        <div className="site-footer__section">
          <h4>Support</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/policy">Privacy Policy</Link>
        </div>
        <div className="site-footer__section">
          <h4>Stay updated</h4>
          <p>Subscribe for new arrivals and exclusive offers.</p>
          <form className="site-footer__newsletter">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Subscribe email"
            />
            <button type="button" className="btn btn-primary btn-icon">
              <i className="bi bi-send-fill" />
              <span>Subscribe</span>
            </button>
          </form>
        </div>
      </div>
      <div className="site-footer__bottom container">
        <p>© 2026 Melodi. Crafted for premium ecommerce.</p>
      </div>
    </footer>
  );
};

export default Footer;
