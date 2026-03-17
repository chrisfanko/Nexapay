import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo_db";
import Message from "@/models/message";
import User from "@/models/users";

// GET — list all messages
export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const adminUser = await User.findOne({ email: session.user.email });
    if (adminUser?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const filter = searchParams.get("filter") || "all";

    const query: Record<string, unknown> =
      filter === "unread" ? { read: false } :
      filter === "read" ? { read: true } : {};

    const messages = await Message.find(query).sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ read: false });

    return NextResponse.json({ messages, unreadCount });
  } catch (error) {
    console.error("Admin messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST — mark message as read/unread
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const adminUser = await User.findOne({ email: session.user.email });
    if (adminUser?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { messageId, read } = await req.json();

    await Message.findByIdAndUpdate(messageId, { read });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin message update error:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}