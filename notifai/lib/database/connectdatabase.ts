import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://mikenegh:FBCusc9trVMIhOKN@cluster0.n9cp0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let cached = (global as any).mongoose || { conn: null, promise: null };

export const dbConnect = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing from environment variables");
    return;
  }

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URI, {
        dbName: "notifai",
        bufferCommands: false,
      });

    cached.conn = await cached.promise;
    console.log("Connected to MongoDB successfully");
    return cached.conn;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};