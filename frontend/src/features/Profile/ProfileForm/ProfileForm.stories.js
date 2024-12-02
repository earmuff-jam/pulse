import ProfileForm from '@features/Profile/ProfileForm/ProfileForm';

export default {
  title: 'Profile/ProfileForm',
  component: ProfileForm,
  tags: ['autodocs'],
};

const Template = (args) => <ProfileForm {...args} />;

export const ProfileFormDefault = Template.bind({});
