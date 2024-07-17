import mongoose from 'mongoose';
import 'dotenv/config';

async function initMongoConnection() {
  try {
    const user = process.env.MONGODB_USER;
    const pwd = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    console.log('MONGODB_USER:', user);
    console.log('MONGODB_PASSWORD:', pwd);
    console.log('MONGODB_URL:', url);
    console.log('MONGODB_DB:', db);

    const connectionString = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Contacts`;

    await mongoose.connect(connectionString);

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export { initMongoConnection };
