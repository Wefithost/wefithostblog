export interface blocked_type {
	_id: string;
	ip_address?: string;
	reason?: string;
	blocked_by: {
		first_name: string;
		last_name: string;
	};
	createdAt: Date | string;
	updatedAt: Date;
	blocked: {
		first_name: string;
		last_name: string;
		email: string;
	};
}

