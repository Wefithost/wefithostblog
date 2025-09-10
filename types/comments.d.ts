export interface comment_type {
	_id: string;
	article_id: string;
	parent_id: string;
	comment: string;
	comment_by: {
		_id: string;
		first_name: string;
		last_name: string;
		profile: string;
		guest?: boolean;
	};
	ip_address?: string;
	replies: comment_type[];
	createdAt: string;
	updatedAt: string;
}

