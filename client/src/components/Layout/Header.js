import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useWishlist } from "../../context/wishlist";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [wishlist] = useWishlist();
  const categories = useCategory();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
  };

  return (
    <header className="site-header sticky-top">
      <div className="site-header__bar container">
        <Link to="/" className="site-header__brand">
          <img src="/ShopLogo.png" alt="Melodi Logo" className="brand-logo" />
          <span>Melodi</span>
        </Link>
        <div className="site-header__search-wrapper">
          <SearchInput />
        </div>
        <div className="site-header__actions">
          <Link to="/cart" className="site-header__cart">
            <Badge count={cart?.length} size="small">
              <span>Cart</span>
            </Badge>
          </Link>
          <button
            className="site-header__mobile-toggle"
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav
        className={`site-header__nav container ${menuOpen ? "is-open" : ""}`}
      >
        <NavLink to="/" className="site-header__link">
          Home
        </NavLink>
        <div className="site-header__dropdown">
          <button type="button" className="site-header__link">
            Categories
          </button>
          <div className="mega-menu">
            {categories?.slice(0, 8).map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="mega-menu__item"
              >
                {category.name}
              </Link>
            ))}
            <Link to="/categories" className="mega-menu__view-all">
              View all categories
            </Link>
          </div>
        </div>
        <NavLink to="/wishlist" className="site-header__link">
          Wishlist
          {wishlist?.length > 0 && (
            <sup className="site-header__badge">{wishlist.length}</sup>
          )}
        </NavLink>
        {!auth?.user ? (
          <>
            <NavLink to="/register" className="site-header__link">
              Register
            </NavLink>
            <NavLink to="/login" className="site-header__link">
              Login
            </NavLink>
          </>
        ) : (
          <div className="site-header__dropdown">
            <button type="button" className="site-header__link">
              {auth.user.name}
            </button>
            <div className="mega-menu mega-menu--user">
              <Link
                to={`/dashboard/${auth.user.role === 1 ? "admin" : "user"}`}
                className="mega-menu__item"
              >
                {auth.user.role === 1 ? "Admin Dashboard" : "My Dashboard"}
              </Link>
              <button
                type="button"
                className="mega-menu__item mega-menu__button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
