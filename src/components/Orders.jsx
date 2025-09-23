import React from "react";
import { useCart } from "../context/CartContext";
import "../styles/cart/Orders.css";

const PaymentHistory = () => {
  const { paymentHistory } = useCart();

  // Format number as INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Calculate total for a transaction
  const calculateTransactionTotal = (items) => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="history-container">
      <h2>Payment History</h2>
      {paymentHistory.length === 0 ? (
        <div className="empty-state">
          <p className="empty-msg">No past payments</p>
          <p className="empty-subtitle">Your payment history will appear here</p>
        </div>
      ) : (
        <div className="transaction-list">
          {paymentHistory.map((transaction) => (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-header">
                <span className="transaction-date">
                  <strong>Date:</strong> {transaction.date}
                </span>
                <span className="transaction-total">
                  Total: {formatINR(calculateTransactionTotal(transaction.items))}
                </span>
              </div>
              
              <div className="items-section">
                <h4>Items Purchased:</h4>
                <ul className="item-list">
                  {transaction.items.map((item) => (
                    <li key={item.id} className="item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{formatINR(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;