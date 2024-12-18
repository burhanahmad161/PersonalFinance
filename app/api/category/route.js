import { createCategory } from '../../../lib/actions/category';

// Define the POST request handler
export const POST = async (req) => {
  try {
    // Extract the data from the request body
    const { userId, categoryName, ...userData } = await req.json();
    // Handle 'signup' action
      console.log('Creating Category:', { userId, ...userData });
      // Ensure you're passing all the necessary fields to createUser
      const newCategory = await createCategory({ userId, ...userData });
      return new Response(
        JSON.stringify(newCategory),
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
