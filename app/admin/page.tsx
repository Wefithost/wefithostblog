'use client';
import Image from 'next/image';
import wave from '~/public/icons/wave.svg';
import WeeklySalesChart from './components/graphs/graph';
import Transactions from './transactions/page';
import { useAuthContext } from '../context/auth-context';

const Admin = () => {
   const { user } = useAuthContext();
   const today = new Date().toISOString().split('T')[0];
   const calculateTotalMembersStats = (users: usersType[]) => {
      let usersSuscribedToday = 0;
      users?.forEach((user) => {
         if (user?.createdAt?.startsWith(today)) {
            usersSuscribedToday++;
         }
      });

      return {
         usersSuscribedToday,
      };
   };
   const usersStats = calculateTotalMembersStats(users);
   const calculateTotalFurnitureStats = (orders: any[]) => {
      let totalPrice = 0;
      let totalQuantity = 0;
      let totalSoldToday = 0;
      let ordersToday = 0;
      let todayRevenue = 0;

      orders?.forEach((order) => {
         order?.products?.forEach((product: any) => {
            const productTotal = product?.price * product?.quantity;
            totalPrice += productTotal;
            totalQuantity += product?.quantity;

            // Check if the order was created today
            if (order?.createdAt.startsWith(today)) {
               totalSoldToday += product?.quantity;
            }
            if (order?.createdAt.startsWith(today)) {
               ordersToday++;
            }
            if (order?.createdAt.startsWith(today)) {
               order?.products?.forEach((product: any) => {
                  todayRevenue += product?.price * product?.quantity;
               });
            }
         });
      });

      return {
         totalPrice,
         totalQuantity,
         totalSoldToday,
         ordersToday,
         todayRevenue,
      };
   };

   const stats = calculateTotalFurnitureStats(orders);

   return (
      <div className="text-2xl flex flex-col w-full   py-8">
         <div className="flex flex-col gap-4  items-start w-full px-4 ">
            <div>
               <h1 className="neue-light  text-black  text-2xl flex items-center gap-2 sm:text-xl">
                  <Image src={wave} alt="" />
                  <span>Welcome back, {user?.firstName}</span>
               </h1>
               <h1 className="neue-light   text-sm text-grey ">
                  These are the latest updates for the last 7 days.
               </h1>
            </div>
            <div className=" grid grid-cols-3      justify-between  rounded-[40px]  w-full gap-3 sm:grid-cols-2 2xs:grid-cols-1">
               <div className=" p-5  rounded-lg bg-white  flex flex-col gap-2 items-start  w-full  md:p-2">
                  <h1 className="text-sm text-grey  leading-none ">
                     Total Sales
                  </h1>
                  <h1 className="text-3xl neue-light ">
                     ₦{stats.totalPrice.toLocaleString('en-US')}
                  </h1>
                  {stats.totalSoldToday > 0 ? (
                     <div className="bg-[#ECFCF3]   text-softGreen  px-3 py-1 rounded-full text-xs neue-light  ">
                        {stats.totalSoldToday.toLocaleString('en-US')}{' '}
                        {stats.totalSoldToday > 1 ? 'products' : 'product'} (₦
                        {stats.todayRevenue.toLocaleString('en-US')}) sold today
                     </div>
                  ) : (
                     <div className="bg-[#FFFBDB]  text-[#a37a00] px-3 py-1 rounded-full text-xs neue-light  ">
                        No sales made today
                     </div>
                  )}
               </div>

               <div className=" p-5  rounded-lg bg-white  flex flex-col gap-2 items-start  w-full md:p-2">
                  <h1 className="text-sm text-grey  leading-none ">
                     Total Orders
                  </h1>
                  <h1 className="text-3xl neue-light ">{orders?.length}</h1>
                  {stats.ordersToday > 0 ? (
                     <div className="bg-[#ECFCF3]   text-softGreen  px-3 py-1 rounded-full text-xs neue-light  ">
                        {stats.ordersToday.toLocaleString('en-US')}{' '}
                        {stats.ordersToday > 1 ? 'orders' : 'order'} made today
                     </div>
                  ) : (
                     <div className="bg-[#FFFBDB]  text-[#a37a00] px-3 py-1 rounded-full text-xs neue-light  ">
                        No orders made today
                     </div>
                  )}
               </div>
               <div className=" p-5  rounded-lg bg-white  flex flex-col gap-2 items-start  w-full  md:p-2">
                  <h1 className="text-sm text-grey  leading-none ">
                     Total Users
                  </h1>
                  <h1 className="text-3xl neue-light ">{users?.length}</h1>
                  {usersStats.usersSuscribedToday > 0 ? (
                     <div className="bg-[#ECFCF3]   text-softGreen  px-3 py-1 rounded-full text-xs neue-light  ">
                        {usersStats.usersSuscribedToday.toLocaleString('en-US')}{' '}
                        {usersStats.usersSuscribedToday > 1 ? 'users' : 'user'}{' '}
                        suscribed today
                     </div>
                  ) : (
                     <div className="bg-[#FFFBDB]  text-[#a37a00] px-3 py-1 rounded-full text-xs neue-light  ">
                        No users suscribed today
                     </div>
                  )}
               </div>
            </div>
            <div className="w-full flex flex-col  bg-white py-3 rounded-2xl">
               <WeeklySalesChart orders={orders} />
               <div className="w-full mx-auto flex gap-4  items-center justify-center">
                  <div className="flex gap-2 items-center">
                     <h1 className="neue-light text-lg dxs:text-xs 2xs:hidden">
                        Weekly sales
                     </h1>
                     <div className="flex  gap-1 items-center">
                        <div className="bg-[#4A90E2] p-2 dxs:p-1"></div>
                        <span className="text-xs text-grey neue-light ">
                           Previous week sales
                        </span>
                     </div>
                     <div className="flex  gap-1 items-center">
                        <div className="bg-[#00AD8E] p-2 dxs:p-1"></div>
                        <span className="text-xs text-grey neue-light ">
                           Current week sales
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <Transactions />
      </div>
   );
};

export default Admin;
