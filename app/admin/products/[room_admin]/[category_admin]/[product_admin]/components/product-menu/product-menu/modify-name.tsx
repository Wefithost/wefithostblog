import Image from 'next/image';
import { useState } from 'react';
import { usePopup } from '~/lib/utils/toggle-popups';
import pen from '~/public/icons/pen.svg';
import { apiRequest } from '~/lib/utils/api-request';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
import ClassicInput from '~/app/admin/products/components/inputs/classic-input';
import { useParams } from 'next/navigation';
const ModifyProductName = (props: any) => {
   const { productData } = props;
   const { room_admin, category_admin, type_products, product_admin } =
      useParams();
   const {
      isVisible: isEditNameVisible,
      isActive: editName,
      ref: editNameRef,
      togglePopup: toggleEditName,
   } = usePopup();
   const [error, setError] = useState('');
   const [sucessful, setSucessful] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [name, setName] = useState(productData?.name);
   const [price, setPrice] = useState(productData?.price);
   const [cancelledPrice, setCancelledPrice] = useState(
      productData?.cancelled_price
   );

   const handleEditProduct = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const check = !(name && cancelledPrice && price);
      if (check) {
         setError('All fields are required');
         return;
      }
      setSubmitting(true);
      setError('');
      await apiRequest({
         url: '/api/admin/edit-product-details',
         method: 'PATCH',
         body: {
            furnitureId: room_admin,
            groupId: category_admin,
            productId: product_admin,
            name: name,
            price: price,
            cancelledPrice: cancelledPrice,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('productFetched'));
            setSucessful(true);
            setTimeout(() => toggleEditName(), 1000);
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
      <div className="flex   flex-col gap-1">
         <h1 className="neue-thin text-[32px] text-darkGrey  capitalize  text-black  xl:text-xl  leading-tight ">
            {productData?.name}
         </h1>
         <div className="flex gap-4 items-center">
            <span className="text-darkRed">
               $
               {productData?.price != null
                  ? productData?.price.toLocaleString('en-US')
                  : 'N/A'}
            </span>
            <span className="text-sm neue-light text-grey  line-through">
               $
               {productData?.cancelled_price != null
                  ? productData?.cancelled_price.toLocaleString('en-US')
                  : 'N/A'}
            </span>
         </div>
         <button
            className="bg-softGreen py-2 px-3 text-xs  text-white  hover:ring-[1px]  ring-offset-2 hover:ring-softGreen duration-150  self-end"
            onClick={toggleEditName}
         >
            Edit details
         </button>
         {editName && (
            <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
               <div
                  className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                     isEditNameVisible ? '' : 'mid-popup-hidden'
                  }`}
                  ref={editNameRef}
               >
                  <div className="flex items-center flex-col gap-3">
                     <Image className="w-10" alt="" src={pen} />
                     <h1 className="text-2xl louize text-center">
                        Edit Product Details
                     </h1>
                  </div>
                  <div className="flex flex-col gap-2 w-full ">
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label="Name"
                        value={name}
                        setValue={setName}
                        placeholder="Coburn Motion Sofa"
                        errorContent="All fields required"
                     />
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label="Price"
                        value={price}
                        setValue={setPrice}
                        placeholder="$4000"
                        inputType="number"
                        errorContent="All fields are required"
                     />
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label="Cancelled price"
                        value={cancelledPrice}
                        setValue={setCancelledPrice}
                        placeholder="$5000"
                        inputType="number"
                        errorContent="All fields are required"
                     />
                  </div>
                  {error && (
                     <h1 className="text-[11px] neue-light text-red text-center">
                        {error}
                     </h1>
                  )}

                  <div className="flex items-center gap-2  w-full">
                     <button
                        className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-[1px]  text-center w-[60%]"
                        onClick={handleEditProduct}
                     >
                        <span className=" text-white uppercase  text-xs  text-center">
                           {sucessful ? (
                              <Image src={check} alt="" className="w-6" />
                           ) : submitting ? (
                              <Image src={loader} alt="" className="w-6" />
                           ) : (
                              'Edit'
                           )}
                        </span>
                     </button>
                     <button
                        onClick={() => {
                           toggleEditName();
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
         )}
      </div>
   );
};

export default ModifyProductName;
