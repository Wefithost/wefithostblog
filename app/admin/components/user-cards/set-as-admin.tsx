import Image from 'next/image';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiRequest } from '~/lib/utils/api-request';
import adminIcon from '~/public/icons/admin.svg';

import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
const SetAsAdmin = (props: any) => {
   const {
      setAdminVisible,
      setAdmin,
      toggleSetAdmin,
      setAdminRef,
      userId,
      username,
      isAdmin,
   } = props;

   const [error, setError] = useState('');
   const [submitting, setSubmitting] = useState(false);
   const [sucessful, setSucessful] = useState(false);
   const handleSetAdmin = async () => {
      if (submitting) return;

      if (!userId) {
         setError('Mising required fields');
         return;
      }

      setSubmitting(true);
      await apiRequest({
         url: '/api/admin/set-as-admin',
         method: 'PATCH',
         body: {
            userId,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('userUpdated'));
            window.dispatchEvent(new CustomEvent('usersUpdated'));
            setSucessful(true);
            setTimeout(() => {
               toggleSetAdmin();
            }, 500);
            toast.success(
               `${username?.firstName} ${username?.lastName} made ${
                  isAdmin ? 'a user' : 'an admin'
               }`,
               {
                  icon: <FaCheck color="white" />,
               }
            );
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
      setAdmin && (
         <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
            <div
               className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                  setAdminVisible ? '' : 'mid-popup-hidden'
               }  `}
               ref={setAdminRef}
            >
               <div className="flex flex-col gap-3 items-center w-full">
                  <Image src={adminIcon} alt="" className="w-12" />

                  <div className="flex flex-col gap-2 ">
                     <h1 className="text-2xl louize text-center">
                        {isAdmin ? 'Set as user' : 'Set as admin'}
                     </h1>
                     {isAdmin ? (
                        <p className="text-sm neue-light  text-center">
                           You’re about to set{' '}
                           <span className="neue-bold">
                              {` ${username?.firstName} ${username?.lastName} `}{' '}
                           </span>
                           to a user. He/She would be will no longer be able to
                           edit, delete and add products. Are you sure you want
                           to?
                        </p>
                     ) : (
                        <p className="text-sm neue-light  text-center">
                           You’re about to set{' '}
                           <span className="neue-bold">
                              {`${username?.firstName} ${username?.lastName}`}{' '}
                           </span>
                           as an admin. He/She would be able to edit, delete and
                           add products. Are you sure you want to?
                        </p>
                     )}
                  </div>
               </div>
               {error && (
                  <h1 className="text-[11px] neue-light text-red text-center">
                     {error}
                  </h1>
               )}
               <div className="flex gap-4 w-full">
                  <button
                     className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen   duration-150 hover:ring hover:ring-[2px]  ring-softGreen  ring-offset-2  text-center w-[60%]"
                     onClick={handleSetAdmin}
                  >
                     <span className=" text-white uppercase  text-xs  text-center">
                        {sucessful ? (
                           <Image src={check} alt="" className="w-6" />
                        ) : submitting ? (
                           <Image src={loader} alt="" className="w-6" />
                        ) : isAdmin ? (
                           'Set as user'
                        ) : (
                           'Set as admin'
                        )}
                     </span>
                  </button>
                  <button
                     className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-grey     duration-150 hover:ring hover:ring-[2px]  ring-grey    ring-offset-2  text-center w-[40%] text-white uppercase text-xs "
                     onClick={toggleSetAdmin}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default SetAsAdmin;
