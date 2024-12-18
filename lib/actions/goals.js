import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "personal-finance";

// Function to create a new financial goal
export const createFinancialGoal = async ({ userId, goalName, goalAmount, amountSaved }) => {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Database operations are server-side only');
    }
    console.log("Connecting to DB");
    await client.connect();
    console.log("Connected to DB");
    const db = client.db(dbName);
    const financialGoalsCollection = db.collection('FinancialGoals');
    const goalId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const dateCreated = new Date();
    const newGoal = { 
      userId, 
      goalId,
      goalName,
      goalAmount,
      amountSaved, 
      dateCreated,
    };
    console.log("New financial goal Data: ", newGoal);

    const result = await financialGoalsCollection.insertOne(newGoal);
    console.log('New financial goal Added:', result);

    return await financialGoalsCollection.findOne({ _id: result.insertedId });
  } catch (error) {
    console.error('Error creating financial goal:', error);
    throw new Error('Database error');
  } finally {
    await client.close();
  }
};


//..........................................Get financial goals by User ID
export const getFinancialGoalsByUserId = async (userId) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB

    const db = client.db(dbName); // Get the database
    console.log('Fetching Financial Goals for user in main function:', userId);
    const financialGoals = await db
      .collection('FinancialGoals') // Ensure this matches your actual MongoDB collection name
      .find({ userId }) // Filter goals by userId
      .toArray();
    console.log('Financial Goals:', financialGoals);
    return financialGoals;
  } 
  catch (error) {
    console.error('Error fetching financial goals for user:', error);
    throw new Error('Error fetching financial goals');
  } finally {
    await client.close(); // Close the connection when done
  }
};


//............................Update goal amount saved
export const updateGoalAmountSaved = async ({ goalId, amount }) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB

    const db = client.db(dbName); // Get the database
    console.log('Updating amount saved for financial goal:', goalId);
    const newAmountSaved = (amount);
    const result = await db.collection('FinancialGoals').updateOne(
      { goalId },
      { $set: { amountSaved: newAmountSaved } }
    );
    console.log('Financial Goal Updated:', result);
    return result;
  }
  catch (error) {
    console.error('Error updating financial goal:', error);
    throw new Error('Error updating financial goal');
  } finally {
    await client.close(); // Close the connection when done
  }
}
 

//.......................... Delete financial goal
export const deleteFinancialGoal = async (goalId ) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB
    const db = client.db(dbName); // Get the database
    console.log('Deleting financial goal:', goalId);
    const result = await db.collection('FinancialGoals').deleteOne({ goalId });
    console.log('Financial Goal Deleted:', result);
    return result;
  }
  catch (error) {
    console.error('Error deleting financial goal:', error);
    throw new Error('Error deleting financial goal');
  } finally {
    await client.close(); // Close the connection when done
  }
}