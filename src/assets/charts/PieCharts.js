import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const PieCharts = () => {
  // Define the desktopOS data directly inside the component
  const desktopOS = [
    { label: 'Windows', value: 72.72 },
    { label: 'OS X', value: 16.38 },
    { label: 'Linux', value: 3.83 },
    { label: 'Chrome OS', value: 2.42 },
    { label: 'Other', value: 4.65 },
  ];

  // Formatter for pie chart values
  const valueFormatter = (item) => `${item.value}%`;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Desktop OS Market Share</h2>
      <PieChart
        series={[
          {
            data: desktopOS, // Data for the pie chart
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            valueFormatter, // Formatter for values
          },
        ]}
        height={200} // Height for the pie chart
      />
    </div>
  );
};

export default PieCharts;
