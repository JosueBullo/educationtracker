// PredictionGraph.jsx
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PredictionGraph = ({ predictions }) => {
  const [saveStatus, setSaveStatus] = useState(null);

  // If no predictions are available, show a message.
  if (!predictions || Object.keys(predictions).length === 0) {
    return <p>No predictions available to display.</p>;
  }

  // Extract strand labels and corresponding prediction percentages.
  const labels = Object.keys(predictions);
  const dataValues = labels.map(label => predictions[label].percentage);

  const data = {
    labels,
    datasets: [
      {
        label: 'Prediction Percentage',
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Senior High Strand Predictions' },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  // Handler to save predictions to local storage.
  const handleSavePredictions = () => {
    try {
      localStorage.setItem("predictions", JSON.stringify(predictions));
      setSaveStatus("Predictions saved successfully to local storage!");
    } catch (error) {
      console.error("Error saving predictions:", error);
      setSaveStatus("Failed to save predictions to local storage. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        {labels.map(label => (
          predictions[label].missing_subjects && predictions[label].missing_subjects.length > 0 ? (
            <div key={label} style={{ marginBottom: '10px' }}>
              <strong>{label} Missing Subjects: </strong>
              {predictions[label].missing_subjects.join(', ')}
            </div>
          ) : null
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={handleSavePredictions}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Save Predictions
        </button>
        {saveStatus && <p style={{ marginTop: '10px' }}>{saveStatus}</p>}
      </div>
    </div>
  );
};

export default PredictionGraph;
