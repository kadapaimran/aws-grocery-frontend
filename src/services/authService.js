//// frontend/src/api/auth.js
import axios from "axios";

// Use relative URL
const API_URL = "http://ec2-18-222-48-109.us-east-2.compute.amazonaws.com:8088/auth";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    localStorage.setItem("token", response.data.token); // store only the token
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const signup = async (username, email, password) => {
  return axios.post(`${API_URL}/signup`, { username, email, password });
};

export const logout = () => {
  localStorage.removeItem("token");
};
