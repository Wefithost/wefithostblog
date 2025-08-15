'use client';
import Fuse from 'fuse.js';
import { SetStateAction } from 'react';
import { IArticle } from '~/types/article';
import { ITopic } from '~/types/topic';
interface filterProps {
	activeFilter: string;
	setActiveFilter: React.Dispatch<SetStateAction<string>>;
	articles: IArticle[] | null;
	searchTerm: string;
	setSearchTerm: React.Dispatch<SetStateAction<string>>;

	setSearchResults: React.Dispatch<SetStateAction<IArticle[]>>;

	setNoResults: React.Dispatch<SetStateAction<boolean>>;
	selectedSort: string;
	setSelectedSort: React.Dispatch<SetStateAction<string>>;
	topics: ITopic[] | null;
	showFilters: boolean;
}
const FilterBar = ({
	activeFilter,
	setActiveFilter,
	articles,
	searchTerm,
	setSearchTerm,
	setSearchResults,
	setNoResults,
	selectedSort,
	setSelectedSort,
	topics,
	showFilters,
}: filterProps) => {
	const handleSearch = (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			setNoResults(false);
			return;
		}

		const fuse = new Fuse(articles ?? [], {
			keys: ['title', 'description'], // Fields to search
			threshold: 0.3,
			includeScore: true,
		});

		const results = fuse.search(query).map((result) => result.item); // Extract matched items

		if (results.length === 0) {
			setNoResults(true);
		} else {
			setNoResults(false);
		}

		setSearchResults(results);
	};

	const handleSearchChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const query = event.target.value;
		setSearchTerm(query);
		handleSearch(query);
	};

	const sorts = ['newest', 'oldest'];
	return (
		<div
			className={`flex items-center  gap-2 flex-wrap  max-lg:flex-col-reverse max-lg:gap-3 ${
				showFilters ? ' justify-between' : ' justify-end'
			}`}
		>
			{showFilters && (
				<div className="flex items-center gap-3 max-2xl:gap-1  max-lg:justify-self-start max-lg:self-start">
					<>
						<button
							onClick={() => setActiveFilter('all')}
							className={`capitalize text-lg h-[33px] px-3 rounded-sm duration-150 max-2xl:text-sm max-xs:px-2 max-xs:h-[30px] max-xs:text-xs ${
								'all' === activeFilter
									? 'bg-purple text-white '
									: 'hover:bg-lightGrey'
							}`}
						>
							all
						</button>
						{topics &&
							topics.map((data) => (
								<button
									key={data._id}
									onClick={() => setActiveFilter(data.title)}
									className={`capitalize text-lg h-[33px] px-3 rounded-sm duration-150 max-2xl:text-sm max-xs:px-2 max-xs:h-[30px] max-xs:text-xs ${
										data.title === activeFilter
											? 'bg-purple text-white '
											: 'hover:bg-lightGrey'
									}`}
								>
									{data?.title}
								</button>
							))}
					</>
				</div>
			)}
			<div className="flex  gap-4 max-2xl:gap-2 max-lg:justify-self-end max-lg:self-end  max-lg:w-full max-lg:justify-between">
				<input
					className={`  py-1 px-3 bg-grey  text-black   text-sm    focus:ring-[1px]    ring-purple    outline-none w-[350px]  duration-150 rounded-sm bg-lightGrey max-2xl:w-[250px] max-lg:w-[70%]
pr-8
            `}
					placeholder="Search for an article"
					value={searchTerm}
					onChange={(e) => {
						handleSearchChange(e);
					}}
					// onKeyDown={handleKeyDown}
				/>
				<div className="flex gap-1 bg-lightGrey rounded-sm p-1 max-2xl:text-sm">
					{sorts.map((sort) => (
						<button
							key={sort}
							className={`flex items-center gap-2  border h-[40px] px-2 rounded-sm border-lightGrey text-center text-sm duration-150  ${
								selectedSort === sort
									? 'bg-white text-black shadow-sm '
									: 'hover:text-black text-[#464646]'
							}`}
							onClick={() => setSelectedSort(sort)}
						>
							{sort}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default FilterBar;

