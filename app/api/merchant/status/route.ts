import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo_db";
import User from "@/models/users";

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).select(
      "merchantStatus business rejectionReason apiKey"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      merchantStatus: user.merchantStatus,
      business: user.business,
      rejectionReason: user.rejectionReason,
      apiKey: user.apiKey,
    });
  } catch (error) {
    console.error("Merchant status error:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}