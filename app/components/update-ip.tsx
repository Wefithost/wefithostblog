// components/UpdateIp.tsx
'use client';
import { useEffect } from 'react';
import { useAuthContext } from '../context/auth-context';
import { useUtilsContext } from '../context/utils-context';
import { apiRequest } from '~/utils/api-request';

export default function UpdateIp() {
	const { user } = useAuthContext();
	const { ip } = useUtilsContext();

	useEffect(() => {
		if (!user) {
			return;
		}
		if (!ip || ip.trim() === '') {
			return;
		}

		const handleUpdate = async () => {
			await apiRequest({
				url: '/api/auth/update-ip',
				method: 'POST',
				body: { userId: user?._id, userIp: ip },
			});
		};

		handleUpdate();
	}, [user, ip]);

	return null;
}

