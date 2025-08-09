'use client';
import { useRooms } from '~/app/context/rooms-context';
import PageWrapper from '../components/page-wrapper';
import Header from './components/header';
import plusIcon from '~/public/icons/plus.svg';
import Image from 'next/image';

import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
import newPro from '~/public/icons/new.svg';
import { usePopup } from '~/lib/utils/toggle-popups';
import { useRef, useState } from 'react';
import { apiRequest } from '~/lib/utils/api-request';
import CategoryCard from './components/cards/category-card/category-card';
import { useOrders } from '~/app/context/orders-context';
import EmptyPrompt from './components/empty-prompt';
import FileInput from './components/inputs/preview-inputs';
import OptionPreview from './[room_admin]/[category_admin]/[product_admin]/components/product-menu/product-menu/modify-options/edit-upholstery/option-preview';

const ProductCategories = () => {
   const { rooms, loading } = useRooms();
   const {
      isVisible: categoryVisible,
      isActive: newCategory,
      togglePopup: toggleCategory,
      ref: categoryRef,
   } = usePopup();
   const [error, setError] = useState('');
   const [directory, setDirectory] = useState('');
   const [content, setContent] = useState('');

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
   const handleCreateCategory = async (e: any) => {
      e.preventDefault();
      const check = !(directory && content && file);
      if (check) {
         setSubmitting(false);
         setError('All fields are required.');
         return;
      }
      setError('');
      setSubmitting(true);

      const formData = new FormData();
      formData.append('file', file as any);
      formData.append('content', content);
      formData.append('directory', directory);
      await apiRequest({
         url: '/api/admin/create-category',
         method: 'POST',
         body: formData,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('customRoomsUpdate'));
            setSucessful(true);
            setImageUrl(null);
            setFile(null);
            setDirectory('');
            setContent('');
            setTimeout(() => toggleCategory(), 1000);
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
   const {
      isVisible: isPreviewsVisible,
      isActive: previews,
      ref: previewsRef,
      togglePopup: togglePreviews,
   } = usePopup();
   const roomPreviewProps = {
      previews,
      isPreviewsVisible,
      previewsRef,
      imageUrl,
      togglePreviews,
      handleClick,
   };
   return (
      <>
         <PageWrapper fetching={loading} errorFetching={false}>
            <section className="flex flex-col gap-8  py-6 px-4 ">
               <div className="flex items-center justify-between w-full 2xs:flex-col 2xs:gap-2 2xs:items-start ">
                  <h1 className="flex text-3xl neue-thin uppercase md:text-2xl  sm:text-xl">
                     Product categories
                  </h1>
                  <button
                     className="flex items-center gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-2  sm:h-[35px] "
                     onClick={toggleCategory}
                  >
                     <Image src={plusIcon} alt="" className="w-3" />
                     <span className=" text-white uppercase  text-xs sm:capitalize ">
                        New Category
                     </span>
                  </button>
               </div>
               {rooms?.length > 0 ? (
                  <div className="grid  grid-cols-4   gap-4  2xl:grid-cols-3  xl:grid-cols-2  xs:grid-cols-1   w-full">
                     {rooms?.map((data: any) => (
                        <CategoryCard data={data} {...data} key={data?._id} />
                     ))}
                  </div>
               ) : (
                  <EmptyPrompt content="Categories" />
               )}
            </section>
            {newCategory && (
               <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
                  <div
                     className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                        categoryVisible ? '' : 'mid-popup-hidden'
                     }`}
                  >
                     <div className="flex flex-col gap-3 items-center w-full">
                        <Image src={newPro} alt="" className="w-12" />
                        <div>
                           <h1 className="text-2xl louize text-center">
                              New Product Category
                           </h1>
                           <h1 className="  text-sm neue-light text-center">
                              Create a new category to add similar products.
                           </h1>
                        </div>
                     </div>
                     <div className="flex flex-col gap-3  w-full ">
                        <div className="flex flex-col gap-4 ">
                           <div className="flex flex-col gap-1 w-full ">
                              <span className="text-xs    neue    text-darkGrey  neue-light uppercase">
                                 Directory
                              </span>
                              <input
                                 className={`h-[40px] py-1 px-3 bg-white  text-black  text-sm  border  focus:ring-[1px]    ring-black  outline-none w-full  duration-150  focus:rounded-sm  ${
                                    error === 'All fields are required.' &&
                                    !directory
                                       ? 'border-red'
                                       : 'border-grey'
                                 }`}
                                 placeholder="Living"
                                 autoFocus
                                 type="text"
                                 value={directory}
                                 required
                                 onChange={(e) => {
                                    setDirectory(e.target.value);
                                    setError('');
                                 }}
                              />
                              <h1 className="text-[11px] neue-light text-grey">
                                 *Shown on header for navigation
                              </h1>
                           </div>
                           <div className="flex flex-col gap-1 w-full ">
                              <span className="text-xs    neue    text-darkGrey  neue-light uppercase">
                                 Content
                              </span>
                              <input
                                 className={`h-[40px] py-1 px-3 bg-white  text-black  text-sm  border  focus:ring-[1px]    ring-black  outline-none w-full  duration-150  focus:rounded-sm  ${
                                    error === 'All fields are required.' &&
                                    !content
                                       ? 'border-red'
                                       : 'border-grey'
                                 }`}
                                 placeholder="Living room furniture"
                                 type="text"
                                 value={content}
                                 required
                                 onChange={(e) => {
                                    setContent(e.target.value);
                                    setError('');
                                 }}
                              />
                           </div>
                           <FileInput
                              label="Room preview"
                              togglePreview={togglePreviews}
                              imageUrl={imageUrl}
                              error={error}
                              submitting={submitting}
                              errorContent="All fields are required."
                              toggleChange={handleClick}
                              note="Shown on overlay for mobile screens"
                           />
                           <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              className="hidden"
                           />
                           {error && (
                              <h1 className="text-[11px] neue-light text-red text-center">
                                 {error}
                              </h1>
                           )}
                           <div className="flex gap-3 ">
                              <button
                                 className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-2  text-center w-[60%]"
                                 onClick={handleCreateCategory}
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
                                 className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-grey  duration-150 hover:ring hover:ring-[2px]  ring-grey ring-offset-2  text-center w-[40%]"
                                 onClick={() => {
                                    toggleCategory();
                                    setImageUrl(null);
                                    setFile(null);
                                 }}
                              >
                                 <span className=" text-white uppercase  text-xs  text-center">
                                    Cancel
                                 </span>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </PageWrapper>
         <OptionPreview {...roomPreviewProps} />
      </>
   );
};

export default ProductCategories;
