import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setAuth] = useAuth();

  const email = location.state?.email || localStorage.getItem("otpEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const inputs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const verifyOTP = async (code) => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/verify-otp`,
        {
          email,
          otp: code,
        },
      );

      if (res.data.success) {
        setAuth((prev) => ({
          ...prev,
          user: res.data.user,
          token: res.data.token,
          initialized: true,
        }));
        localStorage.setItem("auth", JSON.stringify(res.data));
        localStorage.removeItem("otpEmail");

        toast.success("Login Successful");

        navigate("/");
      } else {
        toast.error(res.data.message);
        setOtp(["", "", "", "", "", ""]);
        inputs.current[0].focus();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");

      setOtp(["", "", "", "", "", ""]);
      inputs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

    const code = newOtp.join("");

    if (code.length === 6 && !newOtp.includes("")) {
      verifyOTP(code);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const arr = pasted.split("");

    while (arr.length < 6) arr.push("");

    setOtp(arr);

    arr.forEach((digit, i) => {
      if (inputs.current[i]) {
        inputs.current[i].value = digit;
      }
    });

    if (pasted.length === 6) {
      verifyOTP(pasted);
    }
  };

  const resendOTP = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/resend-otp`,
        {
          email,
        },
      );

      if (res.data.success) {
        toast.success("OTP Sent Again");

        setTimer(60);

        setOtp(["", "", "", "", "", ""]);

        inputs.current[0].focus();
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Unable to resend OTP");
    }
  };

  return (
    <div className="verify-container">
      <div className="otp-card">
        <h2>Verify Email</h2>

        <p>Enter the 6-digit code sent to</p>

        <strong>{email}</strong>

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {loading && <p>Verifying...</p>}

        {timer > 0 ? (
          <p className="countdown">Resend OTP in {timer}s</p>
        ) : (
          <button className="btn btn-outline-primary" onClick={resendOTP}>
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;
