import { useTheme } from '@emotion/react';

import 'chart.js/auto';

import { Pie } from 'react-chartjs-2';

const UserStats = ({ label, value, color, total }) => {
  const theme = useTheme();
  const data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: label,
        data: [value, total],
        backgroundColor: [color, theme.palette.background.default],
        borderColor: theme.palette.background.default,
        hoverOffset: 4,
      },
    ],
  };

  let options = {
    cutout: '60%',
    maintainAspectRatio: false,
    responsive: true,
    events: [],
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '5rem' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default UserStats;
