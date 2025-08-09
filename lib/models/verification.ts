import mongoose, { Schema, Document, Model } from "mongoose";

interface IVerification extends Document {
  email: string;
  hashed_code: string;
  password: string;
     first_name: string;
    last_name: string;
  createdAt: Date;
  oauth_provider?: string;
}

const verificationSchema: Schema<IVerification> = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    hashed_code: { type: String, required: true },
    password: { type: String, required: true },
        first_name: { type: String, required: true, unique: false },
    last_name: { type:String, required: false},
    oauth_provider: { type: String, required: false },
    createdAt: { type: Date, default: Date.now, expires: "1h" },
  },
  { timestamps: true }
);

const verification: Model<IVerification> =
  mongoose.models.Verification ||
  mongoose.model<IVerification>("Verification", verificationSchema);

export default verification;
export type { IVerification };
