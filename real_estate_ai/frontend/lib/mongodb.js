import mongoose from 'mongoose'

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (typeof window !== 'undefined') return;

  let rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    console.error("CRITICAL: MONGODB_URI is missing.");
    throw new Error('Database configuration error.');
  }

  // SMART CLEANING: Remove quotes, spaces, or invisible characters
  const MONGODB_URI = rawUri.trim().replace(/^["'](.+)["']$/, '$1');

  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error("FORMAT ERROR: URI starts with:", MONGODB_URI.substring(0, 10));
    throw new Error('Invalid database link format. It must start with mongodb+srv://');
  }

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise
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
