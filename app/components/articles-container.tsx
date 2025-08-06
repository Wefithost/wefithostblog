'use client';
import { articles } from '~/data/articles';
import ArticleCard from './cards/article-card';
import FilterBar from './filter-bar';
import { useState } from 'react';
import EmptyState from './empty-state';
import { IArticle } from '~/types/articles';

const ArticlesContainer = () => {
	const [activeFilter, setActiveFilter] = useState('all');
	const [selectedSort, setSelectedSort] = useState('newest');
	const filteredArticles = (() => {
		const filtered = articles?.filter((article) => {
			// If 'all' is selected, keep all articles
			if (activeFilter === 'all') return true;

			// Only keep articles with a matching topic (case-insensitive)
			return article?.topic?.toLowerCase() === activeFilter.toLowerCase();
		});

		// Sort the filtered list
		return filtered?.slice().sort((a, b) => {
			const dateA = new Date(a?.date ?? 0).getTime();
			const dateB = new Date(b?.date ?? 0).getTime();

			switch (selectedSort) {
				case 'newest':
					return dateB - dateA;
				case 'oldest':
					return dateA - dateB;
				default:
					return 0;
			}
		});
	})();

	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<IArticle[]>([]);
	const [noResults, setNoResults] = useState(false);
	const searchedArticles = searchTerm ? searchResults : [];
	return (
		<section className="flex w-full flex-col gap-8 max-2xl:gap-4 ">
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
				/>
			</div>
			{searchTerm.trim() ? (
				searchTerm && !noResults && searchedArticles.length > 0 ? (
					<div className="flex w-full items-center flex-col gap-4 ">
						<h1 className=" text-lg font-semibold spaced self-start">
							Found {searchedArticles.length}{' '}
							{searchedArticles?.length > 1 ? 'articles' : 'article'} for `
							{searchTerm}`
						</h1>
						<div className="grid grid-cols-3 max-2xs:flex max-2xs:flex-col  max-xl:grid-cols-2 max-dmd:grid-cols-1 gap-x-5 gap-y-8 max-xs:gap-2 ">
							{searchedArticles.map((article) => (
								<ArticleCard key={article.id} article={article} />
							))}
						</div>
					</div>
				) : (
					<EmptyState message={`No articles found for ${searchTerm}`} />
				)
			) : activeFilter !== 'all' && filteredArticles.length > 0 ? (
				<div className="grid grid-cols-3 max-2xs:flex max-2xs:flex-col  max-xl:grid-cols-2 max-dmd:grid-cols-1 gap-x-5 gap-y-8 max-xs:gap-2 ">
					{filteredArticles.map((article) => (
						<ArticleCard key={article.id} article={article} />
					))}
				</div>
			) : activeFilter !== 'all' ? (
				<EmptyState message="No articles match your filters" />
			) : articles.length > 0 ? (
				<div className="grid grid-cols-3 max-2xs:flex max-2xs:flex-col  max-xl:grid-cols-2 max-dmd:grid-cols-1 gap-x-5 gap-y-8 max-xs:gap-2 ">
					{filteredArticles.map((article) => (
						<ArticleCard key={article.id} article={article} />
					))}
				</div>
			) : (
				<EmptyState message="No articles available" />
			)}
		</section>
	);
};

export default ArticlesContainer;

