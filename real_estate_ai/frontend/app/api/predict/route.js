import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB, Prediction } from "../../../lib/mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const houseData = await req.json();
    const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

    // 1. Call ML API
    let predictionResult;
    try {
      const mlResponse = await axios.post(`${ML_API_URL}/predict`, houseData);
      predictionResult = mlResponse.data;
    } catch (mlError) {
      console.error("ML API Error:", mlError.message);
      return NextResponse.json(
        { error: "ML Service is currently unavailable" },
        { status: 503 }
      );
    }

    // 2. Save to MongoDB
    await connectDB();
    const newPrediction = await Prediction.create({
      user_email: session.user.email,
      input_features: houseData,
      predicted_price: predictionResult.predicted_price,
      confidence_low: predictionResult.confidence_low,
      confidence_high: predictionResult.confidence_high,
      top_factors: predictionResult.top_factors,
    });

    return NextResponse.json({
      ...predictionResult,
      id: newPrediction._id,
    });
  } catch (error) {
    console.error("Predict Route Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
