// pages/api/category.js

import { getCategoriesByUserId, deleteCategory } from '../../../../lib/actions/category'; // Import the getCategoriesByUserId function
// pages/api/orders/[orderId].js


export const GET = async (req, { params }) => {
  const { userId } = params;
  try {
    console.log("Fetching categories for user:", userId);
    const result = await getCategoriesByUserId(userId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Server error", { status: 500 });
  }
};
export const DELETE = async (req, { params }) => {
  const { userId } = params;
  try {
    console.log("Enetered Delete Api with category Id:", userId);
    const categoryId = userId;
    const result = await deleteCategory(categoryId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Server error", { status: 500 });
  }
};