import { usersType } from '~/types/users';
import { formatDate } from '~/lib/utils/format-date';
import { usePopup } from '~/lib/utils/toggle-popups';
import Image from 'next/image';
import bin from '~/public/icons/bin-red.svg';
import more from '~/public/icons/moreWhite.svg';
import adminIcon from '~/public/icons/admin.svg';
import { useState } from 'react';
import userIcon from '~/public/icons/user.svg';
import SetAsAdmin from './set-as-admin';
import DeleteAccount from './delete-account';
const UserCard = (props: usersType) => {
   const {
      isVisible: promptVisible,
      isActive: prompt,
      togglePopup: togglePrompt,
      ref: promptRef,
   } = usePopup();
   const {
      isVisible: deleteAccountVisible,
      isActive: deleteAccount,
      togglePopup: toggleDeleteAccount,
      ref: deleteAccountRef,
   } = usePopup();
   const {
      isVisible: setAdminVisible,
      isActive: setAdmin,
      togglePopup: toggleSetAdmin,
      ref: setAdminRef,
   } = usePopup();
   const [userId, setUserId] = useState('');
   const [username, setUsername] = useState({
      firstName: '',
      lastName: '',
   });
   const [isAdmin, setIsAdmin] = useState(false);
   const setAsAdminProps = {
      setAdminVisible,
      setAdmin,
      toggleSetAdmin,
      setAdminRef,
      userId,
      username,
      isAdmin,
      setIsAdmin,
   };

   const deleteAccountProps = {
      deleteAccountVisible,
      deleteAccount,
      deleteAccountRef,
      toggleDeleteAccount,
      userId,
      username,
   };
   return (
      <>
         <div className="w-[210px]  h-[260px] bg-lightGrey rounded-md shrink-none flex flex-col gap-3 p-2  relative dxs:w-full">
            <button
               className={`flex items-center justify-center p-1 bg-[#0000005c] hover:ring ring-softGreen  hover:ring-[1px] duration-150  rounded-full absolute top-2  right-2 z-10   ${
                  prompt && 'ring-[1px]'
               }`}
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePrompt();

                  setUserId(props?._id);
                  setUsername({
                     firstName: props?.firstName,
                     lastName: props?.lastName,
                  });
                  if (props?.isAdmin) {
                     setIsAdmin(true);
                  } else {
                     setIsAdmin(false);
                  }
               }}
            >
               <Image src={more} alt="" className="w-4" />
            </button>
            {prompt && (
               <div
                  className={`flex  flex-col bg-white shadow-lg  w-[130px] rounded-md   duration-150 absolute top-2 right-10  divide-y divide-lightGrey overflow-hidden border border-lightGrey z-20   ${
                     promptVisible ? 'opacity-100' : 'opacity-0 '
                  }`}
                  ref={promptRef}
               >
                  <button
                     className="py-2 w-full text-[13px] neue-light text-grey flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSetAdmin();
                     }}
                  >
                     <Image
                        src={props?.isAdmin ? userIcon : adminIcon}
                        className="w-3"
                        alt=""
                     />
                     <span>
                        {props?.isAdmin ? 'Set as user' : 'Set as admin'}
                     </span>
                  </button>

                  <button
                     className="py-2 w-full text-[13px] neue-light text-red  flex items-center gap-2  px-3 hover:bg-lightGrey duration-150"
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDeleteAccount();
                     }}
                  >
                     <Image src={bin} className="w-3" alt="" />
                     <span>Delete user</span>
                  </button>
               </div>
            )}
            <div className="bg-lighterGrey rounded-full h-[180px] overflow-hidden flex items-center justify-center h-[180px] w-[180px] mx-auto">
               <img
                  src={props?.profile ? props.profile : '/icons/user.svg'}
                  alt=""
                  className={`  rounded-full object-cover  ${
                     props?.profile ? 'w-full h-[180px]   ' : 'w-16'
                  }`}
               />
            </div>
            <div className="flex flex-col ">
               <div className="flex items-center justify-between  gap-2 leading-none ">
                  <h1 className="text-xs uppercase neue-light line-clamp-1">
                     {props?.lastName} {props?.firstName}
                  </h1>

                  <h1
                     className={`text-xs   neue-light px-2    rounded-full  ${
                        props?.isAdmin
                           ? ' border border-[#a37a00] bg-[#FFFBDB] text-[#a37a00]'
                           : ' border border-softGreen  bg-[#EFFCF6] text-softGreen'
                     }`}
                  >
                     {props?.isAdmin ? 'admin' : 'user'}
                  </h1>
               </div>
               <h1 className="text-xs text-[#8D8896] py-1  ">
                  Joined{' '}
                  <span className=" text-black  neue-light">
                     {formatDate(props?.createdAt)}
                  </span>
               </h1>
            </div>
         </div>
         <SetAsAdmin {...setAsAdminProps} />
         <DeleteAccount {...deleteAccountProps} />
      </>
   );
};

export default UserCard;
