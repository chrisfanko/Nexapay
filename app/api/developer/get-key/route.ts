import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongo_db";
import User from "@/models/users";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).select(
      "apiKey testApiKey merchantStatus"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      apiKey: user.apiKey,
      testApiKey: user.testApiKey,
      merchantStatus: user.merchantStatus,
    });
  } catch (error) {
    console.error("Get key error:", error);
    return NextResponse.json({ error: "Failed to fetch keys" }, { status: 500 });
  }
}