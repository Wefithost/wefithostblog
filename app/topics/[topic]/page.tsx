import { getTopic } from '~/utils/getTopic';
import { Metadata } from 'next';
import Topic from './topic';
type Props = {
	params: Promise<{
		topic: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const topicParam = await params;
	const topic = await getTopic(topicParam?.topic);

	if (!topic) {
		return {
			title: 'Topic not found',
			description: 'This topic does not exist.',
		};
	}

	const url = `https://blog.wefithost.com/${topicParam?.topic}`;

	return {
		title: `Articles on ${topic.title}`,
		description: topic.description,
		alternates: {
			canonical: 'https://blog.wefithost.com/',
		},
		openGraph: {
			title: `Articles on ${topic.title}`,
			description: topic.description,
			url,
			images: [
				{
					url: topic.image,
					width: 1200,
					height: 630,
					alt: `Articles on ${topic.title}`,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: `Articles on ${topic.title}`,
			description: topic.description,
			images: [topic.image],
		},
	};
}
const TopicPage = () => {
	return <Topic />;
};

export default TopicPage;

