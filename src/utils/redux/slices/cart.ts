// src/store/cartSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../../types';

interface CartState {
  cart: Product[];
  totalItems: number;      // Number of unique products
  totalQuantity: number;  // Sum of all quantities
  subtotal: number;       // Total before discounts
  total: number;          // Final total (after discounts)
  discount: number;       // Current discount amount
}

const loadCartFromLocalStorage = (): Product[] => {
  try {
    const cartData = localStorage.getItem('cart');
    if (!cartData) return [];
    
    const parsedCart: unknown = JSON.parse(cartData);
    if (!Array.isArray(parsedCart)) {
      throw new Error('Invalid cart format');
    }
    return parsedCart as Product[];
  } catch (e) {
    console.error('Error loading cart from localStorage:', e);
    return [];
  }
};

const calculateCartTotals = (cart: Product[], currentDiscount: number = 0): Omit<CartState, 'cart' | 'discount'> => {
  const totalItems = cart.length;
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const total = Math.max(0, subtotal - currentDiscount);
  
  return {
    totalItems,
    totalQuantity,
    subtotal,
    total
  };
};

const initialState: CartState = {
  cart: loadCartFromLocalStorage(),
  discount: 0,
  ...calculateCartTotals(loadCartFromLocalStorage(), 0)
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingProduct = state.cart.find(
        (item) => item.id === product.id && item.color === product.color && item.size === product.size && item.fit === product.fit
      );
      
      if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
      Object.assign(state, calculateCartTotals(state.cart, state.discount));
    },
    removeFromCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const index = state.cart.findIndex(
        (item) => item.id === product.id && item.color === product.color && item.size === product.size && item.fit === product.fit
      );
      
      if (index !== -1) {
        state.cart.splice(index, 1);
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
      Object.assign(state, calculateCartTotals(state.cart, state.discount));
    },
    increaseCount: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const index = state.cart.findIndex(
        (item) => item.id === product.id && item.color === product.color && item.size === product.size && item.fit === product.fit
      );
      
      if (index !== -1) {
        state.cart[index].quantity = (state.cart[index].quantity || 1) + 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
      Object.assign(state, calculateCartTotals(state.cart, state.discount));
    },
    decreaseCount: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const index = state.cart.findIndex(
        (item) => item.id === product.id && item.color === product.color && item.size === product.size && item.fit === product.fit
      );
      
      if (index !== -1) {
        if (state.cart[index].quantity > 1) {
          state.cart[index].quantity--;
        } else {
          state.cart.splice(index, 1);
        }
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
      Object.assign(state, calculateCartTotals(state.cart, state.discount));
    },
    updateProductAttributes: (
      state,
      action: PayloadAction<{
        product: Product;
        newColor: string;
        newSize: string;
        newCount: number;
      }>
    ) => {
      const { product, newColor, newSize, newCount } = action.payload;
      const currentProductIndex = state.cart.findIndex(
        (item) => item.id === product.id && item.color === product.color && item.size === product.size
      );

      const existingProductIndex = state.cart.findIndex(
        (item) => item.id === product.id && item.color === newColor && item.size === newSize
      );

      if (currentProductIndex !== -1) {
        if (newCount === 0) {
          state.cart.splice(currentProductIndex, 1);
        } else if (existingProductIndex !== -1 && existingProductIndex !== currentProductIndex) {
          state.cart[existingProductIndex].quantity += newCount;
          state.cart.splice(currentProductIndex, 1);
        } else {
          state.cart[currentProductIndex].color = newColor;
          state.cart[currentProductIndex].size = newSize;
          state.cart[currentProductIndex].quantity = newCount;
        }
      } else if (newCount > 0) {
        state.cart.push({ ...product, color: newColor, size: newSize, quantity: newCount });
      }

      localStorage.setItem('cart', JSON.stringify(state.cart));
      Object.assign(state, calculateCartTotals(state.cart, state.discount));
    },
    clearCart: (state) => {
      state.cart = [];
      state.discount = 0;
      localStorage.setItem('cart', JSON.stringify(state.cart));
      Object.assign(state, calculateCartTotals(state.cart, state.discount));
    },
    applyDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
      Object.assign(state, calculateCartTotals(state.cart, state.discount));
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeDiscount: (state) => {
      state.discount = 0;
      Object.assign(state, calculateCartTotals(state.cart, state.discount));
      localStorage.setItem('cart', JSON.stringify(state.cart));
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseCount,
  decreaseCount,
  updateProductAttributes,
  clearCart,
  applyDiscount,
  removeDiscount,
} = cartSlice.actions;

export default cartSlice.reducer;