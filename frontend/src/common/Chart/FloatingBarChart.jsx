import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const FloatingBarChart = ({
  data,
  backgroundColor,
  borderColor,
  height = '25rem',
}) => {
  let chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => ({
          x: d.label,
          y: [d.start, d.end], // Start and end values for floating bars
        })),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
        barThickness: 20, // Adjust thickness of the bars
      },
    ],
  };

  let options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            if (context.raw) {
              return `${label}: ${context.raw.y[1] - context.raw.y[0]} (Range: ${context.raw.y[0]} - ${context.raw.y[1]})`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default FloatingBarChart;
