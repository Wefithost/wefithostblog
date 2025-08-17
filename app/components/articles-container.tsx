'use client';
import ArticleCard from './cards/article-card/article-card';
import FilterBar from './filter-bar';
import React, { useEffect, useRef, useState } from 'react';
import EmptyState from './empty-state';
import { IArticle } from '~/types/article';
import { useTopicsContext } from '../context/topics-context';
import { apiRequest } from '~/utils/api-request';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

interface containerProps {
	showFilters?: boolean;
	articles: IArticle[] | null;
}

const ArticlesContainer = ({
	showFilters = true,
	articles,
}: containerProps) => {
	const [activeFilter, setActiveFilter] = useState('all');
	const [selectedSort, setSelectedSort] = useState('newest');
	const { topics } = useTopicsContext();
	const filteredArticles =
		(() => {
			const filtered = articles?.filter((article) => {
				// If 'all' is selected, keep all articles
				if (activeFilter === 'all') return true;

				// Only keep articles with a matching topic (case-insensitive)
				return (
					article?.topic.title?.toLowerCase() === activeFilter.toLowerCase()
				);
			});

			// Sort the filtered list
			return filtered?.slice().sort((a, b) => {
				const dateA = new Date(a?.createdAt ?? 0).getTime();
				const dateB = new Date(b?.createdAt ?? 0).getTime();

				switch (selectedSort) {
					case 'newest':
						return dateB - dateA;
					case 'oldest':
						return dateA - dateB;
					default:
						return 0;
				}
			});
		})() ?? [];

	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<IArticle[]>([]);
	const [noResults, setNoResults] = useState(false);
	const searchedArticles = searchTerm ? searchResults : [];
	const hasSearch = searchTerm.trim().length > 0;
	const hasSearchResults = searchedArticles.length > 0;
	const hasFilteredResults = filteredArticles && filteredArticles.length > 0;
	const hasArticles = articles && articles.length > 0;
	const isFiltered = activeFilter !== 'all';
	console.log(noResults);

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9; // articles per page

	const [pagedArticles, setPagedArticles] = useState<IArticle[]>([]);
	const [totalArticles, setTotalArticles] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchPage = async () => {
			setFetching(true);
			setError('');
			await apiRequest({
				url: `/api/fetch-articles?skip=${
					(currentPage - 1) * pageSize
				}&limit=${pageSize}`,
				method: 'GET',
				onSuccess: (res) => {
					setPagedArticles(res.response);
					setTotalArticles(res.articlesLength);
				},
				onError: (error) => {
					setError(error);
				},
				onFinally: () => {
					setFetching(false);
				},
			});
		};

		fetchPage();
	}, [currentPage]);

	return (
		<section
			className="flex w-full flex-col gap-8 max-2xl:gap-4 bg-white"
			id="articles-section"
		>
			{/* loader for  */}
			<div className="w-full">
				<FilterBar
					activeFilter={activeFilter}
					setActiveFilter={setActiveFilter}
					articles={articles}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					setSearchResults={setSearchResults}
					setNoResults={setNoResults}
					selectedSort={selectedSort}
					setSelectedSort={setSelectedSort}
					topics={topics}
					showFilters={showFilters}
				/>
			</div>
			{hasSearch ? (
				hasSearchResults ? (
					<div className="flex w-full items-center flex-col gap-4 ">
						<h1 className=" text-lg font-semibold spaced self-start">
							Found {searchedArticles.length}{' '}
							{searchedArticles?.length > 1 ? 'articles' : 'article'} for `
							{searchTerm}`
						</h1>
						<ArticleGrid
							articles={pagedArticles}
							totalArticles={totalArticles}
							currentPage={currentPage}
							pageSize={pageSize}
							onPageChange={setCurrentPage}
						/>
					</div>
				) : (
					<EmptyState message={`No articles found for ${searchTerm}`} />
				)
			) : isFiltered ? (
				hasFilteredResults ? (
					<ArticleGrid
						articles={pagedArticles}
						totalArticles={totalArticles}
						currentPage={currentPage}
						pageSize={pageSize}
						onPageChange={setCurrentPage}
					/>
				) : (
					<EmptyState message="No articles match your filters" />
				)
			) : hasArticles ? (
				<ArticleGrid
					articles={pagedArticles}
					totalArticles={totalArticles}
					currentPage={currentPage}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
				/>
			) : (
				<EmptyState message="No articles available" />
			)}
		</section>
	);
};

export default ArticlesContainer;
interface gridProps {
	articles: IArticle[] | null;
	totalArticles: number;
	currentPage: number;
	pageSize: number;
	onPageChange: (page: number) => void;
}

export const ArticleGrid = ({
	articles,
	totalArticles,
	currentPage,
	pageSize,
	onPageChange,
}: gridProps) => {
	const totalPages = Math.ceil(totalArticles / pageSize);
	const scrollToArticles = () => {
		const element = document.getElementById('articles-section');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const navigate = (to: number) => {
		scrollToArticles();
		if (to < 1 || to > totalPages) return;

		onPageChange(to);
	};
	return (
		<div className="w-full flex-col items-center gap-8 duration-300">
			<div className="grid grid-cols-3 max-2xs:flex max-2xs:flex-col max-xl:grid-cols-2 max-md:grid-cols-1 gap-x-5 gap-y-8 max-xs:gap-2  w-full">
				{articles &&
					articles.map((article) => (
						<ArticleCard key={article._id} article={article} />
					))}
			</div>

			{/* pagination should be here */}
			<div className="flex gap-2 justify-center mt-10">
				<button
					onClick={() => {
						navigate(currentPage - 1);
					}}
					className={`px-2 py-2 rounded-md  ${
						currentPage === 1
							? ' text-gray-500'
							: 'bg-white text-black hover:bg-gray-200'
					}`}
				>
					<MdKeyboardArrowLeft />
				</button>

				{Array.from({ length: totalPages }, (_, i) => i + 1)
					.filter(
						(page) =>
							page === 1 || // always show first
							page === totalPages || // always show last
							(page >= currentPage - 2 && page <= currentPage + 2), // show range around current
					)
					.map((page, index, arr) => {
						// Check if we need to add ellipsis before/after
						const prevPage = arr[index - 1];

						return (
							<React.Fragment key={page}>
								{prevPage && page - prevPage > 1 && (
									<span className="px-2">...</span>
								)}

								<button
									onClick={() => {
										scrollToArticles();
										onPageChange(page);
									}}
									className={`px-4 py-2 rounded-md text-sm ${
										page === currentPage
											? 'bg-purple text-white'
											: 'bg-white text-black hover:bg-gray-200'
									}`}
								>
									{page}
								</button>
							</React.Fragment>
						);
					})}
				<button
					onClick={() => {
						navigate(currentPage + 1);
					}}
					className={`px-2 py-2 rounded-md  ${
						currentPage === totalPages
							? ' text-gray-500 cursor-not-allowed'
							: 'bg-white text-black hover:bg-gray-200'
					}`}
				>
					<MdKeyboardArrowRight />
				</button>
			</div>
		</div>
	);
};

