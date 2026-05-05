import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB, Prediction } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const houseData = await req.json();
    
    // MAP FRONTEND NAMES TO BACKEND NAMES
    const mappedData = {
      crim: houseData.crime_rate,
      rm: houseData.avg_rooms,
      age: houseData.house_age,
      dis: houseData.distance_to_work,
      tax: houseData.tax_rate,
      ptratio: houseData.school_ratio,
      lstat: houseData.low_income_percent
    };

    let ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";
    ML_API_URL = ML_API_URL.replace(/\/$/, "");

    // 1. Call ML API
    let predictionResult;
    try {
      const mlResponse = await axios.post(`${ML_API_URL}/predict/price`, mappedData, {
        timeout: 120000 // 120s for Render free tier wake up
      });
      
      // CONVERT TO RUPEES (Assuming model output is in $1000s and $1 = ₹83)
      const multiplier = 83000;
      predictionResult = {
        ...mlResponse.data,
        predicted_price: mlResponse.data.predicted_price * multiplier,
        confidence_range: [
          mlResponse.data.confidence_range[0] * multiplier,
          mlResponse.data.confidence_range[1] * multiplier
        ]
      };
    } catch (mlError) {
      console.error("ML API Error:", mlError.response?.data || mlError.message);
      return NextResponse.json(
        { error: `ML Service Error: ${mlError.message}. Target: ${ML_API_URL}` },
        { status: 503 }
      );
    }

    // 2. Save to MongoDB
    await connectDB();
    const newPrediction = await Prediction.create({
      user_email: session.user.email,
      input_features: houseData,
      predicted_price: predictionResult.predicted_price,
      confidence_low: predictionResult.confidence_range[0],
      confidence_high: predictionResult.confidence_range[1],
      top_factors: predictionResult.top_factors,
    });

    return NextResponse.json({
      ...predictionResult,
      confidence_low: predictionResult.confidence_range[0],
      confidence_high: predictionResult.confidence_range[1],
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
