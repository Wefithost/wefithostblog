import Image from 'next/image';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiRequest } from '~/lib/utils/api-request';
import bin from '~/public/icons/bin-red.svg';

import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
const DeleteAccount = (props: any) => {
   const {
      deleteAccountVisible,
      deleteAccount,
      deleteAccountRef,
      toggleDeleteAccount,
      userId,
      username,
   } = props;

   const [error, setError] = useState('');
   const [submitting, setSubmitting] = useState(false);
   const [sucessful, setSucessful] = useState(false);
   const handleDeleteAccount = async () => {
      if (submitting) return;
      setError('');
      if (!userId) {
         setError('Mising required fields');
         return;
      }

      setSubmitting(true);
      await apiRequest({
         url: '/api/admin/delete-account',
         method: 'DELETE',
         body: {
            userId,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('userUpdated'));
            window.dispatchEvent(new CustomEvent('usersUpdated'));
            setSucessful(true);
            setTimeout(() => {
               toggleDeleteAccount();
            }, 500);
            toast.success(`Account delete sucessful`, {
               icon: <FaCheck color="white" />,
            });
         },
         onError: (error) => {
            setError(error);
         },
         onFinally: () => {
            setSucessful(false);
            setSubmitting(false);
         },
      });
   };
   return (
      deleteAccount && (
         <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
            <div
               className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                  deleteAccountVisible ? '' : 'mid-popup-hidden'
               }  `}
               ref={deleteAccountRef}
            >
               <div className="flex flex-col gap-3 items-center w-full">
                  <Image src={bin} alt="" className="w-12" />

                  <div className="flex flex-col gap-2 ">
                     <h1 className="text-2xl louize text-center">
                        Delete account
                     </h1>

                     <p className="text-sm neue-light  text-center">
                        You’re about to delete{' '}
                        <span className="neue-bold">
                           {` ${username?.firstName} ${username?.lastName}`}
                           &apos;s
                        </span>{' '}
                        account. Are you sure you want to?
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
                     onClick={handleDeleteAccount}
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
                     className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen      duration-150 hover:ring hover:ring-[2px]  ring-softGreen     ring-offset-2  text-center w-[40%] text-white uppercase text-xs "
                     onClick={toggleDeleteAccount}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default DeleteAccount;
