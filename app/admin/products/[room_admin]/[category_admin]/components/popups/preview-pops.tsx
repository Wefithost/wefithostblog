import Image from 'next/image';
import check from '~/public/icons/check.svg';
import image from '~/public/icons/image.svg';
import folder from '~/public/icons/folder.svg';
type previewPopProps = {
   activeView: boolean;
   activeViewVisible: boolean;
   viewRef: React.Ref<HTMLDivElement>;
   viewImageUrl: string | null;
   toggleView: () => void;
   handleViewClick: () => void;
   content: string;
   submitting: boolean;
   note: string;
};

const PreviewPop = ({
   activeView,
   activeViewVisible,
   viewRef,
   viewImageUrl,
   toggleView,
   handleViewClick,
   submitting,
   content,
   note,
}: previewPopProps) => {
   return (
      activeView && (
         <div
            className={`w-[300px]         duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center   top-[50%]    -translate-y-1/2   left-[50%]   -translate-x-1/2   fixed shadow-custom  z-[1000]      ${
               activeViewVisible ? ' opacity-100' : ' opacity-0 '
            }`}
            ref={viewRef}
         >
            <div className="flex flex-col gap-3 w-full ">
               <span className="text-xs    neue    text-darkGrey  neue-light uppercase">
                  {content}
               </span>

               <div className="flex aspect-[1.12/1]  overflow-hidden   self-center w-full">
                  {viewImageUrl ? (
                     <div className="w-full h-full relative overflow-hidden ">
                        <img
                           src={viewImageUrl}
                           alt="Selected Profile Preview"
                           className="w-full h-full object-cover"
                        />
                     </div>
                  ) : (
                     <Image
                        src={image}
                        alt=""
                        className="w-full h-full object-cover opacity-[0.5]"
                     />
                  )}
               </div>
               {note && (
                  <h1 className="text-[11px] neue-light text-grey">*{note}</h1>
               )}

               <div className="flex gap-3">
                  <button
                     onClick={viewImageUrl ? toggleView : handleViewClick}
                     disabled={submitting}
                     className="bg-softGreen  text-white px-4 h-[40px]  rounded-md  hover:ring-[2px]  hover:ring-offset-1  ring-softGreen  duration-300 flex items-center gap-1 neue-light  text-sm  justify-center   w-[60%]"
                  >
                     <span>{viewImageUrl ? 'Set image' : 'Select Image'}</span>
                     <Image
                        className={'w-4'}
                        src={viewImageUrl ? check : folder}
                        alt=""
                     />
                  </button>
                  {viewImageUrl && (
                     <button
                        onClick={handleViewClick}
                        disabled={submitting}
                        className="bg-white ring-[1px]      text-grey  px-4 h-[40px]  rounded-md  hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300 flex items-center gap-1 neue-light  text-sm w-[40%] justify-center   "
                     >
                        Change
                     </button>
                  )}
               </div>
            </div>
         </div>
      )
   );
};

export default PreviewPop;
