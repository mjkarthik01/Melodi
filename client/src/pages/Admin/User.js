import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";

const User = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>All User</h1>
        </div>
      </div>
    </div>
  );
};

export default User;
