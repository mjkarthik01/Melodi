import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import toast from "react-hot-toast";
import SectionHeader from "../components/UI/SectionHeader";
import ProductCard from "../components/UI/ProductCard";
import EmptyState from "../components/UI/EmptyState";
import Loader from "../components/UI/Loader";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) getProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`,
      );
      setProduct(data?.product);
      if (data?.product?._id && data?.product?.category?._id) {
        getSimilarProduct(data.product._id, data.product.category._id);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`,
      );
      setRelatedProducts(data?.products || []);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = () => {
    if (!product) return;
    const item = { ...product, quantity };
    const existing = cart.find((cartItem) => cartItem._id === product._id);
    const updatedCart = existing
      ? cart.map((cartItem) =>
          cartItem._id === product._id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        )
      : [...cart, item];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Product added to cart");
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item._id === product._id);
    const updated = exists
      ? wishlist.filter((item) => item._id !== product._id)
      : [...wishlist, { ...product, quantity: 1 }];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const isWishlisted = (product) =>
    wishlist.some((item) => item._id === product._id);

  if (loading || !product) {
    return (
      <Layout>
        <div className="container section">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${product.name} — Melodi`}>
      <section className="container product-detail section">
        <div className="product-detail__grid">
          <div className="product-detail__visual">
            <img
              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
              className="product-detail__image"
            />
          </div>
          <div className="product-detail__info">
            <p className="eyebrow">New arrival</p>
            <h1>{product.name}</h1>
            <p className="product-detail__tagline">
              Premium quality in every stitch, perfect for daily use.
            </p>
            <div className="product-detail__pricing">
              <span className="product-detail__price">${product.price}</span>
              <span className="product-detail__status">
                {product.shipping ? "Fast shipping" : "Standard shipping"}
              </span>
            </div>
            <div className="product-detail__specs">
              <p>{product.description}</p>
              <p>
                <strong>Category:</strong> {product.category?.name}
              </p>
            </div>
            <div className="product-detail__controls">
              <div className="quantity-control">
                <button
                  className="btn btn-light"
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={() => setQuantity((qty) => qty + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-primary"
                type="button"
                onClick={addToCart}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <SectionHeader title="You may also like" subtitle="Related products" />
        {relatedProducts.length === 0 ? (
          <EmptyState
            title="No related products"
            description="Explore other items in this category."
            cta="Browse categories"
            to="/categories"
          />
        ) : (
          <div className="product-grid">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={(item) => {
                  const updated = [...cart, { ...item, quantity: 1 }];
                  setCart(updated);
                  localStorage.setItem("cart", JSON.stringify(updated));
                  toast.success("Added best match to cart");
                }}
                onWishlist={toggleWishlist}
                isWishlisted={isWishlisted(product)}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default ProductDetails;
