import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/cart/Cart.css";

const BASE_URL = 'http://localhost:8088';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);

  // Calculate total items
  const totalItems = cartItems.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  // Calculate savings (if you have original prices)
  const totalOriginalPrice = cartItems.reduce((total, item) => {
    const originalPrice = item.originalPrice || item.price;
    return total + (originalPrice * (item.quantity || 1));
  }, 0);
  const totalSavings = totalOriginalPrice - totalPrice;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsLoading(true);
    try {
      // Add any pre-checkout logic here if needed
      navigate("/payment", { state: { cartItems, totalPrice } });
    } catch (error) {
      console.error("Checkout error:", error);
      // You could add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button 
            className="continue-shopping-btn primary" 
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <div className="cart-title">
          <h1>Shopping Cart</h1>
          <span className="item-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
        </div>
        <button 
          className="clear-cart-btn" 
          onClick={handleClearCart}
          aria-label="Clear entire cart"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18l-2 13H5L3 6z"/>
            <path d="m19 6-2-2H7L5 6"/>
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
          </svg>
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={item.id} className="cart-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="item-image">
                  <img
                    src={item.imagePath}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                    loading="lazy"
                  />
                </div>

                <div className="item-details">
                  <h3>{item.name}</h3>
                  {item.description && (
                    <p className="item-description">{item.description}</p>
                  )}
                  <div className="item-meta">
                    {item.category && <span className="item-category">{item.category}</span>}
                    {item.sku && <span className="item-sku">SKU: {item.sku}</span>}
                  </div>
                </div>
                
                <div className="item-actions">
                  <div className="price-section">
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="original-price">{formatPrice(item.originalPrice)}</span>
                    )}
                    <span className="current-price">{formatPrice(item.price)}</span>
                  </div>

                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn decrease"
                      onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                      </svg>
                    </button>
                    <input 
                      type="number" 
                      className="quantity-input"
                      value={item.quantity || 1}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      min="1"
                      max="99"
                    />
                    <button 
                      className="quantity-btn increase"
                      onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                      aria-label="Increase quantity"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14m-7-7h14"/>
                      </svg>
                    </button>
                  </div>

                  <div className="item-total">
                    <span className="total-label">Total</span>
                    <span className="total-price">
                      {formatPrice(item.price * (item.quantity || 1))}
                    </span>
                  </div>

                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    title="Remove item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <div className="summary-header">
            <h2>Order Summary</h2>
          </div>

          <div className="summary-details">
            <div className="summary-row subtotal">
              <span>Subtotal ({totalItems} items)</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {totalSavings > 0 && (
              <div className="summary-row savings">
                <span>You're saving</span>
                <span>-{formatPrice(totalSavings)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
          
          <div className="cart-actions">
            <button 
              className="continue-shopping-btn" 
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isLoading || cartItems.length === 0}
            >
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;