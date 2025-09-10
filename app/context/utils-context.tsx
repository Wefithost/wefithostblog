'use client';
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { apiRequest } from '~/utils/api-request';
import { usePopup } from '~/utils/toggle-popups';

interface UtilsContextType {
	authPopup: boolean;
	authPopupVisible: boolean;
	authPopupRef: React.RefObject<HTMLDivElement | null>;
	toggleAuthPopup: () => void;
	setDisableToggle: React.Dispatch<React.SetStateAction<boolean>>;
	overlayOpen: boolean;
	setOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
	adminOverlayOpen: boolean;
	setAdminOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
	createArticlePopup: boolean;
	createArticlePopupVisible: boolean;
	createArticlePopupRef: React.RefObject<HTMLDivElement | null>;
	setDisableArticlePopup: React.Dispatch<React.SetStateAction<boolean>>;
	toggleCreateArticlePopup: () => void;
	rerenderKey: number;
	setRerenderKey: React.Dispatch<React.SetStateAction<number>>;
	currentAction: string;
	setCurrentAction: React.Dispatch<React.SetStateAction<string>>;
	resetPassword: boolean;
	setResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
	ip: string;
	setIp: React.Dispatch<React.SetStateAction<string>>;
}
export const UtilsContext = createContext<UtilsContextType | null>(null);

export const UtilsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const {
		isActive: authPopup,
		isVisible: authPopupVisible,
		ref: authPopupRef,
		togglePopup: toggleAuthPopup,
		setDisableToggle: setDisableToggle,
	} = usePopup();
	const [currentAction, setCurrentAction] = useState<string>('log-in');
	const [resetPassword, setResetPassword] = useState(false);
	const [overlayOpen, setOverlayOpen] = useState(false);
	const [adminOverlayOpen, setAdminOverlayOpen] = useState(false);
	const [rerenderKey, setRerenderKey] = useState(0);
	const {
		isActive: createArticlePopup,
		isVisible: createArticlePopupVisible,
		ref: createArticlePopupRef,
		togglePopup: toggleCreateArticlePopup,
		setDisableToggle: setDisableArticlePopup,
	} = usePopup();
	const [ip, setIp] = useState('');

	useEffect(() => {
		const fetchIp = async () => {
			await apiRequest({
				url: '/api/get-ip',
				method: 'GET',
				onSuccess: (data) => {
					setIp(data.ip);
				},
				onError: () => {
					console.log('Ip address not fetched');
				},
			});
		};

		fetchIp();
	}, []);

	const providerValue = useMemo(
		() => ({
			authPopup,
			authPopupRef,
			authPopupVisible,
			toggleAuthPopup,
			createArticlePopup,
			createArticlePopupRef,
			createArticlePopupVisible,
			toggleCreateArticlePopup,
			setDisableToggle,
			setDisableArticlePopup,
			overlayOpen,
			setOverlayOpen,
			setRerenderKey,
			rerenderKey,
			currentAction,
			setCurrentAction,
			resetPassword,
			setResetPassword,
			adminOverlayOpen,
			setAdminOverlayOpen,
			ip,
			setIp,
		}),
		[
			authPopup,
			authPopupRef,
			authPopupVisible,
			toggleAuthPopup,
			createArticlePopup,
			createArticlePopupRef,
			createArticlePopupVisible,
			toggleCreateArticlePopup,
			setDisableToggle,
			setDisableArticlePopup,
			overlayOpen,
			setOverlayOpen,
			setRerenderKey,
			rerenderKey,
			currentAction,
			setCurrentAction,
			resetPassword,
			setResetPassword,
			adminOverlayOpen,
			setAdminOverlayOpen,
			ip,
			setIp,
		],
	);

	return (
		<UtilsContext.Provider value={providerValue}>
			{children}
		</UtilsContext.Provider>
	);
};

export const useUtilsContext = (): UtilsContextType => {
	const context = useContext(UtilsContext);
	if (!context) {
		throw new Error('Context must be used within a Provider');
	}
	return context;
};

