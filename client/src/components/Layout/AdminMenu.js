import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <>
      <div className="text-center mb-5">
        <div className="list-group">
          <h4>
            <i className="bi bi-sliders2-vertical" /> Admin Panel
          </h4>
          <NavLink
            to="/dashboard/admin/create-category"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-tag-fill" />
            <span>Create Category</span>
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-box-seam-fill" />
            <span>Create Product</span>
          </NavLink>
          <NavLink
            to="/dashboard/admin/products"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-collection-fill" />
            <span>Products</span>
          </NavLink>
          <NavLink
            to="/dashboard/admin/orders"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-receipt" />
            <span>Orders</span>
          </NavLink>
          <NavLink
            to="/dashboard/admin/user"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-person-fill" />
            <span>Users</span>
          </NavLink>
          <NavLink
            to="/dashboard/admin/accounts"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-bank" />
            <span>Account</span>
          </NavLink>
          <NavLink
            to="/dashboard/admin/coupon"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${isActive ? "active" : ""}`
            }
          >
            <i className="bi bi-ticket-perforated-fill" />
            <span>Coupons</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
