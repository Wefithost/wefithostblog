import Image from 'next/image';
import check from '~/public/icons/check.svg';

import xWhite from '~/public/icons/x-white.svg';
import imageLandscape from '~/public/icons/image-landscape.svg';
import folderGrey from '~/public/icons/folderGrey.svg';

import folder from '~/public/icons/folder.svg';
const OptionProductsPreviews = (props: any) => {
   const {
      productPreviews,
      isProductPreviewsVisible,
      productPreviewsRef,
      productsOptionCheck,
      imageUrls,
      handleRemove,
      toggleProductPreviews,
      handleFilesClick,
      setImageUrls,
      submitting,
      setFiles,
   } = props;
   return (
      productPreviews && (
         <div
            className={`w-[280px]         duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center   top-[50%]    -translate-y-1/2   left-[50%]   -translate-x-1/2   fixed shadow-custom  z-[1005]      ${
               isProductPreviewsVisible ? ' opacity-100' : ' opacity-0 '
            }   `}
            ref={productPreviewsRef}
         >
            <div className="flex flex-col gap-3 w-full ">
               <span className="text-xs    neue    text-darkGrey  neue-light uppercase">
                  Options products previews
               </span>

               <div className="flex   overflow-hidden   self-center w-full ">
                  {productsOptionCheck ? (
                     <div className="w-full h-full relative  flex gap-1   items-start overflow-auto ">
                        {imageUrls.map((url: any, index: number) => (
                           <div className=" shrink-0 relative" key={url}>
                              <button
                                 className="absolute top-4 right-3 bg-[#00000085] rounded-full  h-5 w-5 flex items-center justify-center "
                                 onClick={() => handleRemove(index)}
                              >
                                 <Image
                                    src={xWhite}
                                    className="w-[9px]"
                                    alt=""
                                 />
                              </button>
                              <img
                                 src={url}
                                 alt={`Preview ${index + 1}`}
                                 className="max-h-[200px] w-full shrink-o"
                              />
                           </div>
                        ))}
                     </div>
                  ) : (
                     <Image
                        src={imageLandscape}
                        alt=""
                        className="w-full  !h-[150px]  object-cover opacity-[0.5] object-top"
                     />
                  )}
               </div>
               <h1 className="text-[11px] neue-light text-grey">
                  *Image previews of products in that option
               </h1>
               <div className="flex gap-3">
                  <button
                     onClick={
                        productsOptionCheck
                           ? toggleProductPreviews
                           : handleFilesClick
                     }
                     disabled={submitting}
                     className="bg-softGreen  text-white px-4 h-[40px]  rounded-md  hover:ring-[2px]  hover:ring-offset-1  ring-softGreen  duration-300 flex items-center gap-1 neue-light  text-sm  justify-center   w-[65%]"
                  >
                     <span>
                        {productsOptionCheck ? 'Set images' : 'Select Images'}
                     </span>
                     <Image
                        className={'w-4'}
                        src={productsOptionCheck ? check : folder}
                        alt=""
                     />
                  </button>
                  {productsOptionCheck && (
                     <button
                        onClick={() => {
                           toggleProductPreviews();
                           setImageUrls([]);
                           setFiles([]);
                        }}
                        disabled={submitting}
                        className="bg-white ring-[1px]      text-grey  px-4 h-[40px]  rounded-md  hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300 flex items-center gap-1 neue-light  text-sm w-[40%] justify-center   "
                     >
                        Cancel
                     </button>
                  )}
               </div>
            </div>
         </div>
      )
   );
};

export default OptionProductsPreviews;
