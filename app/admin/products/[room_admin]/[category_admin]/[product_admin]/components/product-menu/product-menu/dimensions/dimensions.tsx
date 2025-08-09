import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import ClassicInput from '~/app/admin/products/components/inputs/classic-input';
import { apiRequest } from '~/lib/utils/api-request';
import { usePopup } from '~/lib/utils/toggle-popups';
import x from '~/public/icons/x-black.svg';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
import dimensionIcon from '~/public/icons/dimension.svg';
import SetDimensions from './set-dimensions';
const Dimensions = (props: any) => {
   const {
      dimensions,
      isDimensionsVisible,
      dimensionsRef,
      toggleDimensions,
      productData,
   } = props;
   const { room_admin, category_admin, type_products, product_admin } =
      useParams();
   const {
      isVisible: isSetDimensionsVisible,
      isActive: setDimensions,
      ref: setDimensionsRef,
      togglePopup: toggleSetDimensions,
   } = usePopup();
   const [error, setError] = useState('');
   const [sucessful, setSucessful] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [width, setWidth] = useState(productData?.dimensions?.width);
   const [depth, setDepth] = useState(productData?.dimensions?.depth);
   const [height, setHeight] = useState(productData?.dimensions?.height);
   const [weight, setWeight] = useState(productData?.dimensions?.weight);
   const [seatBackHeight, setSeatBackHeight] = useState(
      productData?.dimensions?.seatBackHeight
   );
   const [seatDepth, setSeatDepth] = useState(
      productData?.dimensions?.seatDepth
   );
   const [seatHeight, setSeatHeight] = useState(
      productData?.dimensions?.seatHeight
   );
   const [armHeight, setArmHeight] = useState(
      productData?.dimensions?.armHeight
   );
   const handleSetDimensions = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const check = !(width && depth && height);
      if (check) {
         setError('Width, Depth and Height are all required');
         return;
      }
      setSubmitting(true);
      setError('');
      await apiRequest({
         url: '/api/admin/set-product-dimensions',
         method: 'POST',
         body: {
            furnitureId: room_admin,
            groupId: category_admin,
            typeId: type_products,
            productId: product_admin,
            width,
            height,
            weight,
            depth,
            seatBackHeight,
            seatDepth,
            seatHeight,
            armHeight,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('productFetched'));
            setSucessful(true);
            setTimeout(() => toggleSetDimensions(), 1000);
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

   const dimensionsProps = {
      setDimensions,
      isSetDimensionsVisible,
      setDimensionsRef,
      error,
      setError,
      submitting,
      sucessful,
      width,
      setWidth,
      weight,
      setWeight,
      height,
      setHeight,
      depth,
      setDepth,
      armHeight,
      setArmHeight,
      seatBackHeight,
      setSeatBackHeight,
      seatDepth,
      setSeatDepth,
      seatHeight,
      setSeatHeight,
      toggleSetDimensions,
      handleSetDimensions,
   };
   return (
      <div className="flex flex-col gap-2 py-3 items-start">
         <h1 className="text-xs neue-light">DIMENSIONS</h1>
         <h1 className="text-sm neue-light">
            {productData?.dimensions?.width || '_'}&quot; Width x
            {productData?.dimensions?.depth || '_'}&quot; Depth x
            {productData?.dimensions?.height || '_'}&quot; Height
         </h1>
         <button
            className="text-xs neue-light underline text-grey"
            onClick={() => {
               toggleDimensions();
            }}
         >
            See full dimensions
         </button>
         <button
            className="bg-softGreen py-2 px-3 text-xs  text-white  hover:ring-[1px]  ring-offset-2 hover:ring-softGreen duration-150  self-end"
            onClick={toggleSetDimensions}
         >
            Edit dimensions
         </button>
         {dimensions && (
            <div
               className={`fixed top-0  w-full h-full left-0   z-[10001] duration-[0.5s] ease  ${
                  isDimensionsVisible ? 'bg-[#22222240]' : 'bg-transparent'
               }`}
            >
               <div
                  className={`h-full bg-white w-[500px]  right-0 duration-300 z-[10001]  fixed flex flex-col  text-darkGrey top-0 gap-10  ${
                     isDimensionsVisible
                        ? 'translate-x-[0%]'
                        : 'translate-x-[100%] '
                  }`}
                  id="dimensions"
                  ref={dimensionsRef}
               >
                  <div className="flex items-center justify-between w-full  border-b border-b-lightGrey p-5 ">
                     <h1 className="neue-light text-[22px] ">Dimensions</h1>
                     <Image
                        src={x}
                        className="w-5  cursor-pointer"
                        alt=""
                        onClick={toggleDimensions}
                     />
                  </div>
                  <div className=" flex flex-col  px-8 divide-y divide-lightGrey">
                     {productData?.dimensions &&
                        Object.entries(
                           productData.dimensions as Record<
                              string,
                              number | null | undefined
                           > // Allow null or undefined for filtering
                        )
                           .filter(
                              ([_, value]) =>
                                 value !== null &&
                                 value !== null &&
                                 value !== undefined
                           )
                           .map(([key, value], index) => {
                              if (key === '_id') return null;

                              const formattedValue =
                                 key === 'weight'
                                    ? `${value} LBS`
                                    : `${value}"`;

                              return (
                                 <div
                                    className="w-full items-center justify-between py-2 flex"
                                    key={key}
                                 >
                                    <span className="text-xs text-grey spaced uppercase neue-light">
                                       {key
                                          .replace(/([A-Z])/g, ' $1')
                                          .toUpperCase()}{' '}
                                       {/* Format key */}
                                    </span>
                                    <span className="text-sm text-darkGrey spaced uppercase neue-light">
                                       {formattedValue}
                                    </span>
                                 </div>
                              );
                           })}
                  </div>
               </div>
            </div>
         )}

         <SetDimensions {...dimensionsProps} />
      </div>
   );
};

export default Dimensions;
