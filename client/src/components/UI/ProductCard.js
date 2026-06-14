import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "antd";

const ProductCard = ({
  product,
  onAddToCart,
  onWishlist,
  isWishlisted,
  loading = false,
}) => {
  const navigate = useNavigate();

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");

  const showSkeleton = loading || !imgLoaded;

  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

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
              </span>
              <span className="product-card__rating">4.8 ★</span>
            </div>

            <div className="mb-3">
              <strong className="text-muted">Select Color</strong>

              <div className="d-flex gap-2 mt-2">
                {product?.colors?.map((color) => (
                  <button
                    type="button"
                    aria-label={`Select ${color}`}
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      background: color,
                      cursor: "pointer",
                      boxShadow:
                        selectedColor === color
                          ? "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
                          : "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px ",
                      border:
                        selectedColor === color ? `0.5px solid gray` : "none",
                      opacity: selectedColor === color ? 1 : 0.8,
                    }}
                  />
                ))}
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
