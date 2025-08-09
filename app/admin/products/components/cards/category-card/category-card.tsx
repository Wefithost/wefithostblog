import Image from 'next/image';
import productIcon from '~/public/icons/product.svg';
import { formatDate } from '~/lib/utils/format-date';
import more from '~/public/icons/more.svg';
import pen from '~/public/icons/pen.svg';
import circle from '~/public/icons/circle.svg';
import { usePopup } from '~/lib/utils/toggle-popups';
import bin from '~/public/icons/bin.svg';
import { apiRequest } from '~/lib/utils/api-request';
import { useRef, useState } from 'react';
import EditCategory from './edit-category';
import DeleteCategory from './delete-category';
import Link from 'next/link';
import { useOrders } from '~/app/context/orders-context';
import { OrdersType } from '~/types/orders';
const CategoryCard = (props: any) => {
   const {
      isVisible: editPromptVisible,
      isActive: editPrompt,
      togglePopup: toggleEditPrompt,
      ref: editPromptRef,
   } = usePopup();
   const {
      isVisible: editCategoryVisible,
      isActive: editCategory,
      togglePopup: toggleEditCategory,
      ref: editCategoryRef,
   } = usePopup();
   const {
      isVisible: deleteCategoryVisible,
      isActive: deleteCategory,
      togglePopup: toggleDeleteCategory,
      ref: deleteCategoryRef,
   } = usePopup();
   const [error, setError] = useState('');
   const [directoryEdit, setDirectoryEdit] = useState('');
   const [contentEdit, setContentEdit] = useState('');
   const [categoryId, setCategoryId] = useState('');
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
   const handleEditCategory = async (e: any) => {
      e.preventDefault();
      const check = !(directoryEdit && contentEdit && categoryId);
      if (check) {
         setSubmitting(false);
         setError('All  fields are required');
         return;
      }
      const formData = new FormData();
      formData.append('file', file as any);
      formData.append('directoryEdit', directoryEdit);
      formData.append('contentEdit', contentEdit);
      formData.append('categoryId', categoryId);
      setError('');
      setSubmitting(true);
      await apiRequest({
         url: '/api/admin/edit-category',
         method: 'PATCH',
         body: formData,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('customRoomsUpdate'));
            setSucessful(true);
            setTimeout(() => {
               toggleEditCategory();
               setCategoryId('');
               setContentEdit('');
               setDirectoryEdit('');
            }, 2000);
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
   const handleDeleteCategory = async (e: any) => {
      e.preventDefault();
      const check = !categoryId;
      if (check) {
         setSubmitting(false);
         setError("Could'nt access product category");
         return;
      }
      setError('');
      setSubmitting(true);
      await apiRequest({
         url: '/api/admin/delete-category',
         method: 'DELETE',
         body: { categoryId },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('customRoomsUpdate'));

            setSucessful(true);

            setTimeout(() => {
               toggleDeleteCategory();
               setCategoryId('');
            }, 2000);
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

   const { orders } = useOrders() as { orders: OrdersType[] };
   const calculateFurnitureStats = (orders: any[], furnitureId: string) => {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      let totalPrice = 0;
      let totalQuantity = 0;
      let soldToday = 0;

      orders?.forEach((order) => {
         order?.products?.forEach((product: any) => {
            if (product?.furnitureId === furnitureId) {
               totalPrice += product?.price * product?.quantity;
               totalQuantity += product?.quantity;

               // Check if the order was created today
               if (order?.createdAt.startsWith(today)) {
                  soldToday += product?.quantity;
               }
            }
         });
      });

      return { totalPrice, totalQuantity, soldToday };
   };
   const furnitureId = props._id;

   const stats = calculateFurnitureStats(orders, furnitureId);
   const editCategoryProps = {
      editCategory,
      editCategoryVisible,
      editCategoryRef,
      contentEdit,
      setContentEdit,
      directoryEdit,
      setDirectoryEdit,
      error,
      setError,
      handleEditCategory,
      sucessful,
      submitting,
      toggleEditCategory,
      file,
      fileInputRef,
      imageUrl,
      setImageUrl,
      handleFileChange,
      handleClick,
   };
   const deleteCategoryProps = {
      deleteCategory,
      deleteCategoryVisible,
      deleteCategoryRef,
      error,
      setError,
      handleDeleteCategory,
      sucessful,
      submitting,
      toggleDeleteCategory,
   };
   return (
      <>
         <Link
            href={`/admin/products/${props._id}`}
            className="flex flex-col   h-[230px]  bg-white   rounded-md p-4  hover:ring  duration-150 hover:ring-[1px] ring-lightGreen justify-between "
            onClick={(e) => {
               if (e.defaultPrevented) return;
            }}
         >
            <div className="w-full items-start  justify-between flex ">
               <div className="flex items-center gap-2 md:gap-1">
                  <Image src={productIcon} alt="" className="w-10 md:w-8" />
                  <div className="flex flex-col ">
                     <h1 className="text-sm uppercase leading-none line-clamp-1 md:text-xs ">
                        {props?.content}
                     </h1>
                     <div className="flex items-center gap-2 ">
                        <h1 className="text-xs neue-light">
                           {formatDate(props?.createdAt)}
                        </h1>
                        <Image src={circle} alt="" className="w-1 " />
                        <h1 className="text-xs neue-light">
                           {props?.menu?.categories?.length || 0} Groups
                        </h1>
                     </div>
                  </div>
               </div>
               <div className="relative ">
                  <button
                     className={`flex items-center justify-center p-1 bg-white hover:ring ring-softGreen  hover:ring-[1px] duration-150  rounded-full ${
                        editPrompt && 'ring-[1px]'
                     }`}
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleEditPrompt();
                        setContentEdit(props?.content);
                        setDirectoryEdit(props?.dir);
                        setImageUrl(props?.image);
                        setCategoryId(props?._id);
                     }}
                  >
                     <Image src={more} alt="" className="w-4 md:w-3 " />
                  </button>
                  {editPrompt && (
                     <div
                        className={`flex  flex-col bg-white shadow-lg  w-[150px] rounded-md   duration-150 absolute top-0 right-8 divide-y divide-lightGrey overflow-hidden border border-lightGrey   ${
                           editPromptVisible ? 'opacity-100' : 'opacity-0 '
                        }`}
                        ref={editPromptRef}
                     >
                        <button
                           className="py-2 w-full text-[13px] neue-light text-grey flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
                           onClick={(e) => {
                              toggleEditCategory();
                              e.preventDefault();
                              e.stopPropagation();
                           }}
                        >
                           <Image src={pen} className="w-3" alt="" />
                           <span>Edit category</span>
                        </button>
                        <button
                           className="py-2 w-full text-[13px] neue-light text-grey flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
                           onClick={(e) => {
                              toggleDeleteCategory();
                              e.preventDefault();
                              e.stopPropagation();
                           }}
                        >
                           <Image src={bin} className="w-3" alt="" />
                           <span>Delete category</span>
                        </button>
                     </div>
                  )}
               </div>
            </div>
            <div className="flex  gap-2 flex-col">
               <div className="flex flex-col gap-0 ">
                  <h1 className="text-[11px]  uppercase neue-light ">
                     Gross Revenue:
                  </h1>
                  <h1 className=" text-4xl neue-thin text-green  line-clamp-1 md:text-3xl ">
                     ₦{stats.totalPrice.toLocaleString('en-US')}
                  </h1>
               </div>

               <div className="flex flex-col gap-0 ">
                  <h1 className="text-[11px]  uppercase neue-light ">
                     Total Products sold:
                  </h1>
                  <div className="flex items-end  justify-between">
                     <h1 className=" text-4xl neue-thin text-green leading-none  md:text-3xl">
                        {stats.totalQuantity}
                     </h1>
                     <h1 className=" text-xs  neue-light  text-green  self-end">
                        {stats.soldToday} sold today
                     </h1>
                  </div>
               </div>
            </div>
         </Link>
         <EditCategory {...editCategoryProps} />
         <DeleteCategory {...deleteCategoryProps} />
      </>
   );
};

export default CategoryCard;
