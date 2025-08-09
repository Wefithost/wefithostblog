import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { apiRequest } from '~/lib/utils/api-request';
import bin from '~/public/icons/bin.svg';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
const DeleteFeature = (props: any) => {
   const { room_admin, category_admin, type_products, product_admin } =
      useParams();
   const {
      deleteFeatures,
      isDeleteFeaturesVisible,
      featureId,
      toggleDeleteFeatures,
      deleteFeaturesRef,
   } = props;
   const [error, setError] = useState('');
   const [sucessful, setSucessful] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const handleDeleteFeatures = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const check = !featureId;

      if (check) {
         setError('Feature not found');
         return;
      }

      setSubmitting(true);
      setError('');
      await apiRequest({
         url: '/api/admin/delete-product-feature',
         method: 'DELETE',
         body: {
            furnitureId: room_admin,
            groupId: category_admin,
            typeId: type_products,
            productId: product_admin,
            featureId,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('productFetched'));
            setSucessful(true);
            setTimeout(() => toggleDeleteFeatures(), 1000);
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
      deleteFeatures && (
         <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
            <div
               className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-fade-grey   items-center      ${
                  isDeleteFeaturesVisible ? '' : 'mid-popup-hidden'
               }`}
               ref={deleteFeaturesRef}
            >
               <div className="flex flex-col gap-3 items-center w-full">
                  <Image src={bin} alt="" className="w-12" />
                  <div className="flex flex-col gap-2 ">
                     <h1 className="text-2xl louize text-center">
                        Delete Feature
                     </h1>
                     <p className="text-sm neue-light  text-center">
                        You’re about to delete this feture. All values within it
                        will also be deleted. You can’t undo this. Are you sure
                        you want to?
                     </p>
                  </div>
               </div>
               {error && (
                  <h1 className="text-[11px] neue-light text-red text-center">
                     {error}
                  </h1>
               )}

               <div className="flex gap-4 w-full">
                  <button
                     className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-red   duration-150 hover:ring hover:ring-[2px]  ring-red  ring-offset-2  text-center w-[60%]"
                     onClick={handleDeleteFeatures}
                  >
                     <span className=" text-white uppercase  text-xs  text-center">
                        {sucessful ? (
                           <Image src={check} alt="" className="w-6" />
                        ) : submitting ? (
                           <Image src={loader} alt="" className="w-6" />
                        ) : (
                           'Delete'
                        )}
                     </span>
                  </button>
                  <button
                     className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen     duration-150 hover:ring hover:ring-[2px]  ring-softGreen    ring-offset-2  text-center w-[40%] text-white "
                     onClick={toggleDeleteFeatures}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default DeleteFeature;
