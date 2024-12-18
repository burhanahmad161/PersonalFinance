import { getBudgetsByUserId, updateBudgetAmount } from '../../../../lib/actions/budget';

export const GET = async (req, { params }) => {
  const { userId } = params;
  try {
    console.log("Fetching budgets for user:", userId);
    const result = await getBudgetsByUserId(userId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Server error", { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  try {
    // Extract budgetId from params
    const selectedBudgetId = params;
    console.log("Selected budget ID:", selectedBudgetId.userId);

    // Parse the request body
    const { amount } = await req.json();
    console.log("Amount:", amount);

    // Validate input
    if (!selectedBudgetId || amount == null) {
      return new Response(
        JSON.stringify({ error: "Invalid budget ID or amount" }),
        { status: 400 }
      );
    }

    // Call the updateBudgetAmount function
    const result = await updateBudgetAmount({
      budgetId: selectedBudgetId.userId,
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
