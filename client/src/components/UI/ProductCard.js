import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onAddToCart, onWishlist, isWishlisted }) => {
  const navigate = useNavigate();

  return (
    <article className="product-card">
      <div className="product-card__media">
        <img
          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
          alt={product.name}
          className="product-card__image"
        />
        <button
          type="button"
          className={`product-card__wishlist ${isWishlisted ? "is-active" : ""}`}
          onClick={() => onWishlist && onWishlist(product)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
        {product.discount && (
          <span className="product-card__badge">-{product.discount}%</span>
        )}
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category?.name}</p>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__excerpt">
          {product.description?.substring(0, 90)}
        </p>
        <div className="product-card__meta">
          <span className="product-card__price">${product.price}</span>
          <span className="product-card__rating">4.8 ★</span>
        </div>
        <div className="product-card__actions">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => navigate(`/product/${product.slug}`)}
          >
            View
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
