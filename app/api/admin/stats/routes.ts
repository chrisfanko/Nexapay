import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
import User from "@/models/users";

export async function GET() {
  // 1. Check session
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Check admin role
  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // 3. Get platform wide stats
    const totalTransactions = await Transaction.countDocuments();
    const successfulTransactions = await Transaction.countDocuments({ status: "complete" });
    const failedTransactions = await Transaction.countDocuments({ status: "failed" });
    const pendingTransactions = await Transaction.countDocuments({ status: "pending" });

    // Total volume processed (gross amount of all complete transactions)
    const volumeResult = await Transaction.aggregate([
      { $match: { status: "complete" } },
      { $group: { _id: null, total: { $sum: "$grossAmount" } } },
    ]);
    const totalVolume = volumeResult[0]?.total || 0;

    // Total NexaPay fees collected
    const feesResult = await Transaction.aggregate([
      { $match: { status: "complete" } },
      { $group: { _id: null, total: { $sum: "$nexapayFee" } } },
    ]);
    const totalFees = feesResult[0]?.total || 0;

    // Total merchants (users)
    const totalMerchants = await User.countDocuments({ role: "user" });

    // Success rate
    const successRate =
      totalTransactions > 0
        ? Math.round((successfulTransactions / totalTransactions) * 100)
        : 0;

    return NextResponse.json({
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      pendingTransactions,
      totalVolume,
      totalFees,
      totalMerchants,
      successRate,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}