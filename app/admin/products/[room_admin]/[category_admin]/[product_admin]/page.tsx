'use client';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import ProductPriceCard from '~/app/components/cards/product-price-card';

import { useRooms } from '~/app/context/rooms-context';
import { motion } from 'framer-motion';

import PageWrapper from '~/app/admin/components/page-wrapper';
import ProductMenu from './components/product-menu/product-menu/product-menu';
import ProductPreview from './components/product-preview/product-preview';

const FurniturePage = () => {
   const [productData, setProductData] = useState<any>(null);

   const { room_admin, category_admin, product_admin } = useParams();
   const [fetching, setFetching] = useState(true);
   const [errorFetching, setErrorFetching] = useState(false);

   useEffect(() => {
      const fetchProductData = async () => {
         try {
            const res = await fetch(
               `/api/admin/${room_admin}/${category_admin}/${product_admin}`
            );

            const data = await res.json();
            if (!res.ok) {
               setErrorFetching(true);
               return;
            }
            setProductData(data.productData);
         } catch (error) {
            setErrorFetching(true);
         } finally {
            setFetching(false);
         }
      };
      (async () => {
         await fetchProductData().catch((error) =>
            console.error('Error fetching ', error)
         );
      })();
      const handleProductFetch = () => {
         fetchProductData().catch((error) => console.error('Error', error));
      };
      window.addEventListener('productFetched', handleProductFetch);

      return () => {
         window.removeEventListener('productFetched', handleProductFetch);
      };
   }, [room_admin, category_admin, product_admin]);
   const { rooms } = useRooms();

   const groupData = rooms?.find((data: any) => data?._id === room_admin);

   const categoryData = groupData?.menu?.categories?.find(
      (cat: any) => cat._id === category_admin
   );

   const filteredProducts = categoryData?.products?.filter(
      (type: any) => type._id !== product_admin
   );
   const [activeOption, setActiveOption] = useState(null);
   const [selectedOption, setSelectedOption] = useState(0);
   const [isVisible, setIsVisible] = useState(false);
   const hideTimeout = useRef<any>(null);
   const handleMouseEnter = useCallback((index: any) => {
      if (hideTimeout.current) {
         clearTimeout(hideTimeout.current);
         hideTimeout.current = null;
      }
      setActiveOption(index);
      setIsVisible(true);
   }, []);

   const handleMouseLeave = useCallback(() => {
      hideTimeout.current = setTimeout(() => {
         setIsVisible(false);
         setTimeout(() => setActiveOption(null), 300);
      }, 300);
   }, []);

   const handleOptionClick = useCallback((index: any) => {
      setSelectedOption(index);
   }, []);

   const [activeIndex, setActiveIndex] = useState(0);
   const sliderRef = useRef<HTMLDivElement | null>(null);

   const productPreviewProps = {
      sliderRef,
      productData,
      selectedOption,
      activeIndex,
      setActiveIndex,
   };
   const productMenuProps = {
      productData,
      selectedOption,
      handleMouseEnter,
      handleMouseLeave,
      handleOptionClick,
      activeOption,
      isVisible,
      hideTimeout,
      setSelectedOption,
      setActiveIndex,
   };

   return (
      <main className="flex w-full flex-col   bg-white  pb-20 md:pb-5 ">
         <PageWrapper fetching={fetching} errorFetching={errorFetching}>
            <motion.section
               className="flex  w-full gap-6 items-start h-full md:flex-col lg:gap-4 pt-8 xl:gap-3"
               animate={{
                  opacity: [0, 100],
                  transition: { ease: ['easeIn', 'easeOut'] },
               }}
            >
               <ProductPreview {...productPreviewProps} />
               <ProductMenu {...productMenuProps} />
            </motion.section>
         </PageWrapper>
         {filteredProducts?.length > 0 && (
            <div className="w-full  flex flex-col gap-6 px-4 lg:px-3 md:py-10 py-16 ">
               <h1 className="text-[24px] text-darkGrey neue-thin tracking-widest uppercase md:text-lg">
                  Other products in the same group:
               </h1>
               <div className="max-w-[1500px]  grid grid-cols-3   gap-8 lg:grid-cols-2  md:gap-4  sm:flex sm:flex-col  ">
                  {filteredProducts?.map((data: any) => (
                     <ProductPriceCard
                        data={data}
                        key={data?._id}
                        admin={true}
                        {...data}
                        roomId={room_admin}
                        categoryId={category_admin}
                     />
                  ))}
               </div>
            </div>
         )}
      </main>
   );
};

export default FurniturePage;
