import React from "react";
import { useAuth } from "../../context/auth";
import UserMenu from "../../components/Layout/UserMenu";

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <div className="container-fluid p-3">
      <div className="row">
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9 justify-content-center align-items-center d-flex">
          <div className="card w-75 p-5">
            <h3>{auth?.user?.name}</h3>
            <h3>{auth?.user?.email}</h3>
            <h3>{auth?.user?.address}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
