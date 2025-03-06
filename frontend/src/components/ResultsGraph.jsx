import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultsGraph = ({ prediction, reload }) => {
  // Make sure the data is in the correct format
  const data = {
    labels: Object.keys(prediction), // Strand names (e.g., STEM, ABM, HUMSS, GAS)
    datasets: [
      {
        label: 'Prediction Percentage',
        data: Object.values(prediction), // Corresponding percentages
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Prediction Results',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ResultsGraph;
