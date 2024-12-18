import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "personal-finance";

// Function to create a new user
export const createCategory = async ({ userId, ...categoryName }) => {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Database operations are server-side only');
    }
    console.log("Connecting to DB");
    await client.connect();
    console.log("Connected to DB");
    const db = client.db(dbName);
    const usersCollection = db.collection('Categories');
    // Generate a random 10 digit user ID and current timestamp
    const categoryId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const addingTime = new Date();
    const newCategory = { 
      userId, 
      ...categoryName, 
      categoryId,  // Store random ID
      addingTime, // Store current timestamp
    };
    console.log("New Category Data: ", newCategory);

    const result = await usersCollection.insertOne(newCategory);
    console.log('New Category Added:', result);

    return await usersCollection.findOne({ _id: result.insertedId });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Database error');
  } finally {
    await client.close();
  }
};


//..........................................Get Categories by User ID
export const getCategoriesByUserId = async (userId) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB

    const db = client.db(dbName); // Get the database
    console.log('Fetching categories for user in main function:', userId);
    const categories = await db
      .collection('Categories') // Ensure this matches your actual MongoDB collection name
      .find({ userId }) // Filter categories by userId
      .toArray();
    console.log('Categories:', categories);
    return categories;
  } 
  catch (error) {
    console.error('Error fetching categories for user:', error);
    throw new Error('Error fetching categories');
  } finally {
    await client.close(); // Close the connection when done
  }
};

//.............................Delete Category
export const deleteCategory = async (categoryId) => {
  try {
    await client.connect(); // Make sure to connect to MongoDB

    const db = client.db(dbName); // Get the database
    console.log('Deleting category with category Id:', categoryId);
    const result = await db.collection('Categories').deleteOne({ categoryId });
    console.log('Category Deleted:', result);
    return result;
  }
  catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Error deleting category');
  } finally {
    await client.close(); // Close the connection when done
  }
}