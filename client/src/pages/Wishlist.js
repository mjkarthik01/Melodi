import React from "react";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/UI/ProductCard";
import EmptyState from "../components/UI/EmptyState";
import SectionHeader from "../components/UI/SectionHeader";
import { useWishlist } from "../context/wishlist";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const Wishlist = () => {
  const [wishlist, setWishlist] = useWishlist();
  const [cart, setCart] = useCart();

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item._id === product._id);
    const updated = exists
      ? wishlist.filter((item) => item._id !== product._id)
      : [...wishlist, { ...product, quantity: 1 }];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
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

  return (
    <Layout title="Your Wishlist">
      <section className="container section">
        <SectionHeader title="Your Wishlist" subtitle="Saved for later" />
        {wishlist.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Browse products and save your favorites here."
            cta="Browse categories"
            to="/categories"
          />
        ) : (
          <div className="product-grid">
            {wishlist.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
                onWishlist={toggleWishlist}
                isWishlisted={true}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Wishlist;
