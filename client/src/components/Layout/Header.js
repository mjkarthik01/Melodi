import { Badge } from "antd";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useWishlist } from "../../context/wishlist";
import useCategory from "../../hooks/useCategory";
import SearchInput from "../Form/SearchInput";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const { cart } = useCart();
  const [wishlist] = useWishlist();
  const [categories] = useCategory();
  const [search, setSearch] = useState(false);

  const searchRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    const navbar = document.getElementById("mainNavbar");

    if (navbar?.classList.contains("show")) {
      const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navbar);
      bsCollapse.hide();
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <nav className="sticky-top navbar navbar-expand-lg navbar-light pt-4">
      <div className="container-fluid">
        <Link className="navbar-brand site-header__brand" to="/">
          <img src="/ShopLogo4.png" alt="Melodi Logo" className="brand-logo" />
          <span className="brand-text">Sweetie Ayman</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav gap-4 me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Home
              </NavLink>
            </li>

            {/* Categories Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                id="categoryDropdown"
                role="button"
                data-bs-toggle="dropdown"
                onClick={(e) => e.preventDefault()}
              >
                Categories
              </a>

              <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                {categories?.slice(0, 8).map((category) => (
                  <li key={category._id}>
                    <Link
                      className="dropdown-item"
                      to={`/category/${category.slug}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link className="dropdown-item fw-bold" to="/categories">
                    View All Categories
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Wishlist
              </NavLink>
            </li>

            {!auth?.user ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Register
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  onClick={(e) => e.preventDefault()}
                >
                  {auth.user.name}
                </a>

                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/dashboard/${
                        auth.user.role === 1 ? "admin" : "user"
                      }`}
                    >
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* Right Side Actions */}
          <div className="site-header__actions">
            <div onClick={() => setSearch(!search)}>
              <i className="bi bi-search fs-5 mb-2"></i>
            </div>
            <Link to="/wishlist">
              <Badge count={wishlist.length}>
                <i className="bi bi-heart fs-5"></i>
              </Badge>
            </Link>

            <Link to="/cart">
              <Badge count={cart?.length}>
                <i className="bi bi-cart3 fs-5"></i>
              </Badge>
            </Link>
          </div>
        </div>
      </div>
      {search && (
        <div ref={searchRef} className="search-overlay">
          <div className="container search-box">
            <SearchInput
              className="search-box_form"
              onClose={() => setSearch(false)}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
