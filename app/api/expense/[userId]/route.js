// pages/api/category.js

import { getExpensesByUserId, updateExpenseAmount, deleteAllExpensesByUserId } from '../../../../lib/actions/expense'; // Import the getCategoriesByUserId function
// pages/api/orders/[orderId].js


export const GET = async (req, { params }) => {
  const { userId } = params;
  try {
    console.log("Fetching expenses for user:", userId);
    const result = await getExpensesByUserId(userId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Server error", { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  try {
    // Extract expenseId from params
    const selectedExpenseId = params;
    console.log("Selected expense ID:", selectedExpenseId.userId);

    // Parse the request body
    const { amount } = await req.json();
    console.log("Amount:", amount);

    // Validate input
    if (!selectedExpenseId || amount == null) {
      return new Response(
        JSON.stringify({ error: "Invalid expense ID or amount" }),
        { status: 400 }
      );
    }

    // Call the updateExpenseAmount function
    const result = await updateExpenseAmount({
      expenseId: selectedExpenseId.userId,
      amount,
    });

    console.log("Update result:", result);

    // Return success response
    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
    });
  } catch (error) {
    console.error("API error:", error);

    // Return error response
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      { status: 500 }
    );
  }
};

export const DELETE = async (req, { params }) => {
  const { userId } = params;
  try {
    console.log("Deleting all expenses for user:", userId);
    const result = await deleteAllExpensesByUserId(userId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Server error", { status: 500 });
  }
}