import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

export default function PieChart({ data, prefix = ' ', itemLabel = 'items', height = '25rem' }) {
  const chartData = {
    labels: data.map((v) => v.label),
    datasets: [
      {
        data: data.map((v) => v.count),
        backgroundColor: data.map((v) => v.color),
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: '70%',
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return ` ${prefix}${tooltipItem.raw} ${itemLabel}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: height }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}
