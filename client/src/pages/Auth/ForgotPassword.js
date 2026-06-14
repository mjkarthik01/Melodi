import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
        { email, newPassword, answer },
      );
      if (res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data && res.data.message);
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };
  return (
    <div className="login">
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
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
              placeholder="Enter the secret key"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-icon">
            <i className="bi bi-arrow-clockwise" />
            <span>Reset Password</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
