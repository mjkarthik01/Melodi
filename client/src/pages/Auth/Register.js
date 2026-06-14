import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { name, email, password, phone, address, answer },
      );
      if (res.data.success) {
        toast.success(res.data.message);

        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="form-group mb-3">
            <h3 className="text-center mb-4">Register Page</h3>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              id="exampleInputName1"
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              className="form-control"
              id="exampleInputPhone1"
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              className="form-control"
              id="exampleInputAddress1"
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              placeholder="Enter secret key"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              type="text"
              className="form-control"
              id="exampleInputAddress1"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-icon">
            <i className="bi bi-person-plus-fill" />
            <span>Register</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
