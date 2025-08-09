'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePopup } from '~/lib/utils/toggle-popups';
import more from '~/public/icons/moreWhite.svg';
import pen from '~/public/icons/pen.svg';
import bin from '~/public/icons/bin.svg';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { apiRequest } from '~/lib/utils/api-request';
import EditGroup from './edit-group';
import DeleteGroup from './delete-group';
const GroupCard = (props: any) => {
   const {
      isVisible: promptVisible,
      isActive: prompt,
      togglePopup: togglePrompt,
      ref: promptRef,
   } = usePopup();
   const {
      isVisible: editGroupVisible,
      isActive: editGroup,
      togglePopup: toggleEditGroup,
   } = usePopup();
   const {
      isVisible: deleteGroupVisible,
      isActive: deleteGroup,
      togglePopup: toggleDeleteGroup,
      ref: deleteGroupRef,
   } = usePopup();
   const { room_admin } = useParams();
   const [error, setError] = useState('');
   const [groupEdit, setGroupEdit] = useState('');
   const [groupId, setGroupId] = useState('');
   const [submitting, setSubmitting] = useState(false);

   const [sucessful, setSucessful] = useState(false);
   const [file, setFile] = useState<File | null>(null);
   const [imageUrl, setImageUrl] = useState<string | null>(null);
   const handleEditGroup = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const check = !(groupEdit && groupId && imageUrl);
      if (check) {
         setError('All fields are required.');
         return;
      }

      setSubmitting(true);

      const formData = new FormData();
      formData.append('image', file as any);
      formData.append('content', groupEdit);
      formData.append('categoryId', room_admin as any);
      formData.append('groupId', groupId);
      await apiRequest({
         url: '/api/admin/edit-group',
         method: 'PATCH',
         body: formData,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('customRoomsUpdate'));
            window.dispatchEvent(new CustomEvent('dataUpdated'));
            setSucessful(true);
            setImageUrl(null);
            setTimeout(() => toggleEditGroup(), 1000);
         },
         onError: (error) => {
            setError(error);
         },
         onFinally: () => {
            setSubmitting(false);
            setTimeout(() => setSucessful(false), 2000);
         },
      });
   };
   const handleDeleteGroup = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      if (!groupId) {
         setError('Group Id not found');
         return;
      }
      setSubmitting(true);
      await apiRequest({
         url: '/api/admin/delete-group',
         method: 'DELETE',
         body: { categoryId: room_admin, groupId: groupId },

         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('customRoomsUpdate'));
            window.dispatchEvent(new CustomEvent('dataUpdated'));
            setSucessful(true);
            setTimeout(() => toggleDeleteGroup(), 1000);
         },
         onError: (error) => {
            setError(error);
         },
         onFinally: () => {
            setSubmitting(false);
            setTimeout(() => setSucessful(false), 2000);
         },
      });
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
         setFile(selectedFile);

         const reader = new FileReader();
         reader.onloadend = () => {
            setImageUrl(reader.result as string);
         };
         reader.readAsDataURL(selectedFile);
      }
   };
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const handleClick: any = () => {
      if (fileInputRef.current) {
         fileInputRef.current.click();
      }
   };

   const editGroupProps = {
      editGroupVisible,
      editGroup,
      toggleEditGroup,
      error,
      groupEdit,
      setGroupEdit,
      submitting,
      setError,
      imageUrl,
      sucessful,
      handleClick,
      handleFileChange,
      handleEditGroup,
      fileInputRef,
   };

   const deleteGroupProps = {
      deleteGroup,
      deleteGroupRef,
      deleteGroupVisible,
      toggleDeleteGroup,
      handleDeleteGroup,
      submitting,
      sucessful,
   };
   return (
      <>
         <Link
            href={`/admin/products/${room_admin}/${props._id}`}
            className="relative  h-[350px]   w-[330px] shrink-0  overflow-hidden flex flex-col  gap-2  opacity bg-white  hover:shadow-md  duration-300  md:w-[260px]  md:h-[230px] md:gap-0  xs:w-full  xs:h-auto "
            onClick={(e) => {
               if (e.defaultPrevented) return;
            }}
         >
            <button
               className={`flex items-center justify-center p-1 bg-[#0000005c] hover:ring ring-softGreen  hover:ring-[1px] duration-150  rounded-full absolute top-4 right-4 z-10   ${
                  prompt && 'ring-[1px]'
               }`}
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePrompt();
                  setGroupEdit(props?.content);
                  setImageUrl(props?.image);
                  setGroupId(props?._id);
               }}
            >
               <Image src={more} alt="" className="w-4" />
            </button>
            {prompt && (
               <div
                  className={`flex  flex-col bg-white shadow-lg  w-[130px] rounded-md   duration-150 absolute top-4 right-12 divide-y divide-lightGrey overflow-hidden border border-lightGrey z-20   ${
                     promptVisible ? 'opacity-100' : 'opacity-0 '
                  }`}
                  ref={promptRef}
               >
                  <button
                     className="py-2 w-full text-[13px] neue-light text-grey flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleEditGroup();
                     }}
                  >
                     <Image src={pen} className="w-3" alt="" />
                     <span>Edit group</span>
                  </button>
                  <button
                     className="py-2 w-full text-[13px] neue-light text-grey flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDeleteGroup();
                     }}
                  >
                     <Image src={bin} className="w-3" alt="" />
                     <span>Delete group</span>
                  </button>
               </div>
            )}
            <div className="max-h-[310px]  w-full overflow-hidden  xs:max-h-full  xs:h-full  ">
               <img
                  src={props?.image}
                  alt=""
                  className="min-w-full h-full object-cover relative z-[5]   hover:scale-[1.1]  duration-[3s] ease 
         min-h-[330px] md:min-h-[200px] xs:min-h-full   xs:min-w-auto "
               />
            </div>
            <h1 className="text-lg  uppercase neue-light  spaced line-clamp-1 px-4 xs:text-base xs:px-2 ">
               {props?.content}
            </h1>
         </Link>
         <EditGroup {...editGroupProps} />
         <DeleteGroup {...deleteGroupProps} />
      </>
   );
};

export default GroupCard;
