import UserDetails from '@features/Profile/UserDetails/UserDetails';

export default {
  title: 'Profile/UserDetails',
  component: UserDetails,
  tags: ['autodocs'],
};

const Template = (args) => <UserDetails {...args} />;

export const UserDetailsDefault = Template.bind({});

UserDetailsDefault.args = {
  data: {
    id: '96cf5b68-fcda-422c-8d61-8f638e2803a5',
    username: 'IngestSvcUser',
    full_name: 'John Doe',
    email_address: 'testUserEmail@gmail.com',
    phone_number: '1234567890',
    about_me: '',
    online_status: false,
    appearance: false,
    grid_view: false,
    created_at: '0001-01-01T00:00:00Z',
    updated_at: '2024-11-24T01:24:30.874189Z',
  },
};
