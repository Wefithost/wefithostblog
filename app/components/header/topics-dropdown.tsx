import Image from 'next/image';
import Link from 'next/link';
import { FaAngleDown } from 'react-icons/fa';
import { useTopicsContext } from '~/app/context/topics-context';

import { usePopup } from '~/utils/toggle-popups';
import loadingIcon from '~/public/icons/spin-purple.svg';
import { useParams } from 'next/navigation';
const TopicsDropdown = () => {
	const { topic: topic_param } = useParams();
	const {
		isActive: dropdown,
		isVisible: dropdownVisible,
		togglePopup: toggleDropdown,
		ref: dropdownRef,
	} = usePopup();
	const { topics, isFetching, error } = useTopicsContext();
	return (
		<div className="relative">
			<button
				className="flex items-center gap-2 duration-150 link-style-dark"
				onClick={toggleDropdown}
			>
				<span>Topics</span>
				<FaAngleDown
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
	);
};

export default TopicsDropdown;

