import PageWrapper from '~/app/[room]/[category]/[product]/components/page-wrapper/page-wrapper';
import Header from './header';
import plusIcon from '~/public/icons/plus.svg';
import Image from 'next/image';
import boxEmpty from '~/public/icons/empty-box.svg';
const NoData = ({
   fetching,
   errorFetching,
   typeData,
   toggleNewProduct,
}: any) => {
   return (
      <section>
         <PageWrapper fetching={fetching} errorFetching={errorFetching}>
            <section className="flex flex-col gap-4 px-5 py-10">
               <div className=" flex-col py-20   w-full flex items-center justify-center p-6 ">
                  <Image src={boxEmpty} className="w-20" alt="Error icon" />
                  <p className="neue-thin text-2xl text-darkGrey uppercase text-black spaced text-center leading-none">
                     No products in &apos;{typeData?.type}&apos;
                  </p>
                  <button
                     className="flex items-center gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-2  mt-4"
                     onClick={toggleNewProduct}
                  >
                     <Image src={plusIcon} alt="" className="w-3" />

                     <span className=" text-white uppercase  text-xs ">
                        Create product
                     </span>
                  </button>
               </div>
               <div className="flex items-center  flex-wrap gap-5 "></div>
            </section>
         </PageWrapper>
      </section>
   );
};

export default NoData;
