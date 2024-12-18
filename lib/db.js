import mongoose from 'mongoose';

let isConnected = false;


export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL){
        return console.log('MISSING MONGODB_URL');

    }
        if (isConnected){
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: 'personal-finance'
        })

        isConnected = true;
        console.log('MongoDB is connected')

    } catch (error) {
        console.log(error);
    }
}