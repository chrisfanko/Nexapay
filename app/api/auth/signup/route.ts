import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo_db";
import crypto from "crypto";

// Generates a unique NexaPay API key e.g. "npk_live_a1b2c3d4e5f6..."
function generateApiKey(): string {
  const random = crypto.randomBytes(24).toString("hex");
  return `npk_live_${random}`;
}

export async function POST(request: Request) {
  const { name, email, password, confirmPassword } = await request.json();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "Email not valid" },
      { status: 400 }
    );
  }
  if (confirmPassword !== password) {
    return NextResponse.json(
      { message: "Password do not match" },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password must be atleast 8 characters" },
      { status: 400 }
    );
  }
  if(!/\d/.test(password)){
    return NextResponse.json(
      {message: "Password must contain at least one number" },
      {status: 400}
    )

  }
  if(!/[!@#$%^&*(),.?":{}|<>]/.test(password)){
    return NextResponse.json(
      {message: "Password must contain at least one special character"},
      {status: 400}
    )
  }
  if(!/[A-Z]/.test(password)){
    return NextResponse.json(
      {message: "Password must contain at least one uppercase letter"},
      {status: 400}
    )
  }
  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "This User already exist" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Auto-generate a unique API key for  user
    const apiKey = generateApiKey();

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      apiKey,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User sucessfully created" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}