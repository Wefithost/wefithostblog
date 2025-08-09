'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePopup } from '~/lib/utils/toggle-popups';
import more from '~/public/icons/moreWhite.svg';
import pen from '~/public/icons/pen.svg';
import bin from '~/public/icons/bin.svg';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { apiRequest } from '~/lib/utils/api-request';
import EditProduct from './edit-product';
import PreviewPop from '../../../[room_admin]/[category_admin]/components/popups/preview-pops';
import DeleteProduct from './delete-product';
const ProductCard = (props: any) => {
   const { room_admin, category_admin } = useParams();
   const {
      isVisible: promptVisible,
      isActive: prompt,
      togglePopup: togglePrompt,
      ref: promptRef,
   } = usePopup();
   const {
      isVisible: editProductVisible,
      isActive: editProduct,
      togglePopup: toggleEditProduct,
   } = usePopup();
   const {
      isVisible: deleteProductVisible,
      isActive: deleteProduct,
      togglePopup: toggleDeleteProduct,
      ref: deleteProductRef,
   } = usePopup();

   const {
      isActive: firstView,
      isVisible: firstViewVisible,
      ref: firstViewRef,
      togglePopup: toggleFirstView,
   } = usePopup();
   const {
      isActive: secondView,
      isVisible: secondViewVisible,
      ref: secondViewRef,
      togglePopup: toggleSecondView,
   } = usePopup();
   const [error, setError] = useState('');
   const [sucessful, setSucessful] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [name, setName] = useState('');
   const [price, setPrice] = useState('');
   const [cancelledPrice, setCancelledPrice] = useState('');
   const [productId, setProductId] = useState('');
   const [firstViewFile, setFirstViewFile] = useState<File | null>(null);
   const [firstViewImageUrl, setFirstViewImageUrl] = useState<string | null>(
      null
   );

   const handleFirstViewFileChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      setError('');
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
         setFirstViewFile(selectedFile);

         const reader = new FileReader();
         reader.onloadend = () => {
            setFirstViewImageUrl(reader.result as string);
         };
         reader.readAsDataURL(selectedFile);
      }
   };
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const handleFirstViewClick: any = () => {
      if (fileInputRef.current) {
         fileInputRef.current.click();
      }
   };
   const [secondViewFile, setSecondViewFile] = useState<File | null>(null);
   const [secondViewImageUrl, setSecondViewImageUrl] = useState<string | null>(
      null
   );

   const handleSecondViewFileChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      setError('');
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
         setSecondViewFile(selectedFile);

         const reader = new FileReader();
         reader.onloadend = () => {
            setSecondViewImageUrl(reader.result as string);
         };
         reader.readAsDataURL(selectedFile);
      }
   };
   const secondViewFileInputRef = useRef<HTMLInputElement | null>(null);
   const [upholstery, setUpholstery] = useState('Leather');
   const handleSecondViewClick: any = () => {
      if (secondViewFileInputRef.current) {
         secondViewFileInputRef.current.click();
      }
   };
   const handleEditProduct = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const check = !(
         firstViewImageUrl &&
         secondViewImageUrl &&
         name &&
         price &&
         cancelledPrice &&
         productId
      );
      if (check) {
         setError('All fields are required.');
         return;
      }
      setSubmitting(true);
      setError('');
      const formData = new FormData();
      formData.append('firstImage', firstViewFile as any);
      formData.append('secondImage', secondViewFile as any);
      formData.append('name', name);
      formData.append('price', price);
      formData.append('cancelledPrice', cancelledPrice);
      formData.append('groupId', category_admin as any);
      formData.append('furnitureId', room_admin as any);
      formData.append('productId', productId);
      await apiRequest({
         url: '/api/admin/edit-product',
         method: 'PATCH',
         body: formData,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('groupUpdated'));
            setSucessful(true);
            setFirstViewImageUrl((prev) => (firstViewFile ? null : prev));
            setSecondViewImageUrl((prev) => (secondViewFile ? null : prev));
            setName('');
            setPrice('');
            setCancelledPrice('');
            setTimeout(() => toggleEditProduct(), 1000);
            setProductId('');
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
   const handleDeleteProduct = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const check = !(category_admin && room_admin && productId);
      if (check) {
         setError('All fields are required.');
         return;
      }
      setSubmitting(true);
      setError('');
      const formData = new FormData();
      formData.append('groupId', category_admin as any);
      formData.append('furnitureId', room_admin as any);
      formData.append('productId', productId);
      await apiRequest({
         url: '/api/admin/delete-product',
         method: 'DELETE',
         body: formData,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('groupUpdated'));
            setSucessful(true);
            setTimeout(() => toggleDeleteProduct(), 1000);
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
   const editProductProps = {
      handleEditProduct,
      editProduct,
      editProductVisible,
      firstViewVisible,
      secondViewVisible,
      error,
      setError,
      name,
      setName,
      price,
      setPrice,
      cancelledPrice,
      setCancelledPrice,
      toggleFirstView,
      firstViewImageUrl,
      submitting,
      handleFirstViewClick,
      toggleSecondView,
      secondViewImageUrl,
      handleSecondViewClick,
      upholstery,
      setUpholstery,
      toggleEditProduct,
      sucessful,
   };
   const deleteProductProps = {
      deleteProduct,
      deleteProductRef,
      deleteProductVisible,
      toggleDeleteProduct,
      handleDeleteProduct,
      submitting,
      sucessful,
      error,
   };

   const [currentPreview, setCurrentPreview] = useState(
      props?.views?.first_view
   );
   const [secondPreview, setSecondPreview] = useState(
      props?.views?.second_view
   );
   useEffect(() => {
      if (props?.options?.length > 0) {
         setCurrentPreview(props?.views?.first_view);
         setSecondPreview(props?.views?.second_view);
      }
   }, [props]);
   return (
      <>
         <Link
            href={`/admin/products/${room_admin}/${category_admin}/${props._id}`}
            className="flex flex-col h-[430px]   sm:h-full  sm:w-full md:h-auto  relative "
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
                  setName(props?.name);
                  setPrice(props?.price);
                  setCancelledPrice(props?.cancelled_price);
                  setFirstViewImageUrl(props?.views.first_view);
                  setSecondViewImageUrl(props?.views.second_view);
                  setProductId(props?._id);
               }}
            >
               <Image src={more} alt="" className="w-4" />
            </button>
            {prompt && (
               <div
                  className={`flex  flex-col bg-white shadow-lg  w-[140px] rounded-md   duration-150 absolute top-4 right-12 divide-y divide-lightGrey overflow-hidden border border-lightGrey z-20   ${
                     promptVisible ? 'opacity-100' : 'opacity-0 '
                  }`}
                  ref={promptRef}
               >
                  <button
                     className="py-2 w-full text-[13px] neue-light text-grey flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleEditProduct();
                     }}
                  >
                     <Image src={pen} className="w-3" alt="" />
                     <span>Edit Product</span>
                  </button>
                  <button
                     className="py-2 w-full text-[13px] neue-light text-grey flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDeleteProduct();
                     }}
                  >
                     <Image src={bin} className="w-3" alt="" />
                     <span>Delete Product</span>
                  </button>
               </div>
            )}

            <div className="h-[350px]  w-full relative overflow-hidden   image-container sm:h-full sm:w-full md:h-auto ">
               <img
                  src={
                     props?.options.length > 0
                        ? currentPreview
                        : props?.views?.first_view
                  }
                  className="w-full h-full  object-cover image image-front"
               />
               <img
                  src={
                     props?.options.length > 0
                        ? secondPreview
                        : props?.views?.second_view
                  }
                  className="w-full h-full  object-cover image image-back"
               />
            </div>
            <div className="w-full  flex flex-col gap-1.5  py-4">
               <div className="flex items-center justify-between w-full  gap-3 ">
                  <h1 className="text-sm neue-light text-darkGrey line-clamp-1 capitalize">
                     {props?.name}
                  </h1>
                  <h1 className=" text-sm neue-light text-darkGrey flex items-center gap-2 xl:gap-1">
                     <span className="text-sm neue-light text-darkGrey">
                        From:
                     </span>
                     <span className="text-darkRed">
                        ₦
                        {props?.price != null
                           ? props?.price.toLocaleString('en-US')
                           : 'N/A'}
                     </span>
                     <span className="text-sm neue-light text-grey  line-through  xl:hidden ">
                        ₦
                        {props?.cancelled_price != null
                           ? props?.cancelled_price.toLocaleString('en-US')
                           : 'N/A'}
                     </span>
                  </h1>
               </div>

               <div className="flex items-center gap-2">
                  {props?.options?.map((opt: any, index: number) => {
                     const isFirstOption = index === 0;
                     const isActive = isFirstOption
                        ? currentPreview === props?.views?.first_view
                        : currentPreview ===
                          props?.options[index]?.previews?.[0];

                     return (
                        <img
                           src={opt?.option_image}
                           key={opt?.option_image}
                           className={`w-5 h-5  object-cover  ${
                              isActive &&
                              'ring-[2px] ring-softGreen  ring-offset-[1px]'
                           }`}
                           onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentPreview(
                                 props?.options[index]?.previews[0]
                              );
                              setSecondPreview(
                                 props?.options[index]?.previews[1] ??
                                    props?.options[index]?.previews[0]
                              );
                              if (isFirstOption) {
                                 setCurrentPreview(props?.views?.first_view);
                                 setSecondPreview(props?.views?.second_view);
                              } else {
                                 setCurrentPreview(
                                    props?.options[index]?.previews?.[0]
                                 );
                                 setSecondPreview(
                                    props?.options[index]?.previews?.[1] ??
                                       props?.options[index]?.previews?.[0]
                                 );
                              }
                           }}
                        />
                     );
                  })}
               </div>
            </div>
         </Link>
         <EditProduct {...editProductProps} />
         <DeleteProduct {...deleteProductProps} />
         <PreviewPop
            activeView={firstView}
            activeViewVisible={firstViewVisible}
            viewRef={firstViewRef}
            content="Preview"
            viewImageUrl={firstViewImageUrl}
            note="An Image preview of the product"
            toggleView={toggleFirstView}
            handleViewClick={handleFirstViewClick}
            submitting={submitting}
         />
         <PreviewPop
            activeView={secondView}
            activeViewVisible={secondViewVisible}
            viewRef={secondViewRef}
            content="Preview"
            viewImageUrl={secondViewImageUrl}
            note="An Image preview of the product"
            toggleView={toggleSecondView}
            handleViewClick={handleSecondViewClick}
            submitting={submitting}
         />
         <input
            type="file"
            accept="image/*"
            onChange={handleFirstViewFileChange}
            ref={fileInputRef}
            className="hidden"
         />
         <input
            type="file"
            accept="image/*"
            onChange={handleSecondViewFileChange}
            ref={secondViewFileInputRef}
            className="hidden"
         />
      </>
   );
};

export default ProductCard;
