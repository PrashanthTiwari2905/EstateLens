import mongoose from 'mongoose'

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (typeof window !== 'undefined') return;

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ CRITICAL: MONGODB_URI is missing in .env.local");
    throw new Error('Database configuration error.');
  }

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 15000,
    };
    
    console.log("📡 Attempting to connect to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected Successfully");
      return mongoose;
    }).catch(err => {
      console.error("❌ MongoDB Connection Error:", err.message);
      cached.promise = null; // Allow retry on next request
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn
}

// User Schema
const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  created_at:{ type: Date, default: Date.now }
})

// Prediction Schema
const PredictionSchema = new mongoose.Schema({
  user_email:      { type: String, required: true },
  input_features:  { type: Object },
  predicted_price: { type: Number },
  confidence_low:  { type: Number },
  confidence_high: { type: Number },
  top_factors:     { type: [String] },
  created_at:      { type: Date, default: Date.now }
})

const User = mongoose.models.User || 
  mongoose.model('User', UserSchema)

const Prediction = mongoose.models.Prediction || 
  mongoose.model('Prediction', PredictionSchema)

export { connectDB, User, Prediction }
export default connectDB
