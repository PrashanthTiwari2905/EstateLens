import mongoose from 'mongoose';

/**
 * MONGODB_URI should be defined in your .env.local file.
 * In Next.js, we use a global caching pattern to prevent creating multiple connections
 * during hot-reloading in development mode or across serverless function calls.
 */
const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected Ready');
      return mongoose;
    }).catch((err) => {
      console.error('❌ MongoDB Connection Error:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// --- MODELS ---

// User Schema
const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

// Prediction Schema
const PredictionSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  input_features: { type: Object, required: true },
  predicted_price: { type: Number, required: true },
  confidence_low: { type: Number },
  confidence_high: { type: Number },
  top_factors: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
});

// Avoid re-compiling the model if it already exists
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Prediction = mongoose.models.Prediction || mongoose.model('Prediction', PredictionSchema);
