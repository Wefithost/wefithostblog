import { useEffect, useRef, useState } from 'react';
import ClassicInput from '../../inputs/classic-input';

import { useAuthContext } from '~/app/context/auth-context';
import { apiRequest } from '~/utils/api-request';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CropImage from '../../crop-image';
import { IoImageSharp } from 'react-icons/io5';
import AsyncButton from '../../buttons/async-button';
import { IArticle } from '~/types/article';

interface editArticlePrompt {
	isVisible: boolean;
	isActive: boolean;
	ref: React.RefObject<HTMLDivElement | null>;
	togglePopup: () => void;
	setDisable: React.Dispatch<React.SetStateAction<boolean>>;
	articleToEdit: IArticle;
}
const EditArticlePrompt = ({
	isVisible,
	isActive,
	ref,
	togglePopup,
	setDisable,
	articleToEdit,
}: editArticlePrompt) => {
	const { user } = useAuthContext();
	const [title, setTitle] = useState('');
	const [desc, setDesc] = useState('');

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successful, setSuccessful] = useState(false);

	const [selecting, setSelecting] = useState(false);
	const [imageBlob, setImageBlob] = useState<Blob | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>('');
	const [imageUrl, setImageUrl] = useState<string | null>('');

	useEffect(() => {
		if (articleToEdit) {
			setTitle(articleToEdit.title || '');
			setDesc(articleToEdit.description || '');
			setImagePreview(articleToEdit?.image || '');
			setImageUrl(articleToEdit.image || '');
		}
	}, [articleToEdit]);
	const editArticle = async () => {
		if (!user) {
			return;
		}
		if (loading) {
			return;
		}
		if (desc.trim() === '') {
			setError('Description is required');
			return;
		}
		if (title.trim() === '') {
			setError('Title is required');
			return;
		}
		if (!imageUrl) {
			setError('An image is required');
			return;
		}
		setLoading(true);
		setError('');
		setDisable(true);
		const formData = new FormData();

		formData.append('adminId', user._id);
		formData.append('title', title);
		formData.append('description', desc);
		formData.append('uploaded_image', imageBlob as Blob);
		formData.append('article_id', articleToEdit?._id);
		await apiRequest({
			url: '/api/topics/edit-article',
			method: 'PATCH',
			body: formData,
			onSuccess: (response) => {
				setSuccessful(true);
				toast.success(response.message, {
					icon: <FaCheck color="white" />,
				});
				window.dispatchEvent(new CustomEvent('articlesUpdated'));
				window.dispatchEvent(new CustomEvent('refetchAdminArticles'));
				setTimeout(() => {
					togglePopup();
					cancelCreation();
					setSuccessful(false);
				}, 3000);
			},
			onError: (error) => {
				setError(error);
			},
			onFinally: () => {
				setLoading(false);
				setDisable(false);
			},
		});
	};
	const inputImageRef = useRef<HTMLInputElement | null>(null);
	const handleClickSelect = () => inputImageRef.current?.click();
	const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setSelecting(true);
		setError('');
		const reader = new FileReader();
		reader.onloadend = () => setImageUrl(reader.result as string);
		reader.readAsDataURL(file);
	};

	const cancelCreation = () => {
		togglePopup();

		setError('');
		setLoading(false);
		setSuccessful(false);

		setSelecting(false);
		setImageBlob(null);
	};
	return (
		isActive && (
			<div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
				{selecting ? (
					<CropImage
						selecting={selecting}
						setSelecting={setSelecting}
						ref={ref}
						setImagePreview={setImagePreview}
						setImageBlob={setImageBlob}
						imageUrl={imageUrl}
						setImageUrl={setImageUrl}
						aspectRatio={465 / 301}
					/>
				) : (
					<div
						className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-white   items-center font-normal     ${
							isVisible ? '' : 'mid-popup-hidden'
						}`}
						ref={ref}
					>
						<div className="flex items-center flex-col gap-0 w-full leading-none">
							<h1 className="text-2xl sf-bold text-center text-black">
								Edit article
							</h1>
						</div>
						<div className="flex flex-col gap-0 items-center justify-center w-full">
							{imagePreview ? (
								// eslint-disable-next-line
								<img src={imagePreview} alt="icon" className="w-full   " />
							) : (
								<IoImageSharp className="text-9xl  text-gray-500 object-cover" />
							)}
							<button
								className=" text-black link-style-dark text-xs"
								onClick={handleClickSelect}
							>
								{imageUrl ? 'Choose another' : 'Select Image'}
							</button>
						</div>
						<ClassicInput
							value={title}
							setValue={setTitle}
							error={error}
							setError={setError}
							placeholder="hosting"
							classname_override="!bg-lightGrey"
							autofocus={true}
							label="Title"
							name="title"
							errorContent="Title is required"
						/>
						<ClassicInput
							value={desc}
							setValue={setDesc}
							textarea
							error={error}
							classname_override="!bg-lightGrey !text-black !rounded-sm "
							setError={setError}
							placeholder="Everything hosting"
							errorContent="Description is required"
							name="desc"
						/>
						{error && <h1 className="text-xs text-center text-red">{error}</h1>}
						<div className="gap-2 flex w-full">
							<AsyncButton
								classname_override="!h-[40px] !rounded-md "
								action="Edit"
								disabled={!title || !desc || !imageUrl}
								loading={loading}
								success={successful}
								onClick={editArticle}
							/>
							<button
								className="bg-gray-600 text-center w-full  hover:outline outline-gray-600   !rounded-md text-sm text-white duration-150"
								onClick={cancelCreation}
								disabled={loading}
							>
								Cancel
							</button>

							<input
								type="file"
								accept="image/*"
								onChange={handleImageFileChange}
								ref={inputImageRef}
								className="hidden"
							/>
						</div>
					</div>
				)}
			</div>
		)
	);
};

export default EditArticlePrompt;

