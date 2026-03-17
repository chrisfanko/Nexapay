import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongo_db";
import User from "@/models/users";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const { webhookUrl } = await req.json();

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(webhookUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    await User.findOneAndUpdate(
      { email: session.user.email },
      { webhookUrl },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save webhook error:", error);
    return NextResponse.json({ error: "Failed to save webhook URL" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email })
      .select("webhookUrl webhookSecret");

    return NextResponse.json({
      webhookUrl: user?.webhookUrl || "",
      webhookSecret: user?.webhookSecret || "",
    });
  } catch (error) {
    console.error("Get webhook error:", error);
    return NextResponse.json({ error: "Failed to fetch webhook" }, { status: 500 });
  }
}