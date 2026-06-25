import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CouponRedirect = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      localStorage.setItem("coupon", code);

      // force reload cart so discount recalculates properly
      navigate("/cart");
    }
  }, [code]);

  return <h3>Applying coupon...</h3>;
};

export default CouponRedirect;
