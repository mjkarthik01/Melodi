import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "antd";

const getPadding = (width) => {
  if (width < 480) return "50px";
  if (width < 768) return "65px";
  if (width < 1200) return "80px";
  return "120px";
};

const AdSlider = () => {
  const [centerPadding, setCenterPadding] = useState("120px");

  const [uploadedBanners, setUploadedBanners] = useState([]);

  const defaultImages = [
    "/SwiperSlide1.png",
    "/SwiperSlide2.png",
    "/SwiperSlide3.png",
    "/SwiperSlide4.png",
  ];

  const getBanners = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/banner/banners`,
      );

      if (data?.success) {
        const activeBanners = data.banners
          .filter((banner) => banner.isActive)
          .map((banner) => `${process.env.REACT_APP_API}${banner.image}`);

        setUploadedBanners(activeBanners);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBanners();

    const handleResize = () => {
      setCenterPadding(getPadding(window.innerWidth));
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allImages = [
    ...uploadedBanners,
    ...defaultImages.slice(uploadedBanners.length),
  ];

  return (
    <div className="carousel-wrap">
      <Carousel
        arrows
        autoplay
        autoplaySpeed={3000}
        infinite
        dots
        centerMode
        centerPadding={centerPadding}
        className="custom-carousel"
      >
        {allImages.map((image, index) => (
          <div key={index}>
            <div className="slide">
              <img src={image} alt={`Banner-${index}`} />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default AdSlider;
