import mongoose from 'mongoose';

const DB_URI = process.env.DB_URI;

async function initMongoConnection() {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export { initMongoConnection };
