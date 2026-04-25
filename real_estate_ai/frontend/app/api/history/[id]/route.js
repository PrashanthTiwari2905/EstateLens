import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB, Prediction } from "../../../../lib/mongodb";

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await connectDB();

    // Verify ownership before deletion
    const result = await Prediction.findOneAndDelete({
      _id: id,
      user_email: session.user.email,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Prediction not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("History DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete prediction record" },
      { status: 500 }
    );
  }
}
