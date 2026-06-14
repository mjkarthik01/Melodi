import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <>
      <div className="text-center mb-3">
        <div className="list-group">
          <h4>{/* <i className="bi bi-person-circle" /> Dashboard */}</h4>
          <NavLink
            to="/dashboard/user/profile"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-person-fill" />
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-bag-check-fill" />
            <span>Orders</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
