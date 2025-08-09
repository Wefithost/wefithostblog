import Image from 'next/image';
import { usePopup } from '~/lib/utils/toggle-popups';

import info from '~/public/icons/info-square.svg';
import moreIcon from '~/public/icons/more.svg';
import Cell from './cell';
import { formatDate } from '~/lib/utils/format-date';
const Column = (props: any) => {
   const {
      isVisible: promptVisible,
      isActive: prompt,
      togglePopup: togglePrompt,
      ref: promptRef,
   } = usePopup();
   const {
      isVisible: detailsVisible,
      isActive: details,
      togglePopup: toggleDetails,
      ref: detailsRef,
   } = usePopup();
   return (
      <>
         <div
            className={`w-full  bg-white  flex w-full border-t    border-t-lightGrey  xl:w-[1000px] ${
               props.index === props?.orders?.length - 1 && 'rounded-b-lg '
            }`}
         >
            <div className=" w-[20%] shrink-0  px-3 py-2">
               <h1 className="text-xs   capitalize">
                  {' '}
                  {props.users[props.data.user_id]
                     ? props.users[props.data.user_id].firstName || 'Loading...'
                     : 'not found'}{' '}
                  {props.users[props.data.user_id]?.lastName || ''}
               </h1>
            </div>

            <div className="w-[45%] shrink-0    px-3 py-2 gap-2 flex flex-col ">
               {props.data.products.map((pro: any, index: any) => (
                  <div key={pro?._id} className="flex gap-2 items-center ">
                     <p className="text-xs capitalize  line-clamp-1  w-[70%]">
                        {pro.name}
                     </p>
                     <p className="text-xs   w-[15%] shrink-0    ">
                        {pro.quantity}
                     </p>
                     <p className="text-xs   w-[20%] shrink-0   ">
                        {pro.price * pro.quantity}.00
                     </p>
                  </div>
               ))}
            </div>

            <div className="w-[10%] shrink-0  px-3 py-2">
               <h1 className=" text-xs   ">
                  {props.data.delivery.door_delivery
                     ? 'Door-delivery'
                     : 'Pick-up'}
               </h1>
            </div>
            <div className="w-[10%] shrink-0  px-3 py-2">
               <h1 className=" text-xs   capitalize">
                  {props.data.delivery_fee}
               </h1>
            </div>
            <div className="w-[10%] shrink-0  px-3 py-2">
               <h1 className=" text-xs   capitalize neue-bold">
                  {props.data.total_paid}
               </h1>
            </div>
            <div className="w-[5%] shrink-0  text-xs   capitalize px-3 py-2  flex  self-start  justify-end  relative">
               <button onClick={togglePrompt}>
                  <Image
                     src={moreIcon}
                     alt=""
                     className={`w-4 rotate-90 self-end   ${
                        promptVisible && 'ring-[1px] ring-lightGrey'
                     }`}
                  />
               </button>
               {prompt && (
                  <div
                     className={`flex  flex-col bg-white rounded-sm shadow-lg  w-[130px]    duration-150 absolute top-2  right-10 overflow-hidden border border-lightGrey z-20   ${
                        promptVisible ? 'opacity-100' : 'opacity-0 '
                     }`}
                     ref={promptRef}
                  >
                     <button
                        className="py-2 w-full text-[13px] neue-light text-grey flex items-center gap-2  px-3 hover:bg-lightestGrey duration-150"
                        onClick={() => {
                           toggleDetails();
                        }}
                     >
                        <Image src={info} className="w-3" alt="" />
                        <span>More details?</span>
                     </button>
                  </div>
               )}
            </div>
         </div>
         {details && (
            <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
               <div
                  className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                     detailsVisible ? '' : 'mid-popup-hidden'
                  }  `}
                  ref={detailsRef}
               >
                  <div className="flex flex-col gap-3 items-center w-full">
                     <div className="grid grid-cols-2  w-full gap-[2px]   bg-lightGrey ">
                        <Cell value="Buyer" />
                        <Cell
                           value={`${
                              props.users[props.data.user_id]?.firstName ||
                              'Loading...'
                           }
                              ${
                                 props.users[props.data.user_id]?.lastName || ''
                              }`}
                           end
                        />
                        <Cell value="Phone:" />
                        <Cell value={props.user_phone} end />

                        {props?.user_additional_phone && (
                           <>
                              <Cell value="Addn. Phone:" />
                              <Cell value={props.user_additional_phone} end />
                           </>
                        )}
                        <Cell value="Product" />
                        <div className="bg-greyGreen  border-b border-b-lightGrey p-2">
                           {props.data.products.map((pro: any, index: any) => (
                              <div
                                 key={pro?._id}
                                 className="flex gap-2 items-center "
                              >
                                 <p className="text-[11px] capitalize  line-clamp-1  w-[70%]">
                                    {pro.name}
                                 </p>
                                 <p className="text-xs   w-[15%] shrink-0    ">
                                    {pro.quantity}
                                 </p>
                                 <p className="text-xs   w-[20%] shrink-0   ">
                                    ₦{pro.price * pro.quantity}.00
                                 </p>
                              </div>
                           ))}
                        </div>
                        <Cell value="Total price:" />
                        <Cell value={`₦${props.data.total_price}`} end />
                        <Cell value={'Delivery type'} />
                        <Cell
                           value={`${
                              props.data.delivery.door_delivery
                                 ? 'Door-delivery'
                                 : 'Pick-up'
                           }`}
                           end
                        />

                        {!props.data.delivery.door_delivery ? (
                           <>
                              <Cell value={'Delivery station'} />
                              <Cell
                                 value={
                                    props.data.delivery.pick_up_station_name
                                 }
                                 end
                              />
                              <Cell value="Delivery city:" />
                              <Cell
                                 value={props.data.delivery.pick_up_city}
                                 end
                              />
                              <Cell value="Delivery street:" />
                              <Cell
                                 value={props.data.delivery.pick_up_street}
                                 end
                              />
                              <Cell value="Latitude:" />
                              <Cell
                                 value={props.data.delivery.pick_up_latitude}
                                 end
                              />
                              <Cell value="Longitude:" />
                              <Cell
                                 value={props.data.delivery.pick_up_longitude}
                                 end
                              />
                           </>
                        ) : (
                           <>
                              <Cell value="Delivery address:" />
                              <Cell value={props.address} end />
                              <Cell value="City:" />
                              <Cell value={props.city} end />
                              <Cell value="State:" />
                              <Cell value={props.state} end />
                              {props?.additional_info && (
                                 <>
                                    <Cell value="Addn. Info:" />
                                    <Cell value={props.additional_info} end />
                                 </>
                              )}
                           </>
                        )}
                        <Cell value="Delivery fee:" />
                        <Cell value={props.data.delivery_fee} end />
                        <Cell value="Date:" />
                        <Cell value={`${formatDate(props.createdAt)}`} end />
                        <Cell value="Total paid:" />
                        <Cell value={props.data.total_paid} end />
                     </div>
                  </div>

                  <button
                     className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen      duration-150 hover:ring hover:ring-[2px]  ring-softGreen     ring-offset-2  text-center w-[40%] text-white uppercase text-xs  w-full"
                     onClick={toggleDetails}
                  >
                     Close
                  </button>
               </div>
            </div>
         )}
      </>
   );
};

export default Column;
