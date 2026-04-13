import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPaymentSession extends Document {
  // Session identity
  sessionId: string;
  status: "pending" | "completed" | "expired" | "failed";

  // Merchant
  merchantId: mongoose.Types.ObjectId;
  merchantName: string;
  mode: "live" | "test";

  // Payment details
  amount: number;
  currency: string;
  description?: string;

  // Customer info (optional, can be filled on checkout page)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;

  // URLs
  successUrl?: string;
  cancelUrl?: string;

  // Result
  transactionReference?: string;

  // Expiry
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
  
  merchantAmount: number;
  nexapayFee: number;
  grossAmount: number;
  providerFee: number;
  netAmount: number;
}

const PaymentSessionSchema: Schema<IPaymentSession> = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "completed", "expired", "failed"],
      default: "pending",
    },

    // Merchant
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    merchantName: { type: String, required: true },
    mode: { type: String, enum: ["live", "test"], required: true },

    // Payment details
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "XAF" },
    description: { type: String },

    // Customer
    customerName: { type: String },
    customerEmail: { type: String },
    customerPhone: { type: String },

    // URLs
    successUrl: { type: String },
    cancelUrl: { type: String },

    // Result
    transactionReference: { type: String },
 
    merchantAmount: { type: Number },
    nexapayFee: { type: Number },
    grossAmount: { type: Number },
    providerFee: { type: Number },
    netAmount: { type: Number },

    // Expiry — session expires after 1 hour
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

const PaymentSession: Model<IPaymentSession> =
  mongoose.models.PaymentSession ||
  mongoose.model<IPaymentSession>("PaymentSession", PaymentSessionSchema);

export default PaymentSession;