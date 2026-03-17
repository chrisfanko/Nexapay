import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongo_db";
import WebhookLog from "@/models/webhookLog";
import User from "@/models/users";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const merchant = await User.findOne({ email: session.user.email });
    if (!merchant) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const logs = await WebhookLog.find({ userId: merchant._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Webhook logs error:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}