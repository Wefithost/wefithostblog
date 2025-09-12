// ~/lib/models/user.ts
import mongoose, { Schema, model, Document, Model } from 'mongoose';

interface IUser extends Document {
	email: string;
	password?: string;
	first_name: string;
	last_name?: string;
	profile?: string;
	verification_hash?: string;
	oauth_provider?: string;
	role: string;
	bio?: string;
	ip_address?: string;
}

const userSchema = new Schema<IUser>(
	{
		email: { type: String, required: true, unique: true },
		first_name: { type: String, required: true },
		last_name: { type: String, required: false },
		profile: { type: String, required: false },
		bio: { type: String, required: false },
		role: {
			type: String,
			required: false,
			enum: ['admin', 'member', 'super_admin'],
			default: 'member',
		},
		password: { type: String },
		verification_hash: { type: String },
		oauth_provider: { type: String },
		ip_address: { type: String, required: false, default: null },
	},
	{ timestamps: true },
);

const User: Model<IUser> =
	mongoose.models.User || model<IUser>('User', userSchema);

export default User;
export type { IUser };

