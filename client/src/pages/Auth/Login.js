import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        {
          email,
          password,
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("otpEmail", email);
        navigate("/verify-otp", {
          state: { email },
        });

        return;
      }

      toast.error(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <div>
          <div className="form-group mb-3">
            <h3 className="text-center mb-3">Login Page</h3>
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
          <button type="submit" className="btn btn-primary btn-icon">
            <i className="bi bi-box-arrow-in-right" />
            <span>Login</span>
          </button>
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-outline-btn-outline-light btn-icon"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              <i className="bi bi-key-fill" />
              <span>Forgot Password</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
