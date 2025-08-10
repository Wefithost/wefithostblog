// ~/lib/models/user.ts
import mongoose, { Schema, model, Types, Document, Model } from "mongoose";

interface IUser extends Document {
  email: string;
  password?: string;
  first_name: string;
  last_name?: string;
  profile?: string;
  verification_hash?: string;
  oauth_provider?: string;
  recent_articles: Types.ObjectId[];
  role: string;
  job_name?: string;
  notifications: Types.ObjectId[]; 
  bio?: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
    profile: { type: String, required: false },
    bio: { type: String, required: false },
    recent_articles: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
    ],
    job_name: { type: String, required: false },
    role: { type: String, required: false, enum: ["admin", "member","super_admin"], default: 'member' },
    password: { type: String },
    verification_hash: { type: String },
    oauth_provider: { type: String },
    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
    ],
  },
  { timestamps: true }
);

const User:Model<IUser> = mongoose.models.User || model<IUser>("User", userSchema);

export default User;
export type { IUser };
