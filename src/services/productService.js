import axios from "axios";

const BASE_URL = "http://ec2-3-134-97-216.us-east-2.compute.amazonaws.com:8088/api/products";

export const getProducts = async (category) => {
  try {
    if (category) {
      // ✅ Fetch by category
      const response = await axios.get(`${BASE_URL}/category/${category}`);
      return response.data;
    } else {
      // ✅ Fetch all products
      const response = await axios.get(BASE_URL);
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
