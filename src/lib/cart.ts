// Cart management using localStorage
// Key: bobcat_cart

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  ghlProductId?: string;
  ghlPriceId?: string;
}

export interface Cart {
  items: CartItem[];
  updatedAt: number;
}

const CART_KEY = 'bobcat_cart';

// Create unique cart item key from productId and optional ghlPriceId
function getCartItemKey(productId: string, ghlPriceId?: string): string {
  return ghlPriceId ? `${productId}:${ghlPriceId}` : productId;
}

export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], updatedAt: Date.now() };
  }

  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading cart:', e);
  }

  return { items: [], updatedAt: Date.now() };
}

function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return;

  try {
    cart.updatedAt = Date.now();
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1): Cart {
  const cart = getCart();
  // Match by productId AND ghlPriceId (for variants)
  const existingIndex = cart.items.findIndex(i =>
    i.productId === item.productId &&
    (i.ghlPriceId || '') === (item.ghlPriceId || '')
  );

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({ ...item, quantity });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string, ghlPriceId?: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter(item =>
    !(item.productId === productId && (item.ghlPriceId || '') === (ghlPriceId || ''))
  );
  saveCart(cart);
  return cart;
}

export function updateQuantity(productId: string, quantity: number, ghlPriceId?: string): Cart {
  const cart = getCart();

  if (quantity <= 0) {
    return removeFromCart(productId, ghlPriceId);
  }

  const item = cart.items.find(i =>
    i.productId === productId && (i.ghlPriceId || '') === (ghlPriceId || '')
  );
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }

  return cart;
}

export function clearCart(): Cart {
  const cart = { items: [], updatedAt: Date.now() };
  saveCart(cart);
  return cart;
}

export function getCartTotal(cart: Cart): number {
  return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getCartItemCount(cart: Cart): number {
  return cart.items.reduce((count, item) => count + item.quantity, 0);
}
