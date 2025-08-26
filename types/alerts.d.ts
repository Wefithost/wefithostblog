export interface alert_type {
	_id: string;
	type: string;
	triggered_by: {
		first_name: string;
		last_name: string;
		role: string;
	};
	link: {
		url: string;
		label: string;
	};
	message: string;
	status: string;
	seen_by: ISeenStatus[];
	createdAt: string;
}
interface ISeenStatus {
	admin: string;
	seen: boolean;
}

