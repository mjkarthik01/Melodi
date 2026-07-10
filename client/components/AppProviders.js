"use client";

import { AuthProvider } from "../src/context/auth";
import { SearchProvider } from "../src/context/search";
import { CartProvider } from "../src/context/cart";
import { WishlistProvider } from "../src/context/wishlist";
import { ChatProvider } from "../src/context/chat";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <WishlistProvider>
            <ChatProvider>{children}</ChatProvider>
          </WishlistProvider>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  );
}
