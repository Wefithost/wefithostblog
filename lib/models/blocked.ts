// ~/lib/models/blocked.ts
import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';

interface IBlocked extends Document {
	ip_address?: string;
	reason?: string;
	blocked_by: Types.ObjectId;
	blocked: Types.ObjectId;
}

const blockedSchema = new Schema<IBlocked>(
	{
		reason: { type: String, required: true },
		ip_address: { type: String, required: false, default: null },
		blocked_by: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: false,
			default: null,
		},
		blocked: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: false,
			default: null,
		},
	},
	{ timestamps: true },
);

const Blocked: Model<IBlocked> =
	mongoose.models.blocked || model<IBlocked>('blocked', blockedSchema);

export default Blocked;
export type { IBlocked };

