import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  apiKey?: string;
  id: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  apiKey: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // allows multiple null values (for OAuth users before key generation)
  },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;