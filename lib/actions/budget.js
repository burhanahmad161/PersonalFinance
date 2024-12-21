import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "personal-finance";

// Function to create a new budget
export const createBudget = async ({ userId, amount }) => {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Database operations are server-side only');
    }
    console.log("Connecting to DB");
    await client.connect();
    console.log("Connected to DB");

    const db = client.db(dbName);
    const budgetsCollection = db.collection('Budgets');

    // Generate a random 10 digit budget ID
    const budgetId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const newBudget = {
      userId,
      amount,
      budgetId, // Store random ID
    };

    console.log("New Budget Data: ", newBudget);

    const result = await budgetsCollection.insertOne(newBudget);
    console.log('New Budget Added:', result);

    return await budgetsCollection.findOne({ _id: result.insertedId });
  } catch (error) {
    console.error('Error creating budget:', error);
    throw new Error('Database error');
  } finally {
    await client.close();
  }
};

// Function to get budgets by userId
export const getBudgetsByUserId = async (userId) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB

    const db = client.db(dbName); // Get the database
    console.log('Fetching budgets for user in main function:', userId);

    const budgets = await db
      .collection('Budgets') // Ensure this matches your actual MongoDB collection name
      .find({ userId }) // Filter budgets by userId
      .toArray();

    console.log('Budgets:', budgets);
    return budgets;
  } catch (error) {
    console.error('Error fetching budgets for user:', error);
    throw new Error('Error fetching budgets');
  } finally {
    await client.close(); // Close the connection when done
  }
};

// Function to delete a budget by budgetId
export const deleteBudget = async (budgetId) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB

    const db = client.db(dbName); // Get the database
    console.log('Deleting budget with budget Id:', budgetId);
    const userId = budgetId;

    const result = await db.collection('Budgets').deleteOne({ userId });
    console.log('Budget Deleted:', result);
    return result;
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw new Error('Error deleting budget');
  } finally {
    await client.close(); // Close the connection when done
  }
};

// Function to update a budget amount
export const updateBudgetAmount = async ({ budgetId, amount }) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB

    const db = client.db(dbName); // Get the database
    console.log('Updating budget amount for budget Id:', budgetId);

    const newAmount = parseInt(amount); // Parse the new amount as an integer
    console.log('New Amount:', newAmount);
    const userId = budgetId; // Use the budgetId as the userId
    const result = await db.collection('Budgets').updateOne(
      { userId },
      { $inc: { amount: newAmount } } // Update the amount
    );

    console.log('Budget Updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating budget amount:', error);
    throw new Error('Error updating budget amount');
  } finally {
    await client.close(); // Close the connection when done
  }
};
