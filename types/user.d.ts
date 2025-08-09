import { Types } from "mongoose";

export interface user_type {
  _id: string;
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
  createdAt: Date| string;
  updatedAt: Date;
}