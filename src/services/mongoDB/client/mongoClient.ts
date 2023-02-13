import mongoose from 'mongoose';

export const connectDB = async (uri: string) => {
  try {
    const mongoConnection = await mongoose.connect(uri);

    console.log(`Mongo DB connected: ${mongoConnection.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to Mongo DB: ${(error as Error).message}`);
    process.exit(1);
  }
};
