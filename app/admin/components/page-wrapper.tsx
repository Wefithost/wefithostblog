import React from 'react';
import Image from 'next/image';
import loadingGif from '~/public/icons/double-loading-black.svg';
import boxEmpty from '~/public/icons/empty-box.svg';
interface PageWrapperProps {
   fetching: boolean;
   errorFetching: boolean;

   children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
   fetching,
   errorFetching,
   children,
}) => {
   const renderErrorState = () => (
      <div className=" flex-col py-20 h-screen  w-full flex items-center justify-center">
         <Image src={boxEmpty} className="w-20" alt="Error icon" />
         <p className="neue-thin text-2xl text-darkGrey uppercase text-black spaced text-center leading-none">
            An error occured
            <br />
            <span className="text-base normal-case neue-thin tracking-normal">
               Try Checking Your Internet Connection
            </span>
         </p>
      </div>
   );

   const renderLoadingState = () => (
      <div className="bg-white h-screen  w-full flex items-center justify-center opacity-20">
         <Image src={loadingGif} alt="Loading" className="w-16" />
      </div>
   );
   let content;

   if (errorFetching) {
      content = renderErrorState();
   } else if (fetching) {
      content = renderLoadingState();
   } else {
      content = children;
   }
   return content;
};

export default PageWrapper;
