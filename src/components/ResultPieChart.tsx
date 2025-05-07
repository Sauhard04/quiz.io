import React from 'react';
import { Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ResultPieChartProps {
  correct: number;
  total: number;
}

const ResultPieChart: React.FC<ResultPieChartProps> = ({ correct, total }) => {
  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [correct, total - correct],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#222',
          font: { size: 14 },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 320, height: 240, mx: 'auto', my: 2 }}>
      <Pie data={chartData}  />
      
    </Box>
  );
};

export default ResultPieChart;
