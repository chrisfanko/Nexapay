import mongoose, { Document, Model, Schema } from "mongoose";

export type TransactionStatus = "complete" | "failed" | "pending";
export type PaymentChannel =
  | "Orange Money"
  | "MTN Mobile Money"
  | "PayPal"
  | "Visa"
  | "Mastercard";
export type PaymentProvider = "notchpay" | "paypal" | "stripe";

export interface ITransaction extends Document {
  // Identity
  reference: string;
  provider: PaymentProvider;
  channel: PaymentChannel;
  status: TransactionStatus;
  currency: string;

  // Amounts
  merchantAmount: number;   
  nexapayFee: number;       
  grossAmount: number;      
  providerFee: number;      
  netAmount: number;        

  // Customer
  customerName: string;
  customerPhone?: string;

  // Failure
  failureReason?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new mongoose.Schema(
  {
    // Identity
    reference: { type: String, required: true, unique: true },
    provider: {
      type: String,
      enum: ["notchpay", "paypal", "stripe"],
      required: true,
    },
    channel: {
      type: String,
      enum: ["Orange Money", "MTN Mobile Money", "PayPal", "Visa", "Mastercard"],
      required: true,
    },
    status: {
      type: String,
      enum: ["complete", "failed", "pending"],
      required: true,
      default: "pending",
    },
    currency: { type: String, required: true, default: "XAF" },

    // Amounts
    merchantAmount: { type: Number, required: true },
    nexapayFee: { type: Number, required: true },
    grossAmount: { type: Number, required: true },
    providerFee: { type: Number, required: true, default: 0 },
    netAmount: { type: Number, required: true },

    // Customer
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: false },

    // Failure
    failureReason: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;