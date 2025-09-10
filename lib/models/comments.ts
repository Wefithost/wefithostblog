import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import type { JSONContent } from '@tiptap/react';

export interface IComment extends Document {
	article_id: Types.ObjectId;
	parent_id: Types.ObjectId;
	comment: JSONContent;
	comment_by: Types.ObjectId;
	ip_address?: string;
}

const CommentSchema: Schema<IComment> = new Schema(
	{
		article_id: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
		parent_id: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
		comment: {
			type: Schema.Types.Mixed,
			required: false,
			default: null,
		},
		comment_by: { type: Schema.Types.ObjectId, ref: 'User', required: false },
		ip_address: { type: String, required: false, default: null },
	},
	{ timestamps: true },
);

const CommentModel: Model<IComment> =
	mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export default CommentModel;

