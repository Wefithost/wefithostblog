'use client';
import { useState } from 'react';
import ClassicInput from './inputs/classic-input';
import { apiRequest } from '~/lib/utils/api-request';
import { toast } from 'react-toastify';
import AsyncButton from './buttons/async-button';
import Image from 'next/image';
import newsletter from '~/public/images/newsletter.jpg';
import smoke from '~/public/images/smoke.jpg';
import websiteonline from '~/public/images/phone-hold.jpg';
import space from '~/public/images/Data-Centers-in-Space.jpg';
import { articles } from '~/data/articles';
const CtaSection = () => {
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
	return (
		<section className="flex gap-4 w-full max-md:flex-col">
			<div className="flex flex-col gap-4 w-1/2 max-md:w-full">
				<div className="min-h-[300px] relative overflow-hidden py-8 px-4  rounded-[10px] flex items-center max-xs:min-h-[200px]">
					<div className="w-full h-full absolute z-[20] object-cover top-0 left-0 bg-[#0000005e]"></div>
					<div className="flex flex-col gap-3 relative z-30 self-end w-full">
						<h1 className="text-[32px] max-lg:text-xl text-white font-semibold">
							Subscribe to our newsletter
						</h1>
						<div className="flex gap-2 flex-col w-full items-start justify-start">
							<ClassicInput
								value={email}
								setValue={setEmail}
								error={error}
								setError={setError}
								classname_override="!bg-white !text-black !w-[80%] !self-start max-xs:!w-full "
								errorContent={'Please enter a valid email address'}
								placeholder="Your email"
							/>
							<AsyncButton
								action="Subscribe"
								classname_override="!w-[200px]"
								loading={subscribing}
								success={subscribeSuccess}
								disabled={!email}
								onClick={subscribe}
							/>
						</div>
					</div>
					<Image
						src={newsletter}
						alt="newsletter"
						className="w-full h-full absolute z-10 object-cover top-0 left-0"
					/>
				</div>
				<div className="min-h-[300px] relative overflow-hidden py-8 px-4  rounded-[10px] flex items-center max-md:hidden">
					{/* <div className="w-full h-full absolute z-[20] object-cover top-0 left-0 bg-[#0000005e]"></div> */}
					<div className="flex flex-col gap-3 relative z-30 self-end w-full">
						<h1 className="text-[32px] max-lg:text-xl text-white font-semibold">
							{articles.length} articles available
						</h1>
					</div>
					<Image
						src={smoke}
						alt="newsletter"
						className="w-full h-full absolute z-10 object-cover top-0 left-0"
					/>
				</div>
			</div>
			<div className="flex flex-col w-1/2 relative overflow-hidden py-8 px-4  rounded-[10px] items-start justify-end  max-md:w-full min-h-[300px] max-md:justify-center max-md:px-10 max-2xs:px-3 max-2xs:min-h-[250px]">
				<div className="w-full h-full absolute z-[20] object-cover top-0 left-0 bg-[#0000005e]"></div>
				<div className="flex flex-col gap-3 relative z-30 self-end w-full items-start max-md:items-center max-2xs:items-start">
					<h1 className="text-[32px] max-lg:text-xl text-white font-semibold max-md:text-center max-md:poppins-bold change-font  max-2xs:text-start max-2xs:text-lg">
						Get your website online in minutes with our premium hosting
						solutions.
					</h1>
					<button className="bg-purple hover:bg-darkPurple text-white text-lg h-[45px] px-5 duration-150 rounded-sm max-2xs:h-[40px]  max-2xs:text-sm max-2xs:font-semibold ">
						Get Started
					</button>
				</div>
				<Image
					src={websiteonline}
					alt="newsletter"
					className="w-full h-full absolute z-10 object-cover top-0 left-0 max-md:hidden"
				/>

				<Image
					src={space}
					alt="newsletter"
					className="w-full h-full absolute z-10 object-cover top-0 left-0 max-md:block hidden"
				/>
			</div>
		</section>
	);
};

export default CtaSection;

