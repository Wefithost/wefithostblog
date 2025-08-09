import Image from 'next/image';
import imageLandscape from '~/public/icons/image-landscape.svg';
import check from '~/public/icons/check.svg';
import folder from '~/public/icons/folder.svg';
const OptionPreview = (props: any) => {
   const {
      previews,
      isPreviewsVisible,
      previewsRef,
      imageUrl,
      togglePreviews,
      handleClick,
      submitting,
   } = props;
   return (
      previews && (
         <div
            className={`w-[280px]         duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center   top-[50%]    -translate-y-1/2   left-[50%]   -translate-x-1/2   fixed shadow-custom  z-[1002]      ${
               isPreviewsVisible ? ' opacity-100' : ' opacity-0 '
            }  ${isPreviewsVisible ? ' brightness-100' : ' brightness-100'}  `}
            ref={previewsRef}
         >
            <div className="flex flex-col gap-3 w-full ">
               <span className="text-xs    neue    text-darkGrey  neue-light uppercase">
                  Preview
               </span>

               <div className="flex   overflow-hidden   self-center w-full !h-[150px]">
                  {imageUrl ? (
                     <div className="w-full h-full relative overflow-hidden ">
                        <img
                           src={imageUrl}
                           alt="Selected Profile Preview"
                           className="w-full h-full object-cover"
                        />
                     </div>
                  ) : (
                     <Image
                        src={imageLandscape}
                        alt=""
                        className="w-full h-full object-cover opacity-[0.5] object-top"
                     />
                  )}
               </div>
               <h1 className="text-[11px] neue-light text-grey">
                  *An Image preview of the group
               </h1>
               <div className="flex gap-3">
                  <button
                     onClick={imageUrl ? togglePreviews : handleClick}
                     disabled={submitting}
                     className="bg-softGreen  text-white px-4 h-[40px]  rounded-md  hover:ring-[2px]  hover:ring-offset-1  ring-softGreen  duration-300 flex items-center gap-1 neue-light  text-sm  justify-center   w-[60%]"
                  >
                     <span>{imageUrl ? 'Set image' : 'Select Image'}</span>
                     <Image
                        className={'w-4'}
                        src={imageUrl ? check : folder}
                        alt=""
                     />
                  </button>
                  {imageUrl && (
                     <button
                        onClick={handleClick}
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

export default OptionPreview;
