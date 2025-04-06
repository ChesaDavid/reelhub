import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string; // Use your MongoDB connection string

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in environment variables");
}

// Cache connection to avoid multiple re-connections
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
