import { createBudget } from '../../../lib/actions/budget';

// Define the POST request handler
export const POST = async (req) => {
  try {
    // Extract the data from the request body
    const { userId, newBudget } = await req.json();
    // Handle 'create budget' action
    console.log('Creating Budget:', { userId, newBudget });
    // Ensure you're passing all the necessary fields to createBudget
    const amount = newBudget;
    const newBudgett = await createBudget({ userId, amount });
    return new Response(
      JSON.stringify(newBudgett),
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
