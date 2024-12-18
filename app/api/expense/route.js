import { createExpense } from '../../../lib/actions/expense';

// Define the POST request handler
export const POST = async (req) => {
  try {
    // Extract the data from the request body
    const { userId, expenseName, amount, expenseCategory } = await req.json();
    // Handle 'signup' action
      console.log('Creating Category:', { userId, expenseName, amount, expenseCategory });
      // Ensure you're passing all the necessary fields to createUser
      const newExpense = await createExpense({ userId, expenseName, amount, expenseCategory });
      return new Response(
        JSON.stringify(newExpense),
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


