'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { IArticle } from '~/types/article';
import { formatDate } from '~/utils/format-date';
import { getReadingTime } from '~/utils/get-reading-time';
import { slugify } from '~/utils/slugify';

interface previewProps {
	articles: IArticle[] | null;
}
const HeroPreview = ({ articles }: previewProps) => {
	const [isHovered, setIsHovered] = useState(false);
	let rendered_articles;

	if (!articles || articles.length === 0) {
		rendered_articles = backup_data;
	} else {
		rendered_articles = articles;
	}
	const [currentIndex, setCurrentIndex] = useState(() => {
		if (!rendered_articles || rendered_articles.length === 0) return 0;
		return Math.floor(Math.random() * rendered_articles.length);
	});

	const [fadeOut, setFadeOut] = useState(false);

	useEffect(() => {
		if (!rendered_articles || rendered_articles.length === 0 || isHovered)
			return;

		const interval = setInterval(() => {
			setFadeOut(true); // start fade out

			setTimeout(() => {
				let newIndex = Math.floor(Math.random() * rendered_articles.length);

				// avoid repeating the same article
				while (rendered_articles.length > 1 && newIndex === currentIndex) {
					newIndex = Math.floor(Math.random() * rendered_articles.length);
				}

				setCurrentIndex(newIndex);
				setFadeOut(false); // start fade in
			}, 500); // match fade transition
		}, 2000); // every 20s

		return () => clearInterval(interval);
	}, [rendered_articles, currentIndex, isHovered]);

	const article = rendered_articles?.[currentIndex] ?? null;

	return (
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
					<span>
						{(article?.article && getReadingTime(article?.article)) || '2'} mins
						read
					</span>
				</div>
				<Link
					href={`/${slugify(article?.title as string)}`}
					className="link-style  text-lg max-2xl:text-base max-xl:text-sm"
				>
					Read more...
				</Link>
			</div>
		</section>
	);
};

export default HeroPreview;

const backup_data = [
	{
		_id: '68a3561ce3e3587a0679a6da',
		title: 'WordPress Hosting Optimization Guide',
		topic: {
			_id: '689cd4904bacf1c677fec353',
			title: 'Featured',
		},
		author: {
			_id: '689713a37d49f07172e6ad0b',
			first_name: 'Darlington',
			profile:
				'https://res.cloudinary.com/dl6pa30kz/image/upload/v1755011493/wefithost_blog_profiles/cf2liu64t5rjrsfguflv.png',
			last_name: 'John',
		},
		description:
			'Specialized techniques to optimize your servers for WordPress hosting.',
		image:
			'https://res.cloudinary.com/dl6pa30kz/image/upload/v1755504195/wefithost_articles/yqamh0clabsz10aznnjv.png',
		slug: 'wordpress-hosting-optimization-guide',
		featured: true,
		published: true,
		createdAt: '2025-08-22T08:03:15.879Z',
		updatedAt: '2025-08-19T14:19:49.831Z',
		__v: 0,
		article: {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'no content',
						},
					],
				},
			],
		},
	},
];

