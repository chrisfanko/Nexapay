import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo_db";
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
    // 3. Fetch all merchants (non-admin users)
    const merchants = await User.find({ role: "user" })
      .select("-password") // never return passwords
      .sort({ createdAt: -1 });

    return NextResponse.json({ merchants });
  } catch (error) {
    console.error("Admin merchants error:", error);
    return NextResponse.json(
      { error: "Failed to fetch merchants" },
      { status: 500 }
    );
  }
}