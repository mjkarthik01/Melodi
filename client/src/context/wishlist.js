import { useState, useContext, createContext, useEffect } from "react";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedList = localStorage.getItem("wishlist");
    if (storedList) {
      setWishlist(JSON.parse(storedList));
    }
  }, []);

  return (
    <WishlistContext.Provider value={[wishlist, setWishlist]}>
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlist = () => useContext(WishlistContext);

export { WishlistProvider, useWishlist };
