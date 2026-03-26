import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
import User from "@/models/users";

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const merchant = await User.findOne({ email: session.user.email });
    if (!merchant) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const channel = searchParams.get("channel");
    const search = searchParams.get("search");
    const mode = searchParams.get("mode") || "live"; // "live" or "test"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Filter by merchant + mode
    const query: Record<string, unknown> = {
      userId: merchant._id,
      mode,
    };

    if (status && status !== "all") query.status = status;
    if (channel && channel !== "all") query.channel = channel;
    if (search) query.reference = { $regex: search, $options: "i" };

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Dashboard transactions error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}