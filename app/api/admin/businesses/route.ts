import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo_db";
import User from "@/models/users";

// GET — list all business applications
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
    const status = searchParams.get("status") || "all";

    const query: Record<string, unknown> =
      status === "all"
        ? { merchantStatus: { $ne: "unverified" } }
        : { merchantStatus: status };

    const businesses = await User.find(query)
      .select("-password")
      .sort({ "business.registeredAt": -1 });

    return NextResponse.json({ businesses });
  } catch (error) {
    console.error("Admin businesses error:", error);
    return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 });
  }
}

// POST — approve or reject a business
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

    const { userId, action, rejectionReason } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const merchant = await User.findById(userId);
    if (!merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    if (action === "approve") {
      merchant.merchantStatus = "approved";
      merchant.rejectionReason = undefined;
    } else if (action === "reject") {
      merchant.merchantStatus = "rejected";
      merchant.rejectionReason = rejectionReason || "Application rejected";
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await merchant.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin business action error:", error);
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}