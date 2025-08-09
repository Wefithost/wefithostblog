import Image from 'next/image';
import { usePopup } from '~/lib/utils/toggle-popups';
import reload from '~/public/icons/reload.svg';
import reloadBlack from '~/public/icons/reload-grey.svg';
import dateBlack from '~/public/icons/date-grey.svg';
import { useState } from 'react';
import { apiRequest } from '~/lib/utils/api-request';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
import date from '~/public/icons/date.svg';
import ClassicInput from '~/app/admin/products/components/inputs/classic-input';
import { useParams } from 'next/navigation';
const Restock = (props: any) => {
   const { room_admin, category_admin, product_admin } = useParams();
   const { productData, selectedOption, optionId } = props;
   const {
      isVisible: isRestockVisible,
      isActive: restock,
      ref: restockRef,
      togglePopup: toggleRestock,
   } = usePopup();
   const {
      isVisible: isAvailablePopupVisible,
      isActive: availablePopup,
      ref: availablePopupRef,
      togglePopup: toggleAvailablePopup,
   } = usePopup();
   const [error, setError] = useState('');
   const [restocking, setRestocking] = useState(false);
   const [sucessful, setSucessful] = useState(false);
   const [restockNumber, setRestockNumber] = useState(
      productData?.options[selectedOption]?.stock?.stock_count || 0
   );
   const [restockDate, setRestockDate] = useState('');
   const [dateError, setDateError] = useState('');
   const [restockingDate, setRestockingDate] = useState(false);
   const [restockDateSucessful, setRestockDateSucessful] = useState(false);
   const handleRestock = async (e: any) => {
      e.preventDefault();
      if (restocking) return;
      const check = !(
         room_admin &&
         category_admin &&
         product_admin &&
         optionId
      );

      if (check) {
         setError('Something went wrong');
         return;
      }

      if (restockNumber <= 0) {
         setError('Stock count must be greater that zero');
         return;
      }
      setRestocking(true);
      setError('');
      await apiRequest({
         url: '/api/admin/restock',
         method: 'PATCH',
         body: {
            furnitureId: room_admin,
            groupId: category_admin,
            productId: product_admin,
            optionId: optionId,
            restockNumber,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('productFetched'));
            setSucessful(true);
            setTimeout(() => toggleRestock(), 1000);
         },
         onError: (error) => {
            setError(error);
         },
         onFinally: () => {
            setRestocking(false);
            setTimeout(() => setSucessful(false), 2000);
         },
      });
   };
   const handleRestockingDate = async (e: any) => {
      e.preventDefault();
      if (restockingDate) return;
      const check = !(
         room_admin &&
         category_admin &&
         product_admin &&
         optionId
      );
      if (check) {
         setDateError('Something went wrong');
         return;
      }
      if (!restockDate) {
         setDateError('Date not set');
         return;
      }
      setRestockingDate(true);
      setDateError('');
      await apiRequest({
         url: '/api/admin/restock-date',
         method: 'PATCH',
         body: {
            furnitureId: room_admin,
            groupId: category_admin,
            productId: product_admin,
            optionId: optionId,
            restockDate,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('productFetched'));
            setRestockDateSucessful(true);
            setTimeout(() => toggleAvailablePopup(), 1000);
         },
         onError: (error) => {
            setDateError(error);
         },
         onFinally: () => {
            setRestockingDate(false);
            setTimeout(() => setRestockDateSucessful(false), 2000);
         },
      });
   };
   return (
      <div className="py-4 flex flex-col w-full gap-4">
         <div className="flex items-center justify-between ">
            <div className="text-xs uppercase  neue-bold tracking-widest flex gap-4 items-center  relative font-bold ">
               <span className="leading-none tracking-wider">
                  Stock count:{'  '}
                  <span className="">
                     {productData?.options[selectedOption]?.stock?.stock_count}
                  </span>
               </span>
            </div>

            <h1 className="text-xs font-bold text-[#1e372f]">
               {productData?.options[selectedOption]?.stock?.in_stock
                  ? 'In stock'
                  : `In Stock in ${productData?.options[selectedOption]?.stock?.when_in_stock}`}
            </h1>
         </div>
         <button
            className="flex items-center justify-center  gap-2 h-[40px]  bg-green text-center uppercase    text-xs text-white tracking-widest hover:ring-[2px] ring-green ring-offset-[1px] duration-150"
            onClick={toggleRestock}
            disabled={!optionId}
         >
            <Image src={reload} className="w-4" alt="" />
            restock
         </button>
         {!productData?.options[selectedOption]?.stock?.in_stock && (
            <button
               className="flex items-center justify-center gap-2 h-[40px] text-center uppercase text-xs text-darkGrey tracking-widest hover:ring-[1px] ring-darkGrey ring-offset-[1px] duration-150 border"
               onClick={toggleAvailablePopup}
               disabled={!optionId}
            >
               <Image src={date} className="w-4" alt="" />
               Set restock date
            </button>
         )}
         {restock && (
            <div className="fixed bottom-[0px]  h-full w-full  z-[150] left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
               <div
                  className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                     isRestockVisible ? '' : 'mid-popup-hidden'
                  }  `}
                  ref={restockRef}
               >
                  <div className="flex flex-col gap-2 items-center w-full">
                     <Image src={reloadBlack} alt="" className="w-12" />

                     <div className="flex flex-col gap-2 ">
                        <h1 className="text-2xl louize text-center">
                           Restock option products
                        </h1>
                        <p className="text-sm neue-light  text-center">
                           You&apos;re about to restock this option. All related
                           values will be updated accordingly.
                        </p>
                     </div>
                  </div>
                  <ClassicInput
                     inputType="number"
                     value={restockNumber}
                     setValue={setRestockNumber}
                     error={error}
                     errorContent="Stock count must be greater that zero"
                     label="stock count"
                     placeholder="New stock count"
                     note={`Current stock count = ${productData?.options[selectedOption]?.stock?.stock_count}`}
                  />
                  {error && (
                     <h1 className="text-[11px] neue-light text-red text-center">
                        {error}
                     </h1>
                  )}

                  <div className="flex gap-4 w-full">
                     <button
                        className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen    duration-150 hover:ring hover:ring-[2px]  ring-softGreen   ring-offset-2  text-center w-[60%]"
                        onClick={handleRestock}
                     >
                        <span className=" text-white uppercase  text-xs  text-center">
                           {sucessful ? (
                              <Image src={check} alt="" className="w-6" />
                           ) : restocking ? (
                              <Image src={loader} alt="" className="w-6" />
                           ) : (
                              'Restock'
                           )}
                        </span>
                     </button>
                     <button
                        className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-grey      duration-150 hover:ring hover:ring-[2px]  ring-grey     ring-offset-2  text-center w-[40%] text-white "
                        onClick={toggleRestock}
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            </div>
         )}
         {availablePopup && (
            <div className="fixed bottom-[0px]  h-full w-full  z-[150] left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
               <div
                  className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                     isAvailablePopupVisible ? '' : 'mid-popup-hidden'
                  }  `}
                  ref={availablePopupRef}
               >
                  <div className="flex flex-col gap-2 items-center w-full">
                     <Image src={dateBlack} alt="" className="w-12" />

                     <div className="flex flex-col gap-2 ">
                        <h1 className="text-2xl louize text-center">
                           Set restocking date
                        </h1>
                        <p className="text-sm neue-light  text-center">
                           You&apos;re about to set a restocking date for this
                           option. All related values will be updated
                           accordingly.
                        </p>
                     </div>
                  </div>
                  <ClassicInput
                     inputType="date"
                     value={restockDate}
                     setValue={setRestockDate}
                     error={dateError}
                     setError={setDateError}
                     errorContent="Date not set"
                     label="restock date"
                     placeholder="New stock count"
                  />
                  {dateError && (
                     <h1 className="text-[11px] neue-light text-red text-center">
                        {dateError}
                     </h1>
                  )}

                  <div className="flex gap-4 w-full">
                     <button
                        className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen    duration-150 hover:ring hover:ring-[2px]  ring-softGreen   ring-offset-2  text-center w-[60%]"
                        onClick={handleRestockingDate}
                     >
                        <span className=" text-white uppercase  text-xs  text-center">
                           {restockDateSucessful ? (
                              <Image src={check} alt="" className="w-6" />
                           ) : restockingDate ? (
                              <Image src={loader} alt="" className="w-6" />
                           ) : (
                              'Set date'
                           )}
                        </span>
                     </button>
                     <button
                        className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-grey      duration-150 hover:ring hover:ring-[2px]  ring-grey     ring-offset-2  text-center w-[40%] text-white "
                        onClick={toggleAvailablePopup}
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Restock;
