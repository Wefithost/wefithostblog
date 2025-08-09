'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import boxEmpty from '~/public/icons/empty-box.svg';
import plusIcon from '~/public/icons/plus.svg';
import { motion } from 'framer-motion';
import PageWrapper from '~/app/admin/components/page-wrapper';
import Filters from '~/app/[room]/[category]/[product]/components/filters/filters';
import { usePopup } from '~/lib/utils/toggle-popups';
import NewProduct from './components/popups/new-product';
import PreviewPop from './components/popups/preview-pops';
import { apiRequest } from '~/lib/utils/api-request';
import ProductCard from '../../components/cards/product-card/product-card';
import EmptyPrompt from '../../components/empty-prompt';
const TypeProducts = () => {
   const { room_admin, category_admin } = useParams();
   const [categoryData, setCategoryData] = useState<any>(null);
   const [fetching, setFetching] = useState(true);
   const [errorFetching, setErrorFetching] = useState(false);

   useEffect(() => {
      const fetchCategoryData = async () => {
         try {
            const res = await fetch(
               `/api/admin/${room_admin}/${category_admin}`
            );

            if (!res.ok) {
               setErrorFetching(true);
               return;
            }
            const data = await res.json();
            setCategoryData(data.categoryData);
         } catch (error) {
            setErrorFetching(true);
         } finally {
            setFetching(false);
         }
      };
      (async () => {
         await fetchCategoryData().catch((error) =>
            console.error('Error fetching wishlist:', error)
         );
      })();
      const handleCategoryFetched = () => {
         fetchCategoryData().catch((error) =>
            console.error('Error fetching wishlist:', error)
         );
      };
      window.addEventListener('groupUpdated', handleCategoryFetched);

      return () => {
         window.removeEventListener('groupUpdated', handleCategoryFetched);
      };
   }, [category_admin, room_admin]);

   const [selectedMaterial, setSelectedMaterial] = useState('All');

   const handleMaterialChange = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      setSelectedMaterial(event.target.value);
   };
   const [selectedOption, setSelectedOption] = useState('All');

   const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedOption(event.target.value);
   };
   const [selectedAvailability, setSelectedAvailability] = useState('All');

   const handleAvailabilityChange = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      setSelectedAvailability(event.target.value);
   };
   const [selectedPrice, setSelectedPrice] = useState('All');

   const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedPrice(event.target.value);
   };
   const [selectedWidth, setSelectedWidth] = useState('All');

   const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedWidth(event.target.value);
   };
   const [selectedSort, setSelectedSort] = useState('Featured');

   const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedSort(event.target.value);
   };
   const {
      isActive: newProduct,
      isVisible: productVisible,
      togglePopup: toggleNewProduct,
   } = usePopup();
   const {
      isActive: firstView,
      isVisible: firstViewVisible,
      ref: firstViewRef,
      togglePopup: toggleFirstView,
   } = usePopup();
   const {
      isActive: secondView,
      isVisible: secondViewVisible,
      ref: secondViewRef,
      togglePopup: toggleSecondView,
   } = usePopup();
   const [error, setError] = useState('');
   const [sucessful, setSucessful] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [name, setName] = useState('');
   const [price, setPrice] = useState('');
   const [cancelledPrice, setCancelledPrice] = useState('');
   const [firstViewFile, setFirstViewFile] = useState<File | null>(null);
   const [firstViewImageUrl, setFirstViewImageUrl] = useState<string | null>(
      null
   );

   const handleFirstViewFileChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      setError('');
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
         setFirstViewFile(selectedFile);

         const reader = new FileReader();
         reader.onloadend = () => {
            setFirstViewImageUrl(reader.result as string);
         };
         reader.readAsDataURL(selectedFile);
      }
   };
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const handleFirstViewClick: any = () => {
      if (fileInputRef.current) {
         fileInputRef.current.click();
      }
   };
   const [secondViewFile, setSecondViewFile] = useState<File | null>(null);
   const [secondViewImageUrl, setSecondViewImageUrl] = useState<string | null>(
      null
   );

   const handleSecondViewFileChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      setError('');
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
         setSecondViewFile(selectedFile);

         const reader = new FileReader();
         reader.onloadend = () => {
            setSecondViewImageUrl(reader.result as string);
         };
         reader.readAsDataURL(selectedFile);
      }
   };
   const secondViewFileInputRef = useRef<HTMLInputElement | null>(null);
   const [upholstery, setUpholstery] = useState('Leather');
   const handleSecondViewClick: any = () => {
      if (secondViewFileInputRef.current) {
         secondViewFileInputRef.current.click();
      }
   };

   const allUniqueOptions = Array.from(
      categoryData?.products
         ? categoryData.products
              .reduce(
                 (
                    map: Map<string, { option: string; option_image: string }>,
                    product: any
                 ) => {
                    const matchesMaterial =
                       selectedMaterial === 'All' ||
                       (selectedMaterial === 'Leather' && product?.leather) ||
                       (selectedMaterial === 'Upholstered' &&
                          product?.fabric) ||
                       (selectedMaterial === 'Finish' && product?.finish);

                    if (matchesMaterial && product.options) {
                       product.options.forEach((opt: any) => {
                          if (!map.has(opt.option)) {
                             map.set(opt.option, {
                                option: opt.option,
                                option_image: opt.option_image,
                             });
                          }
                       });
                    }
                    return map;
                 },
                 new Map()
              )
              .values()
         : []
   );

   const filteredProducts = (() => {
      const filteredProducts = categoryData?.products?.filter(
         (product: any) => {
            const materialMatch =
               selectedMaterial === 'All' ||
               (selectedMaterial === 'Leather' && product?.leather) ||
               (selectedMaterial === 'Upholstered' && product?.fabric) ||
               (selectedMaterial === 'Finish' && product?.finish);

            const optionMatch =
               selectedOption === 'All' ||
               (product.options?.length > 0 &&
                  product.options.some(
                     (opt: any) => opt.option === selectedOption
                  ));

            const availabilityMatch =
               selectedAvailability === 'All' ||
               (selectedAvailability === 'In stock' && product.in_stock);

            const widthMatch =
               selectedWidth === 'All' ||
               (() => {
                  const widthValue = product.dimensions?.width;
                  if (typeof widthValue !== 'number') return false;

                  if (selectedWidth === '0 - 20')
                     return widthValue >= 0 && widthValue <= 20;
                  if (selectedWidth === '20 - 40')
                     return widthValue > 20 && widthValue <= 40;
                  if (selectedWidth === '40 - 100')
                     return widthValue >= 40 && widthValue <= 100;
                  if (selectedWidth === '100+') return widthValue > 100;

                  return false;
               })();
            const priceMatch = (() => {
               if (selectedPrice === 'All') return true;

               const priceValue = product.price; // Directly use the numeric value

               if (selectedPrice === '10-50') {
                  return priceValue >= 10 && priceValue <= 50;
               }

               if (selectedPrice === '50+') {
                  return priceValue > 50;
               }

               return false;
            })();

            return (
               materialMatch &&
               optionMatch &&
               availabilityMatch &&
               widthMatch &&
               priceMatch
            );
         }
      );

      return filteredProducts?.slice().sort((a: any, b: any) => {
         const priceA = a.price;
         const priceB = b.price;

         switch (selectedSort) {
            case 'Name: A-Z':
               return b.name.localeCompare(a.name);
            case 'Name: Z-A':
               return a.name.localeCompare(b.name);
            case 'Price: High-to-Low':
               return priceA - priceB;
            case 'Price: Low-to-High':
               return priceB - priceA;
            default:
               return 0;
         }
      });
   })();
   const areAllFiltersDefault = () => {
      const isMaterialDefault = selectedMaterial === 'All';
      const isOptionDefault = selectedOption === 'All';
      const isAvailabilityDefault = selectedAvailability === 'All';
      const isPriceDefault = selectedPrice === 'All';
      const isWidthDefault = selectedWidth === 'All';
      return !(
         !isMaterialDefault ||
         !isOptionDefault ||
         !isAvailabilityDefault ||
         !isPriceDefault ||
         !isWidthDefault
      );
   };
   const filterProps = {
      allUniqueOptions,
      setSelectedOption,
      selectedAvailability,
      selectedPrice,
      setSelectedPrice,
      selectedMaterial,
      setSelectedMaterial,
      setSelectedAvailability,
      selectedOption,
      handleAvailabilityChange,
      handlePriceChange,
      handleMaterialChange,
      handleOptionChange,
      selectedWidth,
      setSelectedWidth,
      handleWidthChange,
      areAllFiltersDefault,
      filteredProducts,
      selectedSort,
      setSelectedSort,
      handleSortChange,
   };
   const handleCreateProduct = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const check = !(
         firstViewFile &&
         secondViewFile &&
         name &&
         price &&
         cancelledPrice &&
         upholstery
      );
      if (check) {
         setError('All fields are required.');
         return;
      }
      setSubmitting(true);
      setError('');
      const formData = new FormData();
      formData.append('firstImage', firstViewFile);
      formData.append('secondImage', secondViewFile);
      formData.append('name', name);
      formData.append('price', price);
      formData.append('cancelledPrice', cancelledPrice);
      formData.append('groupId', category_admin as any);
      formData.append('productId', room_admin as any);
      await apiRequest({
         url: '/api/admin/create-product',
         method: 'POST',
         body: formData,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('groupUpdated'));
            window.dispatchEvent(new CustomEvent('customRoomsUpdate'));
            setSucessful(true);
            setFirstViewImageUrl(null);
            setSecondViewImageUrl(null);
            setName('');
            setPrice('');
            setCancelledPrice('');
            setTimeout(() => toggleNewProduct(), 1000);
         },
         onError: (error) => {
            setError(error);
         },
         onFinally: () => {
            setSubmitting(false);
            setTimeout(() => setSucessful(false), 2000);
         },
      });
   };
   const newProductProps = {
      handleCreateProduct,
      newProduct,
      productVisible,
      firstViewVisible,
      secondViewVisible,
      error,
      setError,
      name,
      setName,
      price,
      setPrice,
      cancelledPrice,
      setCancelledPrice,
      toggleFirstView,
      firstViewImageUrl,
      submitting,
      handleFirstViewClick,
      toggleSecondView,
      secondViewImageUrl,
      handleSecondViewClick,
      upholstery,
      setUpholstery,
      toggleNewProduct,
      sucessful,
   };

   return (
      <main className="flex w-full flex-col     items-center   min-h-screen pb-8">
         <PageWrapper fetching={fetching} errorFetching={errorFetching}>
            <motion.section
               className="flex flex-col w-full gap-6 max-w-[1500px] px-4"
               animate={{
                  opacity: [0, 100],
                  transition: { ease: ['easeIn', 'easeOut'] },
               }}
            >
               <div className="flex items-center justify-between  w-full sm:flex-col sm:gap-2 sm:items-start pt-6">
                  <h1 className="neue-thin text-3xl capitalize text-darkGrey md:text-2xl  sm:text-xl   ">
                     Products In {categoryData?.content}:
                  </h1>
                  <button
                     className="flex items-center gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-2   sm:h-[35px]"
                     onClick={toggleNewProduct}
                  >
                     <Image src={plusIcon} alt="" className="w-3" />
                     <span className=" text-white uppercase  text-xs sm:capitalize  ">
                        New Product
                     </span>
                  </button>
               </div>
               {categoryData?.products?.length > 0 && (
                  <Filters {...filterProps} />
               )}
               {categoryData?.products?.length > 0 ? (
                  <>
                     {filteredProducts && filteredProducts.length > 0 && (
                        <div className="  grid grid-cols-3   gap-4  4xl:gap-8  md:gap-4  sm:flex sm:flex-col xl:grid-cols-2  ">
                           {[...filteredProducts]
                              ?.reverse()
                              .map((data: any) => (
                                 <ProductCard
                                    data={data}
                                    {...data}
                                    key={data?._id}
                                 />
                              ))}
                        </div>
                     )}
                     {filteredProducts && filteredProducts.length === 0 && (
                        <div className="flex items-center  mx-auto flex-col pb-10 ">
                           <Image src={boxEmpty} className="w-20" alt="" />
                           <p className="neue-thin text-2xl text-darkGrey uppercase text-black  spaced  text-center  leading-none">
                              No products match your filters.
                              <br />
                              <span className="text-base normal-case  neue-thin  tracking-normal ">
                                 Try adjusting your filters.
                              </span>
                           </p>
                        </div>
                     )}
                  </>
               ) : (
                  <EmptyPrompt content="products" />
               )}
            </motion.section>
            <NewProduct {...newProductProps} />
            <PreviewPop
               activeView={firstView}
               activeViewVisible={firstViewVisible}
               viewRef={firstViewRef}
               content="Preview"
               viewImageUrl={firstViewImageUrl}
               note="An Image preview of the product"
               toggleView={toggleFirstView}
               handleViewClick={handleFirstViewClick}
               submitting={submitting}
            />
            <PreviewPop
               activeView={secondView}
               activeViewVisible={secondViewVisible}
               viewRef={secondViewRef}
               content="Preview"
               viewImageUrl={secondViewImageUrl}
               note="An Image preview of the product"
               toggleView={toggleSecondView}
               handleViewClick={handleSecondViewClick}
               submitting={submitting}
            />

            <input
               type="file"
               accept="image/*"
               onChange={handleFirstViewFileChange}
               ref={fileInputRef}
               className="hidden"
            />
            <input
               type="file"
               accept="image/*"
               onChange={handleSecondViewFileChange}
               ref={secondViewFileInputRef}
               className="hidden"
            />
         </PageWrapper>
      </main>
   );
};

export default TypeProducts;
