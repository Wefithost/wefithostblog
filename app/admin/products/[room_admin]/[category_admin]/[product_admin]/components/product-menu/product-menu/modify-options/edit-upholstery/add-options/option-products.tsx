import Image from 'next/image';
import check from '~/public/icons/check.svg';
import folderGrey from '~/public/icons/folderGrey.svg';
const OptionProducts = (props: any) => {
   const {
      toggleProductPreviews,
      productsOptionCheck,
      error,
      isProductPreviewsVisible,
      submitting,
   } = props;
   return (
      <div className="relative flex gap-1 flex-col">
         <span className="text-[11px]    neue    text-darkGrey  neue-light uppercase">
            Products in option:
         </span>
         <div className="flex gap-2">
            <button
               onClick={toggleProductPreviews}
               disabled={productsOptionCheck === true}
               className={` px-4 h-[33px]        duration-300 flex items-center gap-1 neue-light  text-sm w-full  justify-center ${
                  error === 'All fields are required' && !productsOptionCheck
                     ? 'border-red border'
                     : `  ${
                          productsOptionCheck && !isProductPreviewsVisible
                             ? ' bg-softGreen  text-white ring-softGreen '
                             : ' bg-white  text-grey  ring-grey ring-[1px]  hover:ring-[2px]  hover:ring-offset-1'
                       }`
               }`}
            >
               <span className="text-xs">
                  {productsOptionCheck && !isProductPreviewsVisible
                     ? 'Images picked'
                     : 'Pick images'}
               </span>
               <Image
                  className="w-4"
                  src={
                     productsOptionCheck && !isProductPreviewsVisible
                        ? check
                        : folderGrey
                  }
                  alt=""
               />
            </button>
            {productsOptionCheck && !isProductPreviewsVisible && (
               <button
                  onClick={() => {
                     toggleProductPreviews();
                  }}
                  disabled={submitting}
                  className="bg-white ring-[1px]      text-grey  px-4 h-[33px]    hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300 flex items-center gap-1 neue-light  text-xs w-[50%] justify-center"
               >
                  Change
               </button>
            )}
         </div>
         <h1 className="text-[11px] neue-light text-grey">
            *Image previews of products in that option
         </h1>
      </div>
   );
};

export default OptionProducts;
