import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/UI/ProductCard";
import EmptyState from "../components/UI/EmptyState";
import SectionHeader from "../components/UI/SectionHeader";
import Loader from "../components/UI/Loader";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import toast from "react-hot-toast";

const CategoryProduct = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();

  const getProductsByCat = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}?page=1&limit=12`,
      );
      setProducts(data?.products || []);
      setCategory(data?.category || null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const addToCart = (product) => {
    const item = { ...product, quantity: 1 };
    const existing = cart.find((cartItem) => cartItem._id === product._id);
    const updatedCart = existing
      ? cart.map((cartItem) =>
          cartItem._id === product._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      : [...cart, item];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Added to cart");
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item._id === product._id);
    const updated = exists
      ? wishlist.filter((item) => item._id !== product._id)
      : [...wishlist, { ...product, quantity: 1 }];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
  };

  const isWishlisted = (product) =>
    wishlist.some((item) => item._id === product._id);

  useEffect(() => {
    if (params?.slug) getProductsByCat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);

  return (
    <Layout title={category?.name ? `${category.name} - Melodi` : "Category"}>
      <section className="container section">
        <SectionHeader
          title={category?.name || "Category Products"}
          subtitle="Category collection"
          children={
            <span className="section-header__meta">
              {products?.length} items
            </span>
          }
        />

        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products in this category"
            description="Browse other categories or search for something else."
            cta="Browse categories"
            to="/categories"
          />
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
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

export default CategoryProduct;
