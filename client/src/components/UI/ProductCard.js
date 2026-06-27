import { useNavigate } from "react-router-dom";
import { Skeleton } from "antd";
import React, { useEffect, useState, useRef } from "react";

const ProductCard = ({
  product,
  onAddToCart,
  onWishlist,
  isWishlisted,
  loading = false,
}) => {
  const navigate = useNavigate();
  const colorSliderRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");

  const showSkeleton = loading || !imgLoaded;

  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const smoothScrollBy = (element, distance, duration = 3000) => {
    const start = element.scrollLeft;
    const startTime = performance.now();

    const easeInOutQuad = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = easeInOutQuad(progress);

      element.scrollLeft = start + distance * eased;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const scrollColors = (direction) => {
    const container = colorSliderRef.current;
    if (!container) return;

    const scrollAmount = 120;

    smoothScrollBy(
      container,
      direction === "next" ? scrollAmount : -scrollAmount,
      300, // duration (increase = slower, smoother)
    );
  };

  return (
    <article className="product-card">
      <div className="product-card__media">
        {showSkeleton && (
          <div>
            <Skeleton.Image
              active
              style={{ width: "365px", height: "260px" }}
            />
          </div>
        )}

        <img
          src={
            product?._id &&
            `${process.env.REACT_APP_API}/api/v1/product/product-photo/${product?._id}`
          }
          alt={product?.name}
          className={`product-card__image ${imgVisible ? "is-visible" : ""}`}
          style={{
            display: showSkeleton ? "none" : "block",
          }}
          onLoad={() => {
            setImgLoaded(true);
            setImgVisible(true);
          }}
          onError={(e) => {
            e.target.src = "/placeholder.png";
            setImgLoaded(true);
            setImgVisible(true);
          }}
        />

        {!showSkeleton && (
          <>
            {onWishlist && (
              <button
                type="button"
                className={`product-card__wishlist ${
                  isWishlisted ? "is-active" : ""
                }`}
                onClick={() => onWishlist && onWishlist(product)}
              >
                <i className={`bi bi-heart${isWishlisted ? "-fill" : ""}`} />
              </button>
            )}

            {product?.discount > 0 && (
              <span className="product-card__badge">
                {product.discount}% offer
              </span>
            )}
          </>
        )}
      </div>

      {/* BODY */}
      <div className="product-card__body">
        {loading ? (
          <>
            <Skeleton.Input active size="small" style={{ width: 80 }} />
            <Skeleton.Input active style={{ width: "90%" }} />
            <Skeleton active paragraph={{ rows: 2 }} title={false} />
          </>
        ) : (
          <>
            {/* <p className="product-card__category">{product?.category?.name}</p> */}

            <h3 className="product-card__title">{product?.name}</h3>

            <p className="product-card__excerpt">
              {product?.description?.substring(0, 90)}
            </p>

            <div className="product-card__meta">
              <span className="product-card__price">
                &#8377; {product?.price}
                <span className="text-decoration-line-through text-muted mx-2 fs-6">
                  &#8377;{" "}
                  {Math.round(
                    product?.price + (product?.price * product.discount) / 100,
                  )}
                </span>
              </span>
              <span className="product-card__rating">4.8 ★</span>
            </div>

            <div className="mb-3">
              <strong className="text-muted">Select Color</strong>

              <div className="d-flex align-items-center mt-2">
                {/* Prev button */}
                <button
                  type="button"
                  className="btn btn-light btn--small"
                  onClick={() => scrollColors("prev")}
                >
                  ‹
                </button>

                {/* Scroll container */}
                <div
                  ref={colorSliderRef}
                  style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    padding: "5px",
                    maxWidth: "225px",
                    scrollbarWidth: "none",
                  }}
                  className="color-scroll"
                >
                  {product?.colors?.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Select ${color}`}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        minWidth: 35,
                        height: 35,
                        borderRadius: "50%",
                        background: color,
                        cursor: "pointer",
                        flex: "0 0 auto",
                        boxShadow:
                          selectedColor === color
                            ? "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
                            : "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px ",
                        border:
                          selectedColor === color ? "0.5px solid gray" : "none",
                        opacity: selectedColor === color ? 1 : 0.8,
                      }}
                    />
                  ))}
                </div>

                {/* Next button */}
                <button
                  type="button"
                  className="btn btn-light btn--small"
                  onClick={() => scrollColors("next")}
                >
                  ›
                </button>
              </div>
            </div>

            {onAddToCart && (
              <div className="product-card__actions">
                <button
                  className="btn btn-outline-primary btn-icon"
                  onClick={() => navigate(`/product/${product.slug}`)}
                >
                  <i className="bi bi-eye-fill" />
                  <span>View</span>
                </button>

                <button
                  className="btn btn-primary btn-icon"
                  onClick={() => onAddToCart?.(product, selectedColor)}
                >
                  <i className="bi bi-cart-plus-fill" />
                  <span>Add</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
