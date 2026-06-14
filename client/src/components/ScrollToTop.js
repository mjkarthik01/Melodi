import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("before", window.scrollY);

    window.scrollTo(0, 0);

    setTimeout(() => {
      console.log("after", window.scrollY);
    }, 100);
  }, [pathname]);
}

export default ScrollToTop;
