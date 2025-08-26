import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import type { JSONContent } from '@tiptap/react';

export interface IComment extends Document {
	article_id: Types.ObjectId;
	parent_id: Types.ObjectId;
	comment: JSONContent;
	comment_by: Types.ObjectId;
}

const CommentSchema: Schema<IComment> = new Schema(
	{
		article_id: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
		parent_id: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
		comment: { type: Schema.Types.Mixed, required: true },
		comment_by: { type: Schema.Types.ObjectId, ref: 'User', required: false },
	},
	{ timestamps: true },
);

const CommentModel: Model<IComment> =
	mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export default CommentModel;

