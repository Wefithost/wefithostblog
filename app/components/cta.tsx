'use client';
import { useState } from 'react';
import ClassicInput from './inputs/classic-input';
import { apiRequest } from '~/utils/api-request';
import { toast } from 'react-toastify';
import AsyncButton from './buttons/async-button';
import { FaCheckCircle } from 'react-icons/fa';

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
				toast.success(res.message, {
					icon: <FaCheckCircle className="text-white text-2xl" />,
				});
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
		<section className="relative h-[400px] p-10 overflow-hidden max-2xs:p-5  bg-[#14122C]">
			<div className="flex gap-10 w-full max-md:flex-col relative items-center justify-center max-w-[1400px] h-full mx-auto z-[30]">
				<div className=" flex items-center w-full">
					<div className="flex flex-col gap-3 relative z-30 self-end w-full">
						<h2 className="text-[32px] max-lg:text-xl text-white poppins-bold">
							Subscribe to our newsletter
						</h2>
						<p className="max-w-[600px] text-white text-base font-semibold max-lg:text-sm max-sm:font-normal">
							Get the latest tips, updates, and insights on web hosting, website
							management, and digital tools — helping you build faster, smarter,
							and more secure online experiences.
						</p>
					</div>
				</div>
				<div className="flex gap-2  w-full flex-col">
					<div className="flex gap-2  w-full items-end justify-start relative">
						<ClassicInput
							value={email}
							setValue={setEmail}
							error={error}
							setError={setError}
							classname_override="!bg-white !text-black  !self-start max-xs:!w-full "
							errorContent={'Please enter a valid email address'}
							placeholder="Your email"
							aria-label="Email address for newsletter subscription"
							name="email"
						/>
						<AsyncButton
							action="Subscribe"
							classname_override="!w-[200px]"
							loading={subscribing}
							success={subscribeSuccess}
							onClick={subscribe}
						/>
					</div>
					{error && <span className="text-sm text-red-300">{error}</span>}
				</div>
			</div>
		</section>
	);
};

export default CtaSection;

