import { existsSync } from 'fs';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import BooleanInputs from '~/app/admin/products/components/inputs/boolean-inputs';
import { apiRequest } from '~/lib/utils/api-request';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
const EditUpholstery = (props: any) => {
   const { room_admin, category_admin, type_products, product_admin } =
      useParams();
   const {
      upholsteryEdit,
      isUpholsteryEditVisible,
      upholsteryEditRef,
      toggleUpholsteryEdit,
   } = props;
   const [upholstery, setUpholstery] = useState<string | number | boolean>('');

   const [error, setError] = useState('');
   const [sucessful, setSucessful] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const handleDeleteOption = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const check = !upholstery;
      if (check) {
         setError('Choose upholstery');
         return;
      }
      setSubmitting(true);
      setError('');
      await apiRequest({
         url: '/api/admin/set-upholstery',
         method: 'POST',
         body: {
            furnitureId: room_admin,
            groupId: category_admin,
            typeId: type_products,
            productId: product_admin,
            upholstery: upholstery,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('productFetched'));
            setSucessful(true);
            setUpholstery('');
            setTimeout(() => toggleUpholsteryEdit(), 1000);
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
      upholsteryEdit && (
         <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
            <div
               className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                  isUpholsteryEditVisible ? '' : 'mid-popup-hidden'
               }  `}
               ref={upholsteryEditRef}
            >
               <div className="flex flex-col gap-4 w-full">
                  <BooleanInputs
                     header="Upholstery & Finishes"
                     firstChoice={'Leather'}
                     secondChoice={'Fabric'}
                     thirdChoice={'Finish'}
                     setError={setError}
                     state={upholstery}
                     setState={setUpholstery}
                  />

                  {error && (
                     <h1 className="text-[11px] neue-light text-red text-center">
                        {error}
                     </h1>
                  )}
                  <div className="flex items-center gap-2  ">
                     <button
                        className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-[1px]  text-center w-[60%]"
                        onClick={handleDeleteOption}
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
                           toggleUpholsteryEdit();
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
      )
   );
};

export default EditUpholstery;
