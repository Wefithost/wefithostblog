'use client';

import { FaCircle, FaPen } from 'react-icons/fa';
import { formatDate } from '~/utils/format-date';
import ArticleViewer from '~/app/rich-text-editor/viewer';
import { useParams } from 'next/navigation';
import { useAuthContext } from '~/app/context/auth-context';
import { useCallback, useEffect, useState } from 'react';
import { IArticle } from '~/types/article';
import { apiRequest } from '~/utils/api-request';
import Loader from '~/app/components/loader';
import { FaAngleRight } from 'react-icons/fa6';
import { usePopup } from '~/utils/toggle-popups';
import EditArticleContentPrompt from './components/edit-article-content-prompt';
const Article = () => {
	const { topic, article: article_param } = useParams();
	const { loading, user } = useAuthContext();
	const [article, setArticle] = useState<IArticle | null>(null);
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

	const {
		isActive: editArticleContentPrompt,
		isVisible: editArticleContentPromptVisible,
		ref: editArticleContentPromptRef,
		setDisableToggle: disableEditArticleContentPrompt,
		togglePopup: toggleEditArticleContentPrompt,
	} = usePopup();

	return (
		<main className=" flex flex-col mx-auto max-w-[1500px] min-h-screen w-full gap-10 py-12 px-8 max-md:py-6 max-md:gap-5 max-xs:px-5">
			<Loader fetching={fetching} error={errorFetching}>
				<section className="flex w-full flex-col gap-3 items-start">
					<div className="flex w-full  bg-[#14132b] rounded-2xl overflow-hidden max-md:flex-col  max-md:rounded-sm max-md:bg-transparent">
						{/* eslint-disable-next-line */}
						<img
							src={article?.image}
							className="min-h-[500px] max-h-[500px] max-lg:min-h-[400px]  max-lg:max-h-[400px] bg-[#ffffff] object-cover w-1/2 max-md:w-full max-md:min-h-[200px]  max-md:max-h-auto "
						/>
						<div className="flex items-start flex-col justify-between p-20 w-1/2 max-2xl:p-5 max-md:w-full  max-md:gap-1 max-md:bg-white max-md:p-0 max-md:py-2 ">
							<button className="bg-purple hover:bg-darkPurple text-white text-lg h-[40px] px-2.5 duration-150 rounded-sm max-md:text-sm max-md:h-[35px]">
								{article?.title}
							</button>
							<h1 className="text-[32px] poppins-bold  text-white max-lg:text-2xl max-md:text-black max-md:text-lg">
								{article?.title}
							</h1>
							<div className="flex gap-4 items-center text-lg  text-white max-md:text-black max-md:text-sm">
								<span>{formatDate(article?.createdAt as string)}</span>
								<FaCircle className="text-[10px] " />
								<span>{article?.duration} mins read</span>
							</div>
						</div>
					</div>
				</section>
				<section className="w-full gap-24 flex justify-end max-2xl:gap-12 max-xl:flex-col  max-xl:items-center">
					<div className="flex flex-col gap-10 max-w-[750px] w-full">
						<ArticleViewer content={article?.article} />
					</div>
					<div className="flex flex-col justify-between max-xl:flex-row  gap-5 max-md:flex-col">
						<div className="w-[450px] bg-white border-purple rounded-2xl  shrink-0 flex flex-col gap-4 items-center sticky top-10 shadow-lg p-4 max-xl:w-1/2 max-xl:static max-md:w-full max-xl:shadow-sm">
							<div className="flex flex-col gap-3 ">
								<h1 className="text-2xl poppins-bold flex gap-1">
									<FaPen /> Edit Article
								</h1>
								<p className="text-sm text-gray-600">
									To edit the article, select the specific part you want to
									change from the options below, then click Publish to apply
									your changes.
								</p>
								<span className=" text-gray-700 text-xs ">
									Note: For an article to be published, certain fields are
									required — title, description, cover image, duration
									(generated automatically), and actual content.
								</span>
							</div>
							<div className="flex gap-1 flex-col w-full font-normal">
								<button
									className="flex items-center justify-between w-full hover:bg-purple-50 border border-gray-100 p-2  rounded-md  h-[50px] text-sm"
									onClick={toggleEditArticleContentPrompt}
								>
									<h1>Edit Content</h1>
									<FaAngleRight />
								</button>
								<div className="flex items-center justify-between w-full hover:bg-purple-50 border border-gray-100 p-2  rounded-md  h-[50px]">
									<h1>Edit Content</h1>
									<FaAngleRight />
								</div>
								<div className="flex items-center justify-between w-full hover:bg-purple-50 border border-gray-100 p-2  rounded-md  h-[50px]">
									<h1>Edit Content</h1>
									<FaAngleRight />
								</div>
							</div>
						</div>
					</div>
				</section>
			</Loader>
			<EditArticleContentPrompt
				editArticleContentPromptRef={editArticleContentPromptRef}
				editArticleContentPrompt={editArticleContentPrompt}
				editArticleContentPromptVisible={editArticleContentPromptVisible}
				disableEditArticleContentPrompt={disableEditArticleContentPrompt}
				toggleEditArticleContentPrompt={toggleEditArticleContentPrompt}
				article={article as IArticle}
			/>
		</main>
	);
};

export default Article;

