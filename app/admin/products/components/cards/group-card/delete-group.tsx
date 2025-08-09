import Image from 'next/image';
import bin from '~/public/icons/bin.svg';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
const DeleteGroup = (props: any) => {
   const {
      deleteGroup,
      deleteGroupRef,
      deleteGroupVisible,
      toggleDeleteGroup,
      handleDeleteGroup,
      submitting,
      sucessful,
   } = props;
   return (
      deleteGroup && (
         <div
            className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
         >
            <div
               className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                  deleteGroupVisible ? '' : 'mid-popup-hidden'
               }`}
               ref={deleteGroupRef}
            >
               <div className="flex flex-col gap-3 items-center w-full">
                  <Image src={bin} alt="" className="w-12" />

                  <div className="flex flex-col gap-2 ">
                     <h1 className="text-2xl louize text-center">
                        Delete Product Group
                     </h1>
                     <p className="text-sm neue-light  text-center">
                        You’re about to delete this group. All products within
                        it will also be deleted. You can’t undo this. Are you
                        sure you want to?
                     </p>
                  </div>
               </div>
               <div className="flex gap-4 w-full">
                  <button
                     className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-red   duration-150 hover:ring hover:ring-[2px]  ring-red  ring-offset-2  text-center w-[60%]"
                     onClick={handleDeleteGroup}
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
                     onClick={toggleDeleteGroup}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default DeleteGroup;
