import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "personal-finance";

// Function to create a new user
export const createExpense = async ({ userId, expenseName, amount, expenseCategory }) => {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Database operations are server-side only');
    }
    console.log("Connecting to DB");
    await client.connect();
    console.log("Connected to DB");
    const db = client.db(dbName);
    const usersCollection = db.collection('Expenses');
    const expenseId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const addingTime = new Date();
    const newExpense = { 
      userId, 
      expenseId,
      expenseName,
      amount,
      expenseCategory,
      addingTime, 
    };
    console.log("New expense Data: ", newExpense);

    const result = await usersCollection.insertOne(newExpense);
    console.log('New expense Added:', result);

    return await usersCollection.findOne({ _id: result.insertedId });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Database error');
  } finally {
    await client.close();
  }
};


//..........................................Get expenses by User ID
export const getExpensesByUserId = async (userId) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB

    const db = client.db(dbName); // Get the database
    console.log('Fetching Expenses for user in main function:', userId);
    const expenses = await db
      .collection('Expenses') // Ensure this matches your actual MongoDB collection name
      .find({ userId }) // Filter expenses by userId
      .toArray();
    console.log('Expenses:', expenses);
    return expenses;
  } 
  catch (error) {
    console.error('Error fetching expenses for user:', error);
    throw new Error('Error fetching expenses');
  } finally {
    await client.close(); // Close the connection when done
  }
};


//............................Update expense Amount
export const updateExpenseAmount = async ({ expenseId, amount }) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB

    const db = client.db(dbName); // Get the database
    console.log('Updating expense amount:', expenseId);
    const newAmount = parseInt(amount);
    const result = await db.collection('Expenses').updateOne(
      { expenseId },
      { $set: { amount: newAmount } }
    );
    console.log('Expense Updated:', result);
    return result;
  }
  catch (error) {
    console.error('Error updating expense:', error);
    throw new Error('Error updating expense');
  } finally {
    await client.close(); // Close the connection when done
  }
}


//............................Delete User All expenses  
export const deleteAllExpensesByUserId = async (userId) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB

    const db = client.db(dbName); // Get the database
    console.log('Deleting all expenses for user:', userId);
    const result = await db.collection('Expenses').deleteMany({ userId });
    console.log('Expenses Deleted:', result);
    return result;
  } 
  catch (error) {
    console.error('Error deleting expenses for user:', error);
    throw new Error('Error deleting expenses');
  } finally {
    await client.close(); // Close the connection when done
  }
};
