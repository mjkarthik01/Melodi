import React, { useEffect, useState } from "react";
import { Carousel } from "antd";

const getPadding = (width) => {
  if (width < 480) return "50px";
  if (width < 768) return "65px";
  if (width < 1200) return "80px";
  return "120px";
};

const AdSlider = () => {
  const [centerPadding, setCenterPadding] = useState("120px");

  useEffect(() => {
    const handleResize = () => {
      setCenterPadding(getPadding(window.innerWidth));
    };

    handleResize(); // set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="carousel-wrap">
      <Carousel
        arrows
        autoplay
        autoplaySpeed={2500}
        infinite
        dots
        centerMode
        centerPadding={centerPadding}
        className="custom-carousel"
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="slide">
              <img src={`./SwiperSlide${i}.png`} alt={`Banner${i}`} />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default AdSlider;
