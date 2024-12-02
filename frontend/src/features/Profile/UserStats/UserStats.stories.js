import UserStats from '@features/Profile/UserStats/UserStats';

export default {
  title: 'Profile/UserStats',
  component: UserStats,
  tags: ['autodocs'],
};

const Template = (args) => <UserStats {...args} />;

export const UserStatsDefault = Template.bind({});
export const UserStatusAmberColor = Template.bind({});
export const UserStatusBlueColor = Template.bind({});
export const UserStatusRedColor = Template.bind({});

UserStatsDefault.args = {
  label: 'Total assets',
  value: 4,
  color: 'rgb(255, 205, 86)',
  total: 9,
};

UserStatusAmberColor.args = {
  label: 'Total assets',
  value: 4,
  color: 'rgb(255, 205, 86)',
  total: 9,
};

UserStatusBlueColor.args = {
  label: 'Total assets',
  value: 4,
  color: 'rgb(54, 162, 235)',
  total: 9,
};

UserStatusRedColor.args = {
  label: 'Total assets',
  value: 8,
  color: 'rgb(255, 99, 132)',
  total: 9,
};
