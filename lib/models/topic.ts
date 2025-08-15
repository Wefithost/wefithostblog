import mongoose, { Schema, model, Document, Model } from 'mongoose';

interface ITopic extends Document {
	title: string;
	description: string;
	image: string;
	slug: string;
}

const TopicSchema = new Schema<ITopic>(
	{
		title: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		image: { type: String, required: true },
		slug: { type: String },
	},
	{ timestamps: true },
);

const Topic: Model<ITopic> =
	mongoose.models.Topic || model<ITopic>('Topic', TopicSchema);

export default Topic;
export type { ITopic };

