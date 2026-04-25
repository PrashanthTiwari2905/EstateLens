import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB, Prediction } from "../../lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch last 20 predictions for the current user
    const history = await Prediction.find({ user_email: session.user.email })
      .sort({ created_at: -1 })
      .limit(20);

    return NextResponse.json(history);
  } catch (error) {
    console.error("History GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prediction history" },
      { status: 500 }
    );
  }
}
