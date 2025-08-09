import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { apiRequest } from '~/lib/utils/api-request';
import bin from '~/public/icons/bin.svg';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
const DeleteOption = (props: any) => {
   const { room_admin, category_admin, product_admin } = useParams();
   const {
      optionId,
      setOptionId,
      isDeleteOptionVisible,
      deleteOption,
      deleteOptionRef,
      toggleDeleteOption,
      setSelectedOption,
   } = props;
   const [error, setError] = useState('');
   const [deleting, setDeleting] = useState(false);
   const [sucessful, setSucessful] = useState(false);
   const handleDeleteOption = async (e: any) => {
      setError('');
      e.preventDefault();
      if (deleting) return;
      const check = !(
         room_admin &&
         category_admin &&
         product_admin &&
         optionId
      );
      if (check) {
         setError('Something went wrong');
         return;
      }
      setDeleting(true);
      setError('');
      await apiRequest({
         url: '/api/admin/delete-option',
         method: 'DELETE',
         body: {
            furnitureId: room_admin,
            groupId: category_admin,
            productId: product_admin,
            optionId: optionId,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('productFetched'));
            setSucessful(true);
            setSelectedOption(0);
            setTimeout(() => toggleDeleteOption(), 1000);
         },
         onError: (error) => {
            setError(error);
         },
         onFinally: () => {
            setDeleting(false);
            setTimeout(() => setSucessful(false), 2000);
         },
      });
   };
   return (
      deleteOption && (
         <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
            <div
               className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                  isDeleteOptionVisible ? '' : 'mid-popup-hidden'
               }`}
               ref={deleteOptionRef}
            >
               <div className="flex flex-col gap-3 items-center w-full">
                  <Image src={bin} alt="" className="w-12" />

                  <div className="flex flex-col gap-2 ">
                     <h1 className="text-2xl louize text-center">
                        Delete Option
                     </h1>
                     <p className="text-sm neue-light  text-center">
                        You’re about to delete this option. All values within it
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
                     onClick={handleDeleteOption}
                  >
                     <span className=" text-white uppercase  text-xs  text-center">
                        {sucessful ? (
                           <Image src={check} alt="" className="w-6" />
                        ) : deleting ? (
                           <Image src={loader} alt="" className="w-6" />
                        ) : (
                           'Delete'
                        )}
                     </span>
                  </button>
                  <button
                     className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen     duration-150 hover:ring hover:ring-[2px]  ring-softGreen    ring-offset-2  text-center w-[40%] text-white "
                     onClick={toggleDeleteOption}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default DeleteOption;
