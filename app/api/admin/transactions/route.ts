import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo_db";
import Transaction from "@/models/transaction";
import User from "@/models/users";

export async function GET(req: NextRequest) {
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
    // 3. Get filters from query params
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const channel = searchParams.get("channel");
    const provider = searchParams.get("provider");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // 4. Build query
    const query: Record<string, unknown> = {};
    if (status && status !== "all") query.status = status;
    if (channel && channel !== "all") query.channel = channel;
    if (provider && provider !== "all") query.provider = provider;
    if (search) query.reference = { $regex: search, $options: "i" };

    // 5. Fetch paginated transactions
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
    console.error("Admin transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}