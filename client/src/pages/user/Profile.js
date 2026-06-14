import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { Card, Col, Row } from "antd";
const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (auth?.user) {
      const { email, name, phone, address } = auth.user;

      setName(name || "");
      setPhone(phone || "");
      setEmail(email || "");
      setAddress(address || "");
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/profile`,
        {
          name,
          email,
          password,
          phone,
          address,
        },
      );
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="container-fluid p-3 dashboard">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <UserMenu />
        </Col>
        <Col xs={24} md={18} className="dashboard-content">
          <Card
            title="👤 User Profile"
            variant="borderless"
            className="dashboard-cards"
          >
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Change Name"
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Change Email "
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Change Password"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Change Phone"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Change Address"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-icon">
                  <i className="bi bi-pencil-square" />
                  <span>Update Profile</span>
                </button>
              </form>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
