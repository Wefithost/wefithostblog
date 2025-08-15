import { useMemo } from 'react';
import { ITopic } from '~/types/topic';
import TopicCard from './cards/topic-card/topic-card';

interface RelatedProps {
	header?: string;
	related_topics: ITopic[];
}

const RelatedTopicsSection = ({ header, related_topics }: RelatedProps) => {
	const shuffledTopics = useMemo(() => {
		if (!related_topics) return [];
		const copy = [...related_topics];
		return copy.sort(() => Math.random() - 0.5).slice(0, 3);
		// eslint-disable-next-line
	}, []);

	return (
		<aside className="flex w-full flex-col gap-5 max-2xl:gap-4  py-10 ">
			{header && (
				<h3 className="text-[28px] poppins-bold max-xl:text-xl">{header}</h3>
			)}
			<div className="grid grid-cols-3 max-2xs:flex max-2xs:flex-col  max-xl:grid-cols-2 max-dmd:grid-cols-1 gap-x-5 gap-y-8 max-xs:gap-2 ">
				{shuffledTopics.map((topic) => (
					<TopicCard key={topic._id} topic={topic} />
				))}
			</div>
		</aside>
	);
};

export default RelatedTopicsSection;

