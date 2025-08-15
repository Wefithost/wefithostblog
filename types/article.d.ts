import { JSONContent } from '@tiptap/react';
export interface IArticle {
	_id: string;

	topic: {
		title: string;
		_id: string;
	};
	duration: string;
	description: string;
	createdAt: string;
	article: JSONContent;
	author: {
		_id: string;
		first_name: string;
		last_name: string;
		profile: string;
		bio: string;
	};
	image: string;
	slug: string;
	title: string;
	description: string;
	article: JSONContent;
}

