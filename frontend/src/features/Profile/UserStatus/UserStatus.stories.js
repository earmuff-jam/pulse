import UserStatus from '@features/Profile/UserStatus/UserStatus';

export default {
  title: 'Profile/UserStatus',
  component: UserStatus,
  tags: ['autodocs'],
};

const Template = (args) => <UserStatus {...args} />;

export const UserStatusDefault = Template.bind({});

UserStatusDefault.args = {
  onlySmallScreen: false,
};
