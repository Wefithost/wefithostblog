'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { ITopic } from '~/types/topic';
import { useFetch } from '~/utils/fetch-page-data';

interface TopicsContextType {
	topics: ITopic[] | null;
	isFetching: boolean;
	error: string;
	refetch: () => Promise<void>;
}
export const TopicsContext = createContext<TopicsContextType | null>(null);

export const TopicsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const {
		fetchedData: topics,
		isFetching,
		error,
		refetch,
	} = useFetch<ITopic[]>({
		basePath: `/api/topics`,
		ids: [],
		eventKey: 'articlesUpdated',
		// enabled: !!user && !loading,
		//  deps:[loading,user]
	});

	const providerValue = useMemo(
		() => ({
			topics,
			isFetching,
			error,
			refetch,
		}),
		[topics, isFetching, error, refetch],
	);

	return (
		<TopicsContext.Provider value={providerValue}>
			{children}
		</TopicsContext.Provider>
	);
};

export const useTopicsContext = (): TopicsContextType => {
	const context = useContext(TopicsContext);
	if (!context) {
		throw new Error('Context must be used within a Provider');
	}
	return context;
};

