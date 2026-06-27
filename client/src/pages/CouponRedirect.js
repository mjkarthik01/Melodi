import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CouponRedirect = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      localStorage.setItem("coupon", code);
      navigate("/cart", { replace: true });
    }
  }, [code, navigate]);

  return <h3>Applying coupon...</h3>;
};

export default CouponRedirect;
