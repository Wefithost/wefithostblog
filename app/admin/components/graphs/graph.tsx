import React from 'react';
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   Tooltip,
   CartesianGrid,
   ResponsiveContainer,
} from 'recharts';

const processOrdersForChart = (orders: any) => {
   const today = new Date();
   const currentWeekStart = new Date(today);
   currentWeekStart.setDate(today.getDate() - today.getDay());

   const previousWeekStart = new Date(currentWeekStart);
   previousWeekStart.setDate(previousWeekStart.getDate() - 7);

   const weeklyData = new Array(7).fill(null).map((_, index) => ({
      key: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
      currentWeek: 0,
      previousWeek: 0,
   }));

   orders?.forEach((order: any) => {
      const orderDate = new Date(order.createdAt);
      const dayIndex = orderDate.getDay();

      if (orderDate >= currentWeekStart) {
         weeklyData[dayIndex].currentWeek += order.total_price;
      } else if (orderDate >= previousWeekStart) {
         weeklyData[dayIndex].previousWeek += order.total_price;
      }
   });

   return weeklyData;
};

const WeeklySalesChart = ({ orders }: any) => {
   const chartData = processOrdersForChart(orders);
   const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
         return (
            <div className="bg-white text-white p-2  border border-lightGrey flex flex-col gap-1 dark:bg-dark-grey dark:border-dark-lightGrey">
               <p className="text-xs text-black  dark:text-white">{`${label}`}</p>
               <div className="flex flex-col gap-1">
                  {payload.map((entry: any) => (
                     <p key={entry.name} className="text-xs">
                        <span style={{ color: entry.color }}>
                           {entry.name}:{' '}
                        </span>
                        <span style={{ color: entry.color }}>
                           {entry.value}
                        </span>
                     </p>
                  ))}
               </div>
            </div>
         );
      }

      return null;
   };
   return (
      <ResponsiveContainer width="100%" height={300}>
         <LineChart
            data={chartData}
            margin={{ top: 24, right: 42, left: 12, bottom: 14 }}
         >
            <CartesianGrid horizontal vertical={false} strokeDasharray="0" />
            <XAxis
               dataKey="key"
               tick={{ fontSize: 12 }}
               tickLine={false}
               axisLine={{ stroke: '#00000000' }}
            />
            <YAxis
               tick={{ fontSize: 12 }}
               tickLine={false}
               axisLine={{ stroke: '#00000000' }}
               tickFormatter={(value) => `₦${value}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Only render lines if there's data */}

            <Line
               type="monotone"
               dataKey="currentWeek"
               stroke="#00AD8E"
               dot={false}
               name="Current Week Sales"
            />

            <Line
               type="monotone"
               dataKey="previousWeek"
               stroke="#4A90E2"
               dot={false}
               name="Previous Week Sales"
            />
         </LineChart>
      </ResponsiveContainer>
   );
};

export default WeeklySalesChart;
