import UserDemographics from '@features/Profile/UserDemographics/UserDemographics';

export default {
  title: 'Profile/UserDemographics',
  component: UserDemographics,
  tags: ['autodocs'],
};

const Template = (args) => <UserDemographics {...args} />;

export const UserDemographicsDefault = Template.bind({});
export const UserDemographicsLongName = Template.bind({});

UserDemographicsDefault.args = {
  data: {
    id: '96cf5b68-fcda-422c-8d61-8f638e2803a5',
    username: 'xxKittenxx',
    full_name: 'Mary Doe',
    email_address: 'mary_doe@gmail.com',
    phone_number: '1234567890',
    about_me: '',
    online_status: false,
    appearance: false,
    grid_view: false,
    created_at: '0001-01-01T00:00:00Z',
    updated_at: '2024-11-24T01:24:30.874189Z',
  },
  handleEditMode: () => {},
};

UserDemographicsLongName.args = {
  data: {
    id: '96cf5b68-fcda-422c-8d61-8f638e2803a5',
    username: 'This is a really long username.',
    full_name: 'Mary Doe',
    email_address: 'mary_doe@gmail.com',
    phone_number: '1234567890',
    about_me: '',
    online_status: false,
    appearance: false,
    grid_view: false,
    created_at: '0001-01-01T00:00:00Z',
    updated_at: '2024-11-24T01:24:30.874189Z',
  },
  handleEditMode: () => {},
};
