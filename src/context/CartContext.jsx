import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  /* ✅ Add to cart */
  const addToCart = (service) => {
    setCartItems((prev) => {
      if (prev.find((item) => item.id === service.id)) return prev;
      return [...prev, service];
    });
  };

  /* ✅ Remove from cart */
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  /* ✅ Clear cart */
  const clearCart = () => {
    setCartItems([]);
  };

  /* ✅ Check if already in cart */
  const isInCart = (id) => {
    return cartItems.some((item) => item.id === id);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        loadingCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ✅ Custom hook */
export function useCart() {
  return useContext(CartContext);
}
