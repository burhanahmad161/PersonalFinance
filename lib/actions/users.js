import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // You should store the secret in .env
const client = new MongoClient(process.env.MONGO_URI);
const dbName = "personal-finance";
let emailVar = "";
let userIdVar = "";

// Function to check if user is valid


// Function to check if user is valid
export const isValidUser = async (email, password) => {
  console.log('Validating user:', email);
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Database operations are server-side only');
    }
    console.log("Connecting to DB");
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const usersCollection = db.collection('RegisteredUsers');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      console.log('No user found with this email');
      return false; // User not found, invalid login
    }

    if (user.password !== password) {
      console.log('Incorrect password');
      return false; // Invalid password
    }
    
    // If user is valid, generate JWT
    const payload = { userId: user.userId, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Set expiration time for token
    console.log('JWT Secret Key:', JWT_SECRET); // You can remove this log in production
    console.log('JWT Token:', token); // You can remove this log in production

    return { valid: true, token }; // Return token along with validity
  } catch (error) {
    console.error('Error validating user:', error);
    throw new Error('Database error');
  } finally {
    await client.close();
  }
};

// Function to create a new user
export const createUser = async ({ userName, email, phoneNumber, password }) => {
  let temporaryUserName = ''; // Temporarily store userName

  try {
    if (typeof window !== 'undefined') {
      throw new Error('Database operations are server-side only');
    }
    console.log("Connecting to DB");
    await client.connect();
    console.log("Connected to DB");

    const db = client.db(dbName);
    const usersCollection = db.collection('RegisteredUsers');

    // Check if user with the same email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      throw new Error('Email address already registered');
    }

    // Email validation: Ensure it ends with '.com'
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (!email.endsWith('.com')) {
      throw new Error('Email must end with .com');
    }

    // Password validation: Check if it contains a capital letter, special character, and number, and is at least 8 characters long
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error('Password must be at least 8 characters long, contain a capital letter, a number, and a special character');
    }

    // Generate a random 10 digit user ID and current timestamp
    const userId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const createdAt = new Date().toISOString();

    const newUser = {
      userName,
      email,
      phoneNumber,
      password,
      userId,  // Store random ID
      createdAt  // Store the current date and time
    };
    console.log("New User Data: ", newUser);

    const result = await usersCollection.insertOne(newUser);
    console.log('New User Created:', result);

    return await usersCollection.findOne({ _id: result.insertedId });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(error.message || 'Database error');
  } finally {
    await client.close();
  }
};


// Function to get the userIdVar
export const getUserId = () => {
  console.log("Exporting User ID: ", userIdVar);
  return userIdVar;
};

// Function to verify the token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('User ID:', decoded.userId);
    console.log("Token Verified", token);
    console.log("JWT Secret Key:", JWT_SECRET);
    console.log('Decoded Token:', decoded);
    return decoded; // Return the decoded payload (e.g., userId, email)
  } catch (error) {
    console.error('Error verifying token:', error);
    return null; // Invalid token
  }
};
