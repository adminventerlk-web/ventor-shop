'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AddToCartModal, { IAddedItemNotification } from '@/components/cart/AddToCartModal';
import { fallbackProducts } from '@/lib/data/fallbackData';

export interface ICartItem {
  productId: string;
  quantity: number;
  variantName?: string;
  selectedPrice?: number;
}

interface CartContextType {
  cart: ICartItem[];
  cartCount: number;
  addToCart: (
    productId: string,
    quantity?: number,
    variantName?: string,
    selectedPrice?: number,
    meta?: { name?: string; image?: string; price?: number }
  ) => void;
  updateQuantity: (productId: string, quantity: number, variantName?: string) => void;
  removeFromCart: (productId: string, variantName?: string) => void;
  clearCart: () => void;
  appliedVoucherCode: string | null;
  setAppliedVoucherCode: (code: string | null) => void;
  addedItemNotification: IAddedItemNotification | null;
  closeNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('venterprise_cart') || localStorage.getItem('ventershop_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      const storedVoucher = localStorage.getItem('venterprise_voucher') || localStorage.getItem('ventershop_voucher');
      if (storedVoucher) {
        setAppliedVoucherCode(storedVoucher);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // 2. Persist cart to localStorage on state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('venterprise_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart, isLoaded]);

  // 3. Persist voucher code
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (appliedVoucherCode) {
        localStorage.setItem('venterprise_voucher', appliedVoucherCode);
      } else {
        localStorage.removeItem('venterprise_voucher');
        localStorage.removeItem('ventershop_voucher');
      }
    } catch (e) {
      console.error('Failed to save voucher to localStorage:', e);
    }
  }, [appliedVoucherCode, isLoaded]);

  const [addedItemNotification, setAddedItemNotification] = useState<IAddedItemNotification | null>(null);

  const closeNotification = useCallback(() => {
    setAddedItemNotification(null);
  }, []);

  const addToCart = useCallback(
    (
      productId: string,
      quantity = 1,
      variantName?: string,
      selectedPrice?: number,
      meta?: { name?: string; image?: string; price?: number }
    ) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.productId === productId && (item.variantName || '') === (variantName || '')
        );
        if (existingItem) {
          return prevCart.map((item) =>
            item.productId === productId && (item.variantName || '') === (variantName || '')
              ? { ...item, quantity: item.quantity + quantity, selectedPrice: selectedPrice || item.selectedPrice }
              : item
          );
        }
        return [...prevCart, { productId, quantity, variantName, selectedPrice }];
      });

      // Trigger Add to Cart Pop-up Modal
      let name = meta?.name;
      let image = meta?.image;
      let price = selectedPrice || meta?.price;

      if (!name || !image) {
        const found = fallbackProducts.find((p) => p._id === productId || p.slug === productId);
        if (found) {
          if (!name) name = found.name;
          if (!image) image = found.images?.[0];
          if (!price) price = found.retailPrice;
        }
      }

      setAddedItemNotification({
        productId,
        quantity,
        variantName,
        selectedPrice: price,
        productName: name || 'Product Item',
        productImage: image,
      });
    },
    []
  );

  const updateQuantity = useCallback((productId: string, quantity: number, variantName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantName);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId && (item.variantName || '') === (variantName || '')
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: string, variantName?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.productId === productId && (variantName === undefined || (item.variantName || '') === (variantName || '')))
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedVoucherCode(null);
  }, []);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedVoucherCode,
        setAppliedVoucherCode,
        addedItemNotification,
        closeNotification,
      }}
    >
      {children}
      <AddToCartModal
        item={addedItemNotification}
        onClose={closeNotification}
        cartCount={cartCount}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
