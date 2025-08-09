'use client';
import { useParams } from 'next/navigation';

import { useEffect, useRef, useState } from 'react';
import PageWrapper from '../../components/page-wrapper';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
import plusIcon from '~/public/icons/plus.svg';
import Image from 'next/image';
import { apiRequest } from '~/lib/utils/api-request';
import { usePopup } from '~/lib/utils/toggle-popups';
import image from '~/public/icons/image.svg';
import folder from '~/public/icons/folder.svg';
import folderGrey from '~/public/icons/folderGrey.svg';
import GroupCard from '../components/cards/group-card/group-card';
import ClassicInput from '../components/inputs/classic-input';
import EmptyPrompt from '../components/empty-prompt';
const FurniturePage = () => {
   const [roomData, setRoomData] = useState<any>(null);
   const [fetching, setFetching] = useState(true);
   const [errorFetching, setErrorFetching] = useState(false);
   const { room_admin } = useParams();
   useEffect(() => {
      const fetchRoomData = async () => {
         try {
            const res = await fetch(`/api/admin/${room_admin}`);
            if (!res.ok) {
               setFetching(false);
               setErrorFetching(true);
               return;
            }
            const data = await res.json();
            setRoomData(data.adminFurniture);
         } catch (error) {
            setErrorFetching(true);
         } finally {
            setFetching(false);
         }
      };
      (async () => {
         await fetchRoomData().catch((error) =>
            console.error('Error fetching wishlist:', error)
         );
      })();
      const handleRoomFetched = () => {
         (async () => {
            await fetchRoomData().catch((error) =>
               console.error('Error', error)
            );
         })();
      };
      window.addEventListener('dataUpdated', handleRoomFetched);

      return () => {
         window.removeEventListener('dataUpdated', handleRoomFetched);
      };
   }, [room_admin]);
   const {
      isVisible: groupVisible,
      isActive: newGroup,
      togglePopup: toggleGroup,
   } = usePopup();
   const {
      isVisible: previewVisible,
      isActive: preview,
      togglePopup: togglePreview,
      ref: previewRef,
   } = usePopup();

   const [error, setError] = useState('');
   const [group, setGroup] = useState('');

   const [submitting, setSubmitting] = useState(false);
   const [sucessful, setSucessful] = useState(false);
   const [file, setFile] = useState<File | null>(null);
   const [imageUrl, setImageUrl] = useState<string | null>(null);
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

   const handleCreateGroup = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const groupId = room_admin;
      const check = !(file && group && groupId);
      if (check) {
         setError('All fields are required.');
         return;
      }

      setSubmitting(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('group', group);
      formData.append('groupId', room_admin as any);
      await apiRequest({
         url: '/api/admin/create-group',
         method: 'POST',
         body: formData,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('customRoomsUpdate'));
            window.dispatchEvent(new CustomEvent('dataUpdated'));
            setSucessful(true);
            setImageUrl(null);
            setFile(null);
            setTimeout(() => toggleGroup(), 1000);
            setGroup('');
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

   return (
      <section>
         <PageWrapper fetching={fetching} errorFetching={errorFetching}>
            <section className="flex flex-col gap-4 px-5 py-10 xs:px-3 xs:py-5">
               <div className="flex items-center justify-between  w-full sm:flex-col sm:gap-2 sm:items-start">
                  <h1 className="neue-thin text-3xl capitalize text-darkGrey md:text-2xl  sm:text-xl">
                     Product groups In {roomData?.content}:
                  </h1>

                  <button
                     className="flex items-center gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-2 sm:h-[35px] "
                     onClick={toggleGroup}
                  >
                     <Image src={plusIcon} alt="" className="w-3" />

                     <span className=" text-white uppercase  text-xs sm:capitalize ">
                        New Group
                     </span>
                  </button>
               </div>
               <div className="flex items-center  flex-wrap gap-5 ">
                  {roomData?.menu?.categories.length > 0 ? (
                     roomData?.menu.categories.map((data: any) => (
                        <GroupCard data={data} {...data} key={data?._id} />
                     ))
                  ) : (
                     <EmptyPrompt content="groups" />
                  )}
               </div>
            </section>
            {newGroup && (
               <div
                  className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
               >
                  <div
                     className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                        groupVisible ? '' : 'mid-popup-hidden'
                     }  ${
                        previewVisible ? ' brightness-75' : ' brightness-100'
                     }`}
                  >
                     <div className="flex flex-col gap-3 items-center w-full">
                        <div>
                           <h1 className="text-2xl louize text-center">
                              New Product group
                           </h1>
                           <h1 className="  text-sm neue-light text-center">
                              Create a new group to add similar products.
                           </h1>
                        </div>
                     </div>

                     <div className="flex flex-col gap-3  w-full ">
                        <div className="flex flex-col gap-4 ">
                           <ClassicInput
                              label="group"
                              errorContent="All fields are required."
                              autofocus={true}
                              setError={setError}
                              setValue={setGroup}
                              value={group}
                              placeholder="Chairs"
                              error={error}
                           />

                           <div className="relative flex gap-1 flex-col">
                              <span className="text-xs    neue    text-darkGrey  neue-light uppercase">
                                 PREVIEW
                              </span>
                              <div className="flex gap-2">
                                 <button
                                    onClick={togglePreview}
                                    disabled={imageUrl !== null}
                                    className={` px-4 h-[40px]        duration-300 flex items-center gap-1 neue-light  text-sm w-full  justify-center ${
                                       error === 'All fields are required.' &&
                                       !imageUrl
                                          ? 'border-red border'
                                          : `  ${
                                               imageUrl
                                                  ? ' bg-softGreen  text-white ring-softGreen '
                                                  : ' bg-white  text-grey  ring-grey ring-[1px]  hover:ring-[2px]  hover:ring-offset-1'
                                            }`
                                    }   
                                  `}
                                 >
                                    <span>
                                       {imageUrl
                                          ? 'Image selected'
                                          : 'Pick Image'}
                                    </span>
                                    <Image
                                       className="w-5"
                                       src={imageUrl ? check : folderGrey}
                                       alt=""
                                    />
                                 </button>
                                 {imageUrl && (
                                    <button
                                       onClick={() => {
                                          handleClick();
                                          togglePreview();
                                       }}
                                       disabled={submitting}
                                       className="bg-white ring-[1px]      text-grey  px-4 h-[40px]  rounded-md  hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300 flex items-center gap-1 neue-light  text-xs w-[50%] justify-center   "
                                    >
                                       CHANGE
                                    </button>
                                 )}
                              </div>
                              <h1 className="text-[11px] neue-light text-grey">
                                 *An Image preview of the group
                              </h1>
                           </div>
                           {error && (
                              <h1 className="text-[11px] neue-light text-red text-center">
                                 {error}
                              </h1>
                           )}
                           <div className="flex items-center gap-2  pt-3">
                              <button
                                 className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-2  text-center w-[60%]"
                                 onClick={handleCreateGroup}
                              >
                                 <span className=" text-white uppercase  text-xs  text-center">
                                    {sucessful ? (
                                       <Image
                                          src={check}
                                          alt=""
                                          className="w-6"
                                       />
                                    ) : submitting ? (
                                       <Image
                                          src={loader}
                                          alt=""
                                          className="w-6"
                                       />
                                    ) : (
                                       'Create'
                                    )}
                                 </span>
                              </button>
                              <button
                                 onClick={() => {
                                    toggleGroup();
                                    setError('');
                                 }}
                                 disabled={submitting}
                                 className="bg-grey   text-white px-4 h-[40px]  rounded-md  hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300  gap-1 neue-light  text-xs w-[40%] "
                              >
                                 CANCEL
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
            {preview && (
               <div
                  className={`w-[300px]         duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center   top-[50%]    -translate-y-1/2   left-[50%]   -translate-x-1/2   fixed shadow-custom  z-[1000]      ${
                     previewVisible ? ' opacity-100' : ' opacity-0 '
                  }`}
                  ref={previewRef}
               >
                  <div className="flex flex-col gap-3 w-full ">
                     <span className="text-xs    neue    text-darkGrey  neue-light uppercase">
                        Preview
                     </span>

                     <div className="flex aspect-[1.12/1]  overflow-hidden   self-center w-full">
                        {imageUrl ? (
                           <div className="w-full h-full relative overflow-hidden ">
                              <img
                                 src={imageUrl}
                                 alt="Selected Profile Preview"
                                 className="w-full h-full object-cover"
                              />
                           </div>
                        ) : (
                           <Image
                              src={image}
                              alt=""
                              className="w-full h-full object-cover opacity-[0.5]"
                           />
                        )}
                     </div>
                     <h1 className="text-[11px] neue-light text-grey">
                        *An Image preview of the group
                     </h1>
                     <div className="flex gap-3">
                        <button
                           onClick={imageUrl ? togglePreview : handleClick}
                           disabled={submitting}
                           className="bg-softGreen  text-white px-4 h-[40px]  rounded-md  hover:ring-[2px]  hover:ring-offset-1  ring-softGreen  duration-300 flex items-center gap-1 neue-light  text-sm  justify-center   w-[60%]"
                        >
                           <span>
                              {imageUrl ? 'Set image' : 'Select Image'}
                           </span>
                           <Image
                              className={'w-4'}
                              src={imageUrl ? check : folder}
                              alt=""
                           />
                        </button>
                        {imageUrl && (
                           <button
                              onClick={handleClick}
                              disabled={submitting}
                              className="bg-white ring-[1px]      text-grey  px-4 h-[40px]  rounded-md  hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300 flex items-center gap-1 neue-light  text-sm w-[40%] justify-center   "
                           >
                              Change
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            )}
            <input
               type="file"
               accept="image/*"
               onChange={handleFileChange}
               ref={fileInputRef}
               className="hidden"
            />
         </PageWrapper>
      </section>
   );
};

export default FurniturePage;
