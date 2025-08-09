'use client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FaCircle, FaEnvelope } from 'react-icons/fa';
import { articles } from '~/lib/data/articles';
import { formatDate } from '~/utils/format-date';
import { slugify } from '~/utils/slugify';
import logo from '~/public/icons/logo-icon.png';
import ClassicInput from '../components/inputs/classic-input';
import { apiRequest } from '~/utils/api-request';
import { toast } from 'react-toastify';
import { useState } from 'react';
import AsyncButton from '../components/buttons/async-button';
import Link from 'next/link';
import ArticleViewer from '../rich-text-editor/viewer';
import RelatedArticlesSection from '../components/related-articles';
const Article = () => {
	const params = useParams();
	const { title } = params;

	const article = articles.find((article) => slugify(article?.title) === title);
	const [email, setEmail] = useState('');

	const [subscribing, setSubscribing] = useState(false);
	const [error, setError] = useState('');
	const [subscribeSuccess, setSubscribeSuccess] = useState(false);
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const subscribe = async () => {
		if (subscribing) {
			return;
		}
		if (email.trim() === '') {
			setError('Email required');
			return;
		}
		if (!isValidEmail(email.trim().toLowerCase())) {
			setError('Please enter a valid email address');
			return;
		}
		setSubscribing(true);
		setError('');

		await apiRequest({
			url: '/api/subscribe',
			method: 'POST',
			body: { email },
			onSuccess: (res) => {
				toast.success(res.message);
				setSubscribeSuccess(true);
				setTimeout(() => setSubscribeSuccess(true), 3000);
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setSubscribing(false);
			},
		});
	};

	const related_articles = articles?.filter(
		(type) => slugify(type?.title) !== title,
	);
	return (
		<main className=" flex flex-col mx-auto max-w-[1500px] min-h-screen w-full gap-10 py-12 px-8 max-md:py-6 max-md:gap-5 max-xs:px-5">
			<section className="flex w-full flex-col gap-3 items-start">
				<div className="flex w-full  bg-[#14132b] rounded-2xl overflow-hidden max-md:flex-col  max-md:rounded-sm max-md:bg-transparent">
					{/* eslint-disable-next-line */}
					<img
						src={article?.img}
						className="min-h-[500px] max-h-[500px] max-lg:min-h-[400px]  max-lg:max-h-[400px] bg-[#ffffff] object-cover w-1/2 max-md:w-full max-md:min-h-[200px]  max-md:max-h-auto "
					/>
					<div className="flex items-start flex-col justify-between p-20 w-1/2 max-2xl:p-5 max-md:w-full  max-md:gap-1 max-md:bg-white max-md:p-0 max-md:py-2 ">
						<button className="bg-purple hover:bg-darkPurple text-white text-lg h-[40px] px-2.5 duration-150 rounded-sm max-md:text-sm max-md:h-[35px]">
							{article?.topic}
						</button>
						<h1 className="text-[32px] poppins-bold  text-white max-lg:text-2xl max-md:text-black max-md:text-lg">
							{article?.title}
						</h1>
						<div className="flex gap-4 items-center text-lg  text-white max-md:text-black max-md:text-sm">
							<span>{formatDate(article?.date as string)}</span>
							<FaCircle className="text-[10px] " />
							<span>{article?.duration} mins read</span>
						</div>
					</div>
				</div>
			</section>
			<section className="w-full gap-24 flex justify-end max-2xl:gap-12 max-xl:flex-col  max-xl:items-center">
				<div className="flex flex-col gap-10 max-w-[750px]">
					<ArticleViewer content={article?.article} />
				</div>
				<div className="flex flex-col justify-between max-xl:flex-row  gap-5 max-md:flex-col">
					<div className="w-[450px] bg-white border-purple rounded-2xl  shrink-0 flex flex-col gap-4 items-center justify-between sticky top-20 shadow-sm p-4 max-xl:w-1/2 max-xl:static max-md:w-full">
						<Image src={logo} alt="wefithost logo" className="w-28" />
						<h1 className="text-lg poppins text-center">About our blog</h1>
						<p className="text-center text-base text-gray-500">
							Welcome to WeFitHost Insights where we share expert knowledge to
							help you succeed in the hosting world.
						</p>
						<Link
							href="/"
							className="bg-purple hover:bg-darkPurple text-white  h-[40px] px-2.5 duration-150 rounded-sm w-full text-center flex items-center justify-center text-sm font-semibold"
						>
							Learn about us
						</Link>
					</div>

					<div className="w-[450px] bg-white border-purple rounded-2xl  shrink-0 flex flex-col gap-4 items-center justify-between sticky top-10 shadow-lg p-4 max-xl:w-1/2 max-xl:static max-md:w-full max-xl:shadow-sm">
						<FaEnvelope className="text-4xl text-purple " />
						<h1 className="text-lg poppins text-center">
							Subscribe to our newsletter
						</h1>
						<p className="text-center">
							Get the latest hosting tips and business insights
						</p>
						<div className="flex gap-2 flex-col w-full items-start justify-start">
							<ClassicInput
								value={email}
								setValue={setEmail}
								error={error}
								setError={setError}
								classname_override="!bg-lightGrey !text-black !w-full !self-start"
								errorContent={'Please enter a valid email address'}
								placeholder="Your email"
							/>
							<AsyncButton
								action="Subscribe"
								classname_override="!w-full"
								loading={subscribing}
								success={subscribeSuccess}
								disabled={!email}
								onClick={subscribe}
							/>
						</div>
						<span className="text-xs ">
							We&apos;ll never share your email. Unsubscribe anytime.
						</span>
					</div>
				</div>
			</section>
			<RelatedArticlesSection
				related_articles={related_articles}
				header="You might also like…"
			/>
		</main>
	);
};

export default Article;

