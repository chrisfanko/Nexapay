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
    const mode = searchParams.get("mode") || "live"; // "live" or "test"

    // Filter by merchant + mode
    const filter = { userId: merchant._id, mode };

    const totalTransactions = await Transaction.countDocuments(filter);
    const successfulTransactions = await Transaction.countDocuments({ ...filter, status: "complete" });
    const failedTransactions = await Transaction.countDocuments({ ...filter, status: "failed" });
    const pendingTransactions = await Transaction.countDocuments({ ...filter, status: "pending" });

    const volumeResult = await Transaction.aggregate([
      { $match: { ...filter, status: "complete" } },
      { $group: { _id: null, total: { $sum: "$grossAmount" } } },
    ]);
    const totalVolume = volumeResult[0]?.total || 0;

    const successRate =
      totalTransactions > 0
        ? Math.round((successfulTransactions / totalTransactions) * 100)
        : 0;

    const recentTransactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      pendingTransactions,
      totalVolume,
      successRate,
      recentTransactions,
      mode,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}