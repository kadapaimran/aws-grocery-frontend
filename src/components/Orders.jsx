import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/cart/Orders.css";

const PaymentHistory = () => {
  const { paymentHistory } = useCart();
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  // Format number as INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate total for a transaction including quantity
  const calculateTransactionTotal = (transaction) => {
    if (transaction.orderSummary) {
      return transaction.orderSummary.total;
    }
    return transaction.items.reduce((total, item) => 
      total + (item.price * (item.quantity || 1)), 0
    );
  };

  // Get payment status (for demo purposes)
  const getPaymentStatus = (transaction) => {
    return transaction.status || "Completed";
  };

  // Get payment method display
  const getPaymentMethodDisplay = (method) => {
    const methods = {
      card: "Credit/Debit Card",
      paypal: "PayPal",
      apple: "Apple Pay",
      google: "Google Pay"
    };
    return methods[method] || method;
  };

  // Sort transactions
  const sortedTransactions = [...paymentHistory].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.orderDate || b.date) - new Date(a.orderDate || a.date);
    } else if (sortBy === "oldest") {
      return new Date(a.orderDate || a.date) - new Date(b.orderDate || b.date);
    } else if (sortBy === "amount-high") {
      return calculateTransactionTotal(b) - calculateTransactionTotal(a);
    } else if (sortBy === "amount-low") {
      return calculateTransactionTotal(a) - calculateTransactionTotal(b);
    }
    return 0;
  });

  // Filter transactions
  const filteredTransactions = sortedTransactions.filter(transaction => {
    if (filterBy === "all") return true;
    return transaction.paymentMethod === filterBy;
  });

  // Calculate total spent
  const totalSpent = paymentHistory.reduce((total, transaction) => 
    total + calculateTransactionTotal(transaction), 0
  );

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Payment History</h2>
        {paymentHistory.length > 0 && (
          <div className="history-stats">
            <span className="total-orders">Total Orders: {paymentHistory.length}</span>
            <span className="total-spent">Total Spent: {formatINR(totalSpent)}</span>
          </div>
        )}
      </div>

      {paymentHistory.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p className="empty-msg">No payment history yet</p>
          <p className="empty-subtitle">Your completed orders will appear here</p>
          <button 
            className="shop-now-btn"
            onClick={() => window.location.href = '/products'}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Filters and Sort */}
          <div className="history-controls">
            <div className="sort-control">
              <label htmlFor="sort">Sort by:</label>
              <select 
                id="sort"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount (High to Low)</option>
                <option value="amount-low">Amount (Low to High)</option>
              </select>
            </div>
            
            <div className="filter-control">
              <label htmlFor="filter">Payment Method:</label>
              <select 
                id="filter"
                value={filterBy} 
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="all">All Methods</option>
                <option value="card">Card</option>
                <option value="paypal">PayPal</option>
                <option value="apple">Apple Pay</option>
              </select>
            </div>
          </div>

          <div className="transaction-list">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.orderId || transaction.id} className="transaction-card">
                <div className="transaction-header">
                  <div className="transaction-info">
                    <span className="order-id">
                      Order #{transaction.orderId || transaction.id}
                    </span>
                    <span className="transaction-date">
                      {formatDate(transaction.orderDate || transaction.date)}
                    </span>
                  </div>
                  <div className="transaction-summary">
                    <span className="transaction-total">
                      {formatINR(calculateTransactionTotal(transaction))}
                    </span>
                    <span className={`payment-status ${getPaymentStatus(transaction).toLowerCase()}`}>
                      {getPaymentStatus(transaction)}
                    </span>
                  </div>
                </div>
                
                <div className="transaction-details">
                  <div className="payment-info">
                    <span className="payment-method">
                      <strong>Payment:</strong> {getPaymentMethodDisplay(transaction.paymentMethod)}
                    </span>
                    {transaction.orderSummary && (
                      <div className="order-breakdown">
                        <span>Items: {formatINR(transaction.orderSummary.subtotal)}</span>
                        {transaction.orderSummary.shipping > 0 && (
                          <span>Shipping: {formatINR(transaction.orderSummary.shipping)}</span>
                        )}
                        <span>Tax: {formatINR(transaction.orderSummary.tax)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="items-section">
                  <h4>Items Purchased ({transaction.items.length}):</h4>
                  <ul className="item-list">
                    {transaction.items.map((item, index) => (
                      <li key={item.id || index} className="item">
                        <div className="item-details">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="item-image"
                            />
                          )}
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            {item.quantity && item.quantity > 1 && (
                              <span className="item-quantity">Qty: {item.quantity}</span>
                            )}
                          </div>
                        </div>
                        <span className="item-price">
                          {formatINR(item.price * (item.quantity || 1))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="transaction-actions">
                  <button className="view-details-btn">View Details</button>
                  <button className="reorder-btn">Reorder Items</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
