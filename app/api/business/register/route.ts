import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongo_db";
import User from "@/models/users";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const { companyName, businessType, country, phone, website, description } =
      await req.json();

    if (!companyName || !businessType || !country || !phone) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.merchantStatus === "approved") {
      return NextResponse.json(
        { error: "Your business is already approved" },
        { status: 400 }
      );
    }

    if (user.merchantStatus === "pending") {
      return NextResponse.json(
        { error: "Your application is already under review" },
        { status: 400 }
      );
    }

    // Generate API key for OAuth users who don't have one yet
    if (!user.apiKey) {
      user.apiKey = "npk_live_" + crypto.randomBytes(24).toString("hex");
    }

    user.business = {
      companyName,
      businessType,
      country,
      phone,
      website: website || "",
      description: description || "",
      registeredAt: new Date(),
    };
    user.merchantStatus = "pending";

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Business registration error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}