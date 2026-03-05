import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo_db";
import User from "@/models/users";

export async function GET() {
  // 1. Check user is logged in
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ apiKey: user.apiKey || null });
  } catch (error) {
    console.error("Error fetching API key:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}