import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data, legendLabel, backgroundColor, borderColor, height = '25rem' }) => {
  let chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: `${legendLabel}`,
        data: data.map((d) => d.count),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += `${context.parsed} (${(
                (context.parsed / data.reduce((sum, item) => sum + item.count, 0)) *
                100
              ).toFixed(2)}%)`;
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

export default BarChart;
