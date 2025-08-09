import Image from 'next/image';
import check from '~/public/icons/check.svg';
import caretLeft from '~/public/icons/caret-left.svg';
const OptionFeatures = (props: any) => {
   const {
      featuresCheck,
      toggleFeatures,
      error,
      isFeaturesVisible,
      submitting,
   } = props;
   return (
      <div className="relative flex gap-1 flex-col">
         <span className="text-[11px]    neue    text-darkGrey  neue-light uppercase">
            Option details:
         </span>
         <div className="flex gap-2">
            <button
               onClick={toggleFeatures}
               disabled={featuresCheck === true}
               className={` px-4 h-[33px]        duration-300 flex items-center gap-1 neue-light  text-sm w-full  justify-center ${
                  error === 'All fields are required' && !featuresCheck
                     ? 'border-red border'
                     : `  ${
                          featuresCheck && !isFeaturesVisible
                             ? ' bg-softGreen  text-white ring-softGreen '
                             : ' bg-white  text-grey  ring-grey ring-[1px]  hover:ring-[2px]  hover:ring-offset-1'
                       }`
               }`}
            >
               <span className="text-xs">
                  {featuresCheck && !isFeaturesVisible
                     ? 'Details set'
                     : 'Set details'}
               </span>
               <Image
                  className="w-4"
                  src={featuresCheck && !isFeaturesVisible ? check : caretLeft}
                  alt=""
               />
            </button>
            {featuresCheck && !isFeaturesVisible && (
               <button
                  onClick={() => {
                     toggleFeatures();
                  }}
                  disabled={submitting}
                  className="bg-white ring-[1px]      text-grey  px-4 h-[33px]    hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300 flex items-center gap-1 neue-light  text-xs w-[50%] justify-center"
               >
                  Change
               </button>
            )}
         </div>
         <h1 className="text-[11px] neue-light text-grey">
            *Fabrics used , features and cares
         </h1>
      </div>
   );
};

export default OptionFeatures;
