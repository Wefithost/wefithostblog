'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { IArticle } from '~/types/article';
import { useFetch } from '~/utils/fetch-page-data';
import { formatDate } from '~/utils/format-date';
import { slugify } from '~/utils/slugify';

const FeaturedArticlesPreview = () => {
	const { fetchedData: featured_articles, isFetching } = useFetch<IArticle[]>({
		basePath: `/api/fetch-articles/fetch-featured-articles`,
		ids: [],
		// dataKey: 'topicDetails',
	});

	const [isHovered, setIsHovered] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(() => {
		if (!featured_articles || featured_articles.length === 0) return 0;
		return Math.floor(Math.random() * featured_articles.length);
	});

	const [fadeOut, setFadeOut] = useState(false);

	useEffect(() => {
		if (!featured_articles || featured_articles.length === 0 || isHovered)
			return;

		const interval = setInterval(() => {
			setFadeOut(true); // start fade out

			setTimeout(() => {
				let newIndex = Math.floor(Math.random() * featured_articles.length);

				// avoid repeating the same article
				while (featured_articles.length > 1 && newIndex === currentIndex) {
					newIndex = Math.floor(Math.random() * featured_articles.length);
				}

				setCurrentIndex(newIndex);
				setFadeOut(false); // start fade in
			}, 500); // match fade transition
		}, 2000); // every 20s

		return () => clearInterval(interval);
	}, [featured_articles, currentIndex, isHovered]);

	const article = featured_articles?.[currentIndex] ?? null;

	return (
		!isFetching && (
			<section
				className={`flex min-h-[700px] max-h-[700px] w-full overflow-hidden relative items-end rounded-lg max-2xl:min-h-[500px]  max-2xl:max-h-[500px] max-md:min-h-[300px] max-md:max-h-[300px] duration-500`}
				style={{
					backgroundImage: `url(${article?.image})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div className="w-full h-full absolute z-[20] object-cover top-0 left-0 bg-[#00000077] "></div>
				{/*eslint-disable-next-line */}
				<img
					src={article?.image}
					alt="hero-img"
					className={`absolute top-0 left-0 w-full h-full object-cover z-2 duration-150 ${
						fadeOut ? 'opacity-0' : 'opacity-100'
					}`}
				/>
				<div className="flex flex-col gap-3 relative z-30 max-w-[900px] items-start p-8 py-16 max-lg:py-8 max-lg:max-w-full  max-xl:gap-2 max-md:px-4 text-white  max-2xs:py-4 font-semibold max-2xs:font-normal">
					<button className="bg-purple hover:bg-darkPurple text-white text-lg h-[40px] px-2.5 duration-150 rounded-sm max-md:h-[30px] max-md:text-sm">
						{article?.topic.title}
					</button>
					<h1 className="text-[32px] poppins-bold max-2xl:text-2xl max-xl:text-xl max-2xs:text-base  line-clamp-1">
						{article?.title}
					</h1>
					<p className="text-lg max-2xl:text-base max-xl:text-sm  line-clamp-1">
						{article?.description}
					</p>
					<div className="flex gap-4 items-center text-lg max-2xl:text-base max-xl:text-sm max-2xs:hidden">
						<span>{formatDate(article?.createdAt as string)}</span>
						<FaCircle className="text-[10px] " />
						<span>{article?.duration} mins read</span>
					</div>
					<Link
						href={`/${slugify((article?.title as string) || '')}`}
						className="link-style  text-lg max-2xl:text-base max-xl:text-sm"
					>
						Read more...
					</Link>
				</div>
			</section>
		)
	);
};

export default FeaturedArticlesPreview;

