import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/connect-mongo';
import User from '~/lib/models/user';
import Topic from '~/lib/models/topic';
import Article from '~/lib/models/article';
import Alert from '~/lib/models/alerts';
import NewsletterSubscription from '~/lib/models/newsletter_subscriptions';
import { mailOptions, transporter } from '~/lib/nodemailer';

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ topic: string; article: string }> },
) {
	try {
		await connectMongo();

		const { topic, article } = await params;
		const { adminId } = await req.json();

		// Validate IDs
		if (!isValidObjectId(adminId)) {
			return NextResponse.json(
				{ error: 'Admin Id not provided or invalid' },
				{ status: 400 },
			);
		}

		// Check admin
		const admin = await User.findById(adminId);
		if (!admin) {
			return NextResponse.json(
				{ error: 'No account was found with this Id' },
				{ status: 404 },
			);
		}
		if (admin.role === 'member') {
			return NextResponse.json(
				{ error: 'Only admins can perform this action' },
				{ status: 403 },
			);
		}

		// Validate topic
		const selectedTopic = await Topic.findOne({ slug: topic });
		if (!selectedTopic) {
			return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
		}

		// Validate article
		const existingArticle = await Article.findOne({ slug: article });
		if (!existingArticle) {
			return NextResponse.json({ error: 'Article not found' }, { status: 404 });
		}

		// Update article content
		existingArticle.published = !existingArticle.published;
		await existingArticle.save();
		await Alert.create({
			type: 'article_published',
			message: `${
				existingArticle.published ? 'published' : 'unpublished'
			} an article: ${existingArticle?.title}`,
			triggered_by: admin?._id,
			link: {
				url: `/topics/${selectedTopic?.slug}/${existingArticle?.slug}`,
				label: 'Published article',
			},
			status: 'info',
		});
		const message = existingArticle.published
			? 'Article published successfully'
			: 'Article unpublished successfully';

		if (existingArticle.published) {
			const subscribers = await NewsletterSubscription.find({}, 'email');
			const subscriberEmails = subscribers.map((sub) => sub.email);

			if (subscriberEmails.length > 0) {
				const articleUrl = `https://blog.wefithost.com/topics/${selectedTopic.slug}/${existingArticle.slug}`;
				const htmlContent = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%"
    style="background-color: #FFFFFF; font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <tr>
        <td align="center" style="padding: 40px 10px; ">
            <table cellpadding="0" cellspacing="0" width="100%"
                style="max-width: 500px; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid gainsboro">
                <!-- Header / Logo -->
                <tr>
                    <td align="center" style="background-color: #f1f1f4; padding: 25px;">
                        <img src="https://res.cloudinary.com/dl6pa30kz/image/upload/v1756039608/logo_hdvqjb_1_1_u8ljxj.png"
                            alt="WeFitHost Logo" width="200" style="display: block;" />
                    </td>
                </tr>

                <!-- Article Image -->
                <tr>
                    <td align="center" style="padding: 20px;">
                        <img src="${
													existingArticle?.image ||
													'https://via.placeholder.com/500x300'
												}" alt="${(
					existingArticle?.title || 'WeFitHost Blog Article'
				).replace(
					/" /g,
					'&quot;',
				)}" width="500" style="max-width: 95%; height: auto;" />
                    </td>
                </tr>

                <!-- Article Content -->
                <tr>
                    <td style="padding: 0 30px 30px;">
                        <h2 style="font-size: 14px; color: #939393; margin-bottom: 10px;">
                            A new article just dropped!
                        </h2>
                        <h3 style="font-size: 22px; color: rgb(0 0 0); margin-bottom: 10px;">
                            ${
															existingArticle?.title ||
															'New Article on WeFitHost Blog'
														}
                        </h3>
                        <p style="font-size: 14px; line-height: 22px; color: #000000; margin: 0 0 20px;">
                            ${(
															existingArticle?.description ||
															'Discover new insights, stories, and updates from WeFitHost Blog.'
														)
															.replace(/\n/g, ' ')
															.replace(/"/g, '&quot;')}
                        </p>

                        <div style=" margin-bottom: 20px;">
                            <a href="${articleUrl}" target="_blank" rel="noopener noreferrer"
                                style="background-color: #6B63FF; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; display: inline-block;">
                                Read Full Article
                            </a>
                        </div>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center" style="padding: 20px; background-color: #f1f1f4;">
                        <p style="font-size: 12px; color: #000000; margin: 0;">
                            You’re receiving this email because you subscribed to <strong>WeFitHost Blog</strong>.
                        </p>
                        <p style="font-size: 12px; color: #000000; margin: 5px 0 0;">
                            © WeFitHost ${new Date().getFullYear()} | All Rights Reserved
                        </p>
                    </td>



                </tr>
                <tr>
                    <td align="center" style="background-color: #f1f1f4; padding-bottom: 10px;">
                        <p style="font-size: 12px; color: #999;">
                            You’re receiving this because you subscribed to WeFitHost Blog updates.<br>
                            <a href="https://blog.wefithost.com/unsubscribe?email={{userEmail}}"
                                style="color: #d9534f; text-decoration: underline;">
                                Unsubscribe
                            </a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`;

				await transporter.sendMail({
					...mailOptions,

					bcc: subscriberEmails,
					from: process.env.EMAIL,
					subject: 'A new article just dropped!',
					html: htmlContent,
				});
			}
		}

		return NextResponse.json(
			{
				message,
			},

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

