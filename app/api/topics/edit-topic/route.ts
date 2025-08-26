import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import cloudinary from 'cloudinary';
import User from '~/lib/models/user';
import Topic from '~/lib/models/topic';
import { slugify } from '~/utils/slugify';
import Alert from '~/lib/models/alerts';

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(req: NextRequest) {
	try {
		await connectMongo();

		const formData = await req.formData();
		const adminId = formData.get('adminId');
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const uploaded_image = formData.get('uploaded_image');
		const topic = formData.get('topic');

		// Validate IDs
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		if (!isValidObjectId(topic)) {
			return NextResponse.json(
				{ error: 'Topic Id not provided or invalid' },
				{ status: 400 },
			);
		}

		if (!title?.trim()) {
			return NextResponse.json({ error: 'Title is required' }, { status: 400 });
		}

		if (!description?.trim()) {
			return NextResponse.json(
				{ error: 'Description is required' },
				{ status: 400 },
			);
		}

		// Check admin role
		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'No account found with this Id' },
				{ status: 404 },
			);
		}

		if (admin.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins can perform this action' },
				{ status: 403 },
			);
		}

		// Find topic to update
		const existingTopic = await Topic.findById(topic);
		if (!existingTopic) {
			return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
		}

		// Handle image upload (if provided)
		let imageUrl = existingTopic.image;
		if (uploaded_image instanceof File && uploaded_image.size > 0) {
			const buffer = Buffer.from(await uploaded_image.arrayBuffer());
			const uploadResult = await new Promise<{ secure_url: string }>(
				(resolve, reject) => {
					const uploadStream = cloudinary.v2.uploader.upload_stream(
						{ folder: 'wefithost_articles' },
						(error, result) => {
							if (error) {
								reject(new Error(error.message || 'Upload failed'));
							} else {
								resolve(result as { secure_url: string });
							}
						},
					);
					uploadStream.end(buffer);
				},
			);
			imageUrl = uploadResult.secure_url;
		}

		// Update topic
		existingTopic.title = title;
		existingTopic.description = description;
		existingTopic.slug = slugify(title);
		existingTopic.image = imageUrl;

		await existingTopic.save();
		await Alert.create({
			type: 'topic_edited',
			message: `edited a topic: '${title}'`,
			triggered_by: admin._id,
			link: {
				url: `/topics/${existingTopic.slug}`,
				label: 'View topic',
			},
			status: 'edit',
		});
		return NextResponse.json(
			{ message: 'Topic updated successfully' },
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'A server error occurred' },
			{ status: 500 },
		);
	}
}

