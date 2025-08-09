import Column from './column';

const Row = (props: any) => {
   const { users, orders } = props;

   return (
      <div className="flex gap-0 w-full flex-wrap flex-col rounded-md  border  border-[#dfdde3]  xl:overflow-x-auto  xl:overflow-y-hidden">
         <div className="w-full  bg-lightGrey  flex w-full  xl:w-[1000px]">
            <div className=" w-[20%] shrink-0  px-3 py-2">
               <h1 className="text-xs   capitalize">Buyer</h1>
            </div>

            <div className="w-[45%] shrink-0    px-3 py-2">
               <div className="flex gap-2 items-center ">
                  <p className="text-xs capitalize  line-clamp-1  w-[70%]">
                     Product
                  </p>
                  <p className="text-xs   w-[15%] shrink-0  bg-  ">Quantity</p>
                  <p className="text-xs   w-[20%] shrink-0  bg- ">Price (₦)</p>
               </div>
            </div>

            <div className="w-[10%] shrink-0  px-3 py-2">
               <h1 className=" text-xs   ">Delivery</h1>
            </div>
            <div className="w-[10%] shrink-0  px-3 py-2">
               <h1 className=" text-xs   ">Delivery fee</h1>
            </div>
            <div className="w-[10%] shrink-0  px-3 py-2">
               <h1 className=" text-xs   ">Total (₦)</h1>
            </div>
            <div className="w-[5%] shrink-0  text-xs   capitalize px-3 py-2"></div>
         </div>
         {[...orders].reverse().map((data: any, index: any) => (
            <Column
               {...data}
               data={data}
               users={users}
               index={index}
               orders={orders}
               key={data?._id}
            />
         ))}
      </div>
   );
};

export default Row;
