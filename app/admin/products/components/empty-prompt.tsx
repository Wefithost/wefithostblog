import Image from 'next/image';
import emptyBox from '~/public/icons/empty-box.svg';
type EmptyProps = {
   content: string;
   info?: string;
};
const EmptyPrompt = ({ content }: EmptyProps) => {
   return (
      <div className="flex items-center justify-center w-full flex flex-col gap-2  h-[50vh]">
         <Image src={emptyBox} alt="" className="w-20" />
         <div>
            <h1 className="text-lg uppercase neue-light text-center  leading-none sm:text-base">
               No {content} yet
            </h1>
            <h1 className="text-sm neue-light text-grey">
               Most recent {content} will show up here.
            </h1>
         </div>
      </div>
   );
};

export default EmptyPrompt;
