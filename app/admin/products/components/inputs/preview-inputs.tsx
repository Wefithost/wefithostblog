import Image from 'next/image';
import check from '~/public/icons/check.svg';
import folderGrey from '~/public/icons/folderGrey.svg';
type FileProps = {
   togglePreview: () => void;
   toggleChange: () => void;
   imageUrl: string | null;
   error: string;
   label: string;
   errorContent: string;
   inputType?: string;
   setError?: React.Dispatch<React.SetStateAction<string>>;
   note?: string;
   submitting: boolean;
};
const FileInput = ({
   togglePreview,
   imageUrl,
   error,
   label,
   errorContent,
   note,
   submitting,
   toggleChange,
}: FileProps) => {
   return (
      <div className="relative flex gap-1 flex-col">
         <span className="text-[11px]    neue    text-darkGrey  neue-light uppercase">
            {label}
         </span>
         <div className="flex gap-2">
            <button
               onClick={togglePreview}
               // disabled={imageUrl !== null}
               className={` px-4 h-[33px]        duration-300 flex items-center gap-1 neue-light  text-sm w-full  justify-center ${
                  error === errorContent && !imageUrl
                     ? 'border-red border'
                     : `  ${
                          imageUrl
                             ? ' bg-softGreen  text-white ring-softGreen '
                             : ' bg-white  text-grey  ring-grey ring-[1px]  hover:ring-[2px]  hover:ring-offset-1'
                       }`
               }   
            `}
            >
               <span className="text-xs">
                  {imageUrl ? 'Image selected' : 'Pick Image'}
               </span>
               <Image
                  className="w-4"
                  src={imageUrl ? check : folderGrey}
                  alt=""
               />
            </button>
            {imageUrl && (
               <button
                  onClick={() => {
                     toggleChange();
                     togglePreview();
                  }}
                  disabled={submitting}
                  className="bg-white ring-[1px]      text-grey  px-4 h-[33px]    hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300 flex items-center gap-1 neue-light  text-xs w-[50%] justify-center   "
               >
                  Change
               </button>
            )}
         </div>
         {note && <h1 className="text-[11px] neue-light text-grey">*{note}</h1>}
      </div>
   );
};

export default FileInput;
