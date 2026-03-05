import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo_db";
import User from "@/models/users";
import crypto from "crypto";

function generateApiKey(): string {
  const random = crypto.randomBytes(24).toString("hex");
  return `npk_live_${random}`;
}

export async function POST() {
  // 1. Make sure the user is logged in
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    // 2. Generate a new key and save it
    const newApiKey = generateApiKey();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { apiKey: newApiKey },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    console.log(`API key regenerated for ${session.user.email}`);

    return NextResponse.json(
      { message: "API key regenerated successfully", apiKey: newApiKey },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error regenerating API key:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}