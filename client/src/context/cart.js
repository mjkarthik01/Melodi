import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const existingCart = localStorage.getItem("cart");
    if (existingCart) {
      setCart(JSON.parse(existingCart));
    }
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateProductColor = (productId, color) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, selectedColor: color } : item,
    );

    saveCart(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart: saveCart,
        updateProductColor,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
