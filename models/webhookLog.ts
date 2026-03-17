import mongoose, { Document, Model, Schema } from "mongoose";

export interface IWebhookLog extends Document {
  userId: mongoose.Types.ObjectId;
  transactionReference: string;
  webhookUrl: string;
  event: string;
  payload: object;
  status: "success" | "failed";
  statusCode?: number;
  responseBody?: string;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const WebhookLogSchema: Schema<IWebhookLog> = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    transactionReference: { type: String, required: true },
    webhookUrl: { type: String, required: true },
    event: { type: String, required: true },
    payload: { type: Object, required: true },
    status: { type: String, enum: ["success", "failed"], required: true },
    statusCode: { type: Number },
    responseBody: { type: String },
    attempts: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const WebhookLog: Model<IWebhookLog> =
  mongoose.models.WebhookLog ||
  mongoose.model<IWebhookLog>("WebhookLog", WebhookLogSchema);

export default WebhookLog;