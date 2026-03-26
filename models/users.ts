import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin";
  apiKey: string;
  testApiKey: string;
  merchantStatus: "unverified" | "pending" | "approved" | "rejected";
  business?: {
    companyName: string;
    businessType: string;
    country: string;
    phone: string;
    website?: string;
    description?: string;
    registeredAt: Date;
  };
  rejectionReason?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    apiKey: {
      type: String,
      unique: true,
      default: () => "npk_live_" + crypto.randomBytes(24).toString("hex"),
    },
    testApiKey: {
      type: String,
      unique: true,
      default: () => "npk_test_" + crypto.randomBytes(24).toString("hex"),
    },
    merchantStatus: {
      type: String,
      enum: ["unverified", "pending", "approved", "rejected"],
      default: "unverified",
    },
    business: {
      companyName: { type: String },
      businessType: { type: String },
      country: { type: String },
      phone: { type: String },
      website: { type: String },
      description: { type: String },
      registeredAt: { type: Date, default: Date.now },
    },
    rejectionReason: { type: String },
    webhookUrl: { type: String },
    webhookSecret: {
      type: String,
      default: () => "whsec_" + crypto.randomBytes(32).toString("hex"),
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;