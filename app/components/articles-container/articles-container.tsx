'use client';
import FilterBar from '../filter-bar';
import React, { useState } from 'react';
import EmptyState from '../empty-state';
import { IArticle } from '~/types/article';
import { useTopicsContext } from '../../context/topics-context';
import { ArticleGrid } from './articles-grid';

interface containerProps {
	showFilters?: boolean;
	query?: string;
	admin?: boolean;
	pagedArticles: IArticle[];
	totalArticles: number;
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
	pageSize: number;
}

const ArticlesContainer = ({
	showFilters = true,
	pagedArticles,
	totalArticles,
	admin = false,
	currentPage,
	setCurrentPage,
	pageSize = 9,
}: containerProps) => {
	const [activeFilter, setActiveFilter] = useState('all');
	const [selectedSort, setSelectedSort] = useState('newest');
	const { topics } = useTopicsContext();
	const filteredArticles =
		(() => {
			const filtered = pagedArticles?.filter((article) => {
				// If 'all' is selected, keep all articles
				if (activeFilter === 'all') return true;

				// Only keep articles with a matching topic (case-insensitive)
				return (
					article?.topic.title?.toLowerCase() === activeFilter.toLowerCase()
				);
			});
			console.log('filtered', filtered);
			// Sort the filtered list
			return filtered?.slice().sort((a, b) => {
				const dateA = new Date(a?.createdAt ?? 0).getTime();
				const dateB = new Date(b?.createdAt ?? 0).getTime();
				console.log('date A', dateA);
				console.log('date b', dateB);
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
	const hasArticles = pagedArticles && pagedArticles.length > 0;
	const isFiltered = activeFilter !== 'all';
	console.log(noResults);

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
					articles={pagedArticles}
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
							articles={searchedArticles}
							totalArticles={totalArticles}
							currentPage={currentPage}
							pageSize={pageSize}
							onPageChange={setCurrentPage}
							admin={admin}
						/>
					</div>
				) : (
					<EmptyState message={`No articles found for ${searchTerm}`} />
				)
			) : isFiltered ? (
				hasFilteredResults ? (
					<ArticleGrid
						articles={filteredArticles}
						totalArticles={totalArticles}
						currentPage={currentPage}
						pageSize={pageSize}
						onPageChange={setCurrentPage}
						admin={admin}
					/>
				) : (
					<EmptyState message="No articles match your filters" />
				)
			) : hasArticles ? (
				<ArticleGrid
					articles={filteredArticles}
					totalArticles={totalArticles}
					currentPage={currentPage}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					admin={admin}
				/>
			) : (
				<EmptyState message="No articles available" />
			)}
		</section>
	);
};

export default ArticlesContainer;

