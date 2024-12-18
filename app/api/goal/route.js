import { createFinancialGoal } from '../../../lib/actions/goals'; // Assuming this function exists

// Define the POST request handler for financial goals
export const POST = async (req) => {
  try {
    // Extract the data from the request body
    const { userId, goalName, goalAmount, amountSaved } = await req.json();
    
    console.log('Creating Financial Goal:', { userId, goalName, goalAmount, amountSaved });

    // Call the function to create a financial goal
    const newGoal = await createFinancialGoal({ userId, goalName, goalAmount, amountSaved });

    return new Response(
      JSON.stringify(newGoal),
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500 }
    );
  }
};
