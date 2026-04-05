// src/pages/Cart.tsx
// Enhanced Cart Component with modern design, animations, and wishlist support

import React, { useState, useCallback, memo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { X, ArrowLeft, Truck, Heart, Minus, Plus, Sparkles, ShoppingBag, Shield, CreditCard } from 'lucide-react';
import type { CartItem } from '../types/index';

// Heart Icon Component with animation states
const HeartIcon = memo(({
  isActive,
  onClick
}: {
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    className={`
      absolute -top-3 -right-3 z-20 p-2 rounded-full
      transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
      ${isActive
        ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50 scale-110'
        : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 shadow-md hover:shadow-lg'
      }
      hover:scale-125 active:scale-95
    `}
    aria-label={isActive ? 'Remove from wishlist' : 'Add to wishlist'}
    aria-pressed={isActive}
  >
    <Heart
      className={`w-4 h-4 transition-all duration-300 ${isActive ? 'fill-current scale-110' : ''}`}
    />
  </button>
));

// Remove Button Component
const RemoveButton = memo(({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="
      absolute -top-2 -right-2 z-20 p-2 rounded-full
      bg-gradient-to-br from-red-500 to-rose-600 text-white
      opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
      transition-all duration-300 ease-out
      hover:scale-110 hover:shadow-lg hover:shadow-red-500/40
      focus:opacity-100 focus:translate-x-0
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
      active:scale-95
    "
    aria-label="Remove from cart"
  >
    <X className="w-4 h-4" />
  </button>
));

// Quantity Controls Component
const QuantityControls = memo(({
  quantity,
  onIncrease,
  onDecrease
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void
}) => (
  <div className="flex items-center gap-1 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-full p-1">
    <button
      onClick={onDecrease}
      disabled={quantity <= 1}
      className="
        w-8 h-8 rounded-full flex items-center justify-center
        bg-white dark:bg-gray-700 shadow-sm
        hover:bg-gradient-to-br hover:from-red-500 hover:to-rose-600 hover:text-white hover:shadow-md
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-inherit disabled:hover:shadow-sm
        transition-all duration-200 active:scale-90
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
      "
      aria-label="Decrease quantity"
    >
      <Minus className="w-3 h-3" />
    </button>
    <span className="w-10 text-center font-bold text-sm tabular-nums">
      {quantity}
    </span>
    <button
      onClick={onIncrease}
      className="
        w-8 h-8 rounded-full flex items-center justify-center
        bg-white dark:bg-gray-700 shadow-sm
        hover:bg-gradient-to-br hover:from-emerald-500 hover:to-green-600 hover:text-white hover:shadow-md
        transition-all duration-200 active:scale-90
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1
      "
      aria-label="Increase quantity"
    >
      <Plus className="w-3 h-3" />
    </button>
  </div>
));

// Cart Item Component
const CartItemCard = memo(({ item }: { item: CartItem }) => {
  const { removeFromCart, updateCartQuantity, toggleWishlist, state } = useAppContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const isInWishlist = state.wishlist.includes(item.id);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => removeFromCart(item.id), 300);
  }, [item.id, removeFromCart]);

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item.id);
  }, [item.id, toggleWishlist]);

  const handleDecrease = useCallback(() => {
    updateCartQuantity(item.id, item.quantity - 1);
  }, [item.id, item.quantity, updateCartQuantity]);

  const handleIncrease = useCallback(() => {
    updateCartQuantity(item.id, item.quantity + 1);
  }, [item.id, item.quantity, updateCartQuantity]);

  const itemTotal = item.price * item.quantity;

  return (
    <div
      className={`
        card group relative overflow-hidden
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-gray-900/50
        ${isRemoving ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 translate-x-0'}
      `}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-primary-500/5 group-hover:via-transparent group-hover:to-transparent pointer-events-none transition-all duration-500" />

      <div className="relative flex items-center p-4 sm:p-6">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
            )}
            <img
              src={item.thumbnail}
              alt={item.title}
              className={`
                w-full h-full object-cover transition-all duration-500
                ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                group-hover:scale-110
              `}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>

          {/* Wishlist Button */}
          <HeartIcon
            isActive={isInWishlist}
            onClick={handleWishlistToggle}
          />

          {/* Remove Button */}
          <RemoveButton onClick={handleRemove} />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 ml-3 sm:ml-5">
          <Link
            to={`/product/${item.id}`}
            className="block group/link"
          >
            <h3 className="font-bold text-base sm:text-lg text-foreground group-hover/link:text-primary-500 transition-colors duration-200 line-clamp-2">
              {item.title}
            </h3>
          </Link>

          <p className="text-primary-500 font-bold text-sm sm:text-base mt-1 flex items-center gap-1">
            <span className="text-[0.7rem] text-muted-foreground font-medium">Unit:</span>
            ${item.price.toFixed(2)}
          </p>

          {/* Mobile quantity controls */}
          <div className="mt-3 sm:hidden">
            <QuantityControls
              quantity={item.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          </div>
        </div>

        {/* Desktop Quantity & Price */}
        <div className="hidden sm:flex items-center gap-6 lg:gap-8">
          <QuantityControls
            quantity={item.quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />

          <div className="w-28 text-right">
            <p className="font-bold text-xl text-foreground tabular-nums">
              ${itemTotal.toFixed(2)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                ${item.price} × {item.quantity}
              </p>
            )}
          </div>
        </div>

        {/* Mobile total price */}
        <div className="sm:hidden ml-4 text-right">
          <p className="font-bold text-lg text-foreground tabular-nums">
            ${itemTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
});

// Promo Code Input Component
const PromoCodeInput = memo(({
  promoCode,
  promoApplied,
  onApply,
  onChange
}: {
  promoCode: string;
  promoApplied: boolean;
  onApply: () => void;
  onChange: (value: string) => void
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = useCallback(() => {
    if (!promoApplied && promoCode.trim()) {
      setIsApplying(true);
      setTimeout(() => {
        onApply();
        setIsApplying(false);
      }, 300);
    }
  }, [promoApplied, promoCode, onApply]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        Promo Code
      </label>
      <div className={`relative transition-all duration-300 ${promoApplied ? 'opacity-75' : ''}`}>
        <input
          type="text"
          value={promoCode}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder="Enter code"
          disabled={promoApplied}
          className={`
            w-full px-4 py-3 pr-12 rounded-xl
            bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900
            border-2 transition-all duration-300
            ${isFocused && !promoApplied
              ? 'border-primary-500 ring-4 ring-primary-500/10'
              : 'border-transparent'
            }
            ${promoApplied
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500/30'
              : 'hover:border-gray-200 dark:hover:border-gray-700'
            }
            focus:outline-none
          `}
        />
        <button
          onClick={handleApply}
          disabled={promoApplied || !promoCode.trim()}
          className={`
            absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg
            font-medium text-sm transition-all duration-300
            ${promoApplied
              ? 'bg-green-500 text-white cursor-default'
              : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
            }
          `}
        >
          {isApplying ? (
            <Sparkles className="w-4 h-4 animate-pulse" />
          ) : promoApplied ? (
            '✓'
          ) : (
            'Apply'
          )}
        </button>
      </div>
      {!promoApplied && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Try "SAVE10" for 10% off
        </p>
      )}
    </div>
  );
});

// Order Summary Component
const OrderSummary = memo(({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  promoCode,
  promoApplied,
  onApplyPromo,
  onPromoChange
}: {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  promoCode: string;
  promoApplied: boolean;
  onApplyPromo: () => void;
  onPromoChange: (value: string) => void;
}) => (
  <div className="card p-6 lg:sticky lg:top-20 space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5" />
        Secure
      </div>
    </div>

    {/* Price Details */}
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-semibold tabular-nums">${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground flex items-center gap-1.5">
          Shipping
          {shipping === 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
              FREE
            </span>
          )}
        </span>
        <span className="font-semibold tabular-nums">
          {shipping === 0 ? (
            <span className="text-green-500">Free</span>
          ) : `$${shipping.toFixed(2)}`}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tax (10%)</span>
        <span className="font-semibold tabular-nums">${tax.toFixed(2)}</span>
      </div>

      {promoApplied && discount > 0 && (
        <div className="flex justify-between text-sm text-green-500 animate-fadeIn">
          <span className="flex items-center gap-1.5">
            Discount
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">
              SAVE10
            </span>
          </span>
          <span className="font-semibold tabular-nums">-${discount.toFixed(2)}</span>
        </div>
      )}

      {/* Free shipping progress */}
      {shipping > 0 && (
        <div className="mt-2 p-3 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/10 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1.5">
            Add <span className="font-semibold text-foreground">${(50 - subtotal).toFixed(2)}</span> more for free shipping
          </p>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="border-t border-border pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-foreground">Total</span>
          <span className="font-bold text-2xl text-primary-500 tabular-nums">${total.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <p className="text-xs text-green-500 mt-1 text-right">
            You save ${discount.toFixed(2)}!
          </p>
        )}
      </div>
    </div>

    {/* Promo Code Input */}
    <PromoCodeInput
      promoCode={promoCode}
      promoApplied={promoApplied}
      onApply={onApplyPromo}
      onChange={onPromoChange}
    />

    {/* Checkout Button */}
    <button className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 group">
      <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
      Proceed to Checkout
    </button>

    {/* Payment Methods */}
    <div className="text-center pt-2">
      <p className="text-xs text-muted-foreground mb-3">We accept</p>
      <div className="flex justify-center items-center gap-2">
        <div className="px-3 py-1.5 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg text-xs font-semibold shadow-sm">
          <CreditCard className="w-3.5 h-3.5 inline mr-1" />
          Visa
        </div>
        <div className="px-3 py-1.5 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg text-xs font-semibold shadow-sm">
          <CreditCard className="w-3.5 h-3.5 inline mr-1" />
          Mastercard
        </div>
        <div className="px-3 py-1.5 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg text-xs font-semibold shadow-sm text-blue-600 dark:text-blue-400">
          PayPal
        </div>
      </div>
    </div>

    {/* Security Badge */}
    <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
      <Shield className="w-4 h-4" />
      <span>SSL Encrypted & Secure Checkout</span>
    </div>
  </div>
));

// Empty Cart Component
const EmptyCart = memo(() => (
  <div className="container-custom py-16 sm:py-24">
    <div className="max-w-md mx-auto text-center animate-fadeIn">
      {/* Animated Icon */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full animate-pulse" />
        <div className="absolute inset-4 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-full shadow-xl flex items-center justify-center">
          <Truck className="w-20 h-20 text-primary-400 animate-bounce" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
        Your cart is empty
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        Looks like you haven't added anything to your cart yet. Let's find something you'll love!
      </p>

      <Link
        to="/products"
        className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base font-bold group"
      >
        <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
        Start Shopping
      </Link>
    </div>
  </div>
));

// Main Cart Component
const Cart: React.FC = () => {
  const { state } = useAppContext();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = state.cart.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = useCallback(() => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
    }
  }, [promoCode]);

  if (state.cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-primary-500" />
            Shopping Cart
          </h1>
          <p className="text-muted-foreground mt-1">
            {state.cart.length} {state.cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <Link
          to="/products"
          className="hidden sm:inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.cart.map((item: CartItem) => (
            <CartItemCard key={item.id} item={item} />
          ))}

          {/* Mobile Continue Shopping */}
          <Link
            to="/products"
            className="sm:hidden inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            discount={discount}
            total={total}
            promoCode={promoCode}
            promoApplied={promoApplied}
            onApplyPromo={handleApplyPromo}
            onPromoChange={setPromoCode}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
