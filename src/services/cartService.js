import axios from "axios";

const CART_API_URL = "http://ec2-3-134-97-216.us-east-2.compute.amazonaws.com:8088/api/cart"; // relative path

export const addToCart = async (userId, productId) => {
  return await axios.post(`${CART_API_URL}/add`, {
    userId,
    productId,
    quantity: 1,
  });
};

export const getCartItems = async (userId) => {
  const response = await axios.get(`${CART_API_URL}/user/${userId}`);
  return response.data;
};

export const clearCart = async (userId) => {
  return await axios.delete(`${CART_API_URL}/clear/${userId}`);
};

export const removeCartItem = async (cartItemId) => {
  try {
    await axios.delete(`${CART_API_URL}/remove/${cartItemId}`);
  } catch (error) {
    console.error("Error removing item from cart", error);
  }
};
