import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {  FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import loadingIcon from '~/public/icons/spin-purple.svg';
import { useTopicsContext } from '~/app/context/topics-context';
import { usePopup } from '~/utils/toggle-popups';
import { TfiAngleDown } from 'react-icons/tfi';

const Breadcrumbs = () => {
	const { topic: topic_param } = useParams();
	const {
		isActive: dropdown,
		isVisible: dropdownVisible,
		togglePopup: toggleDropdown,
		ref: dropdownRef,
	} = usePopup();

	const { topics, isFetching, error } = useTopicsContext();
	const [currentTopic, setCurrentTopic] = useState(topic_param || '');

	return (
		<div className="flex items-center gap-2 py-1 px-1 rounded-full bg-lightGrey">
			<div className="bg-gray-200 flex items-center rounded-full p-1">
				<button className=" p-1 text-gray-700 text-base hover:bg-gray-300 duration-150 rounded-full">
					<FaAngleLeft />
				</button>
				<button className="p-1 text-gray-700 text-base hover:bg-gray-300 duration-150 rounded-full">
					<FaAngleRight />
				</button>
			</div>

			<div className="relative">
				<button
					className="flex items-center gap-2 duration-150 link-style-dark"
					onClick={toggleDropdown}
				>
					<span className="text-xs uppercase">{currentTopic}</span>
					<TfiAngleDown
						className={`duration-150 ${dropdownVisible ? 'rotate-180' : ''}`}
					/>
				</button>
				{dropdown && (
					<div
						className={`w-[200px]        py-4 px-2  flex flex-col       duration-300 absolute top-8 left-0    shadow-2xl  rounded-lg text-[16px] z-40 bg-white border-lightGrey border ${
							dropdownVisible ? 'opacity-100' : 'opacity-0'
						}`}
						ref={dropdownRef}
					>
						{error ? (
							<span className="text-xs">An error occurred</span>
						) : isFetching ? (
							<div className="flex w-full h-[180px] bg-white items-center justify-center">
								<Image src={loadingIcon} className="w-10" alt="loading" />
							</div>
						) : topics && topics.length > 0 ? (
							topics.map((topic) => (
								<Link
									href={`/topics/${topic.title}`}
									key={topic?.title}
									onClick={() => setCurrentTopic(topic.title)}
									className={`py-1.5 text-start px-2 duration-150 uppercase ${
										topic.title === topic_param
											? 'bg-purple-100 text-black'
											: 'hover:bg-[#f1f1f4] '
									}`}
								>
									{topic?.title}
								</Link>
							))
						) : (
							<span className="text-xs">No topics yet</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Breadcrumbs;

