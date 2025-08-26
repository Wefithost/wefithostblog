'use client';

import { FaCircle } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
import { useParams } from 'next/navigation';
import { useAuthContext } from '~/app/context/auth-context';
import { useCallback, useEffect, useState } from 'react';
import { IArticle } from '~/types/article';
import { apiRequest } from '~/utils/api-request';
import Loader from '~/app/components/loader';
import type { JSONContent } from '@tiptap/react';
import { getReadingTime } from '~/utils/get-reading-time';
import EditSection from './components/edit-section';
const Article = () => {
	const { topic, article: article_param } = useParams();
	const { loading, user } = useAuthContext();
	const [article, setArticle] = useState<IArticle | null>(null);
	const [articleContent, setArticleContent] = useState<JSONContent | undefined>(
		article?.article,
	);
	const [fetching, setFetching] = useState(true);
	const [errorFetching, setErrorFetching] = useState('');

	const fetchArticle = useCallback(async () => {
		setErrorFetching('');
		if (loading) return;

		if (!user) {
			setErrorFetching('User not authenticated');
			return;
		}

		await apiRequest({
			url: `/api/topics/${topic}/${article_param}`,
			method: 'GET',
			onSuccess: (res) => {
				setArticle(res.selectedArticle);
				setArticleContent(res.selectedArticle.article);
			},
			onError: (error) => {
				setErrorFetching(error);
			},
			onFinally: () => {
				setFetching(false);
			},
		});
	}, [loading, user, topic, article_param]);

	useEffect(() => {
		fetchArticle();

		const handleTopicsFetched = () => {
			fetchArticle();
		};

		window.addEventListener('articleUpdated', handleTopicsFetched);

		return () => {
			window.removeEventListener('articleUpdated', handleTopicsFetched);
		};
	}, [fetchArticle]);

	return (
		<main className=" flex flex-col mx-auto max-w-[1500px] min-h-screen w-full gap-10 py-12 px-8 max-md:py-6 max-md:gap-5 max-xs:px-5">
			<Loader fetching={fetching} error={errorFetching}>
				<section className="flex w-full flex-col gap-3 items-start">
					<div className="flex w-full  bg-[#14132b] rounded-2xl overflow-hidden max-md:flex-col  max-md:rounded-sm max-md:bg-transparent">
						<div className="relative w-1/2 max-md:w-full">
							{/* eslint-disable-next-line */}
							<img
								src={article?.image}
								className="min-h-[500px] max-h-[500px] max-lg:min-h-[400px]  max-lg:max-h-[400px] bg-[#ffffff] object-cover w-full  max-md:w-full max-md:min-h-[200px]  max-md:max-h-auto "
							/>
							<button className="bg-purple hover:bg-darkPurple text-white text-lg h-[40px] px-2.5 duration-150 rounded-sm max-md:text-sm max-md:h-[35px] absolute bottom-4 left-4 z-10 hidden max-md:block">
								{article?.topic.title}
							</button>
						</div>
						<div className="flex items-start flex-col justify-between p-20 w-1/2 max-2xl:p-5 max-md:w-full  max-md:gap-1 max-md:bg-white max-md:p-0 max-md:py-2 ">
							<button className="bg-purple hover:bg-darkPurple text-white text-lg h-[40px] px-2.5 duration-150 rounded-sm max-md:hidden max-md:h-[35px]">
								{article?.topic.title}
							</button>
							<h1 className="text-[32px] poppins-bold  text-white max-lg:text-2xl max-md:text-black max-md:text-lg">
								{article?.title}
							</h1>
							<p className="text-lg  text-white  max-md:text-black max-md:text-sm">
								{article?.description}
							</p>
							<div className="flex gap-4 items-center text-lg  text-white max-md:text-black max-md:text-sm">
								<span>{formatDate(article?.createdAt as string)}</span>
								<FaCircle className="text-[10px] " />
								<span>
									{(article?.article && getReadingTime(article?.article)) ||
										'2'}{' '}
									mins read
								</span>
							</div>
						</div>
					</div>
				</section>

				<EditSection
					articleContent={articleContent}
					article={article}
					setArticleContent={setArticleContent}
				/>
			</Loader>
		</main>
	);
};

export default Article;

