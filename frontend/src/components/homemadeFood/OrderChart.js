import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';

const OrderChart = () => {

 const chartData = [
    { month: 1, orderCount: 10 },
    { month: 2, orderCount: 25 },
    { month: 3, orderCount: 30 },
    // ...
  ];
  
  // const { chartData } = useSelector(state => state.orders);

  // Ensure chartData is defined and is an array before mapping
  const formattedData = chartData && chartData.length > 0 
    ? chartData.map(data => {
        // Adjusted month display: adding 1 to month since JS Date object considers January as 0
        const monthName = new Date(0, data.month - 1).toLocaleString('en-US', { month: 'long' });
        return { name: monthName, orderCount: data.orderCount };
      }) 
    : [];

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }} // Adjust margins
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            label={{ value: "Months", position: "insideBottomRight", offset: -5 }} 
          />
          <YAxis 
            label={{ value: "Orders", angle: -90, position: 'insideLeft' }} 
            allowDecimals={false} // Ensures the order count is displayed as whole numbers
          />
          <Tooltip />
          <Line type="monotone" dataKey="orderCount" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderChart;
