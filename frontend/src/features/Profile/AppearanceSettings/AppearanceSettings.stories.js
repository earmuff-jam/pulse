import AppearanceSettings from '@features/Profile/AppearanceSettings/AppearanceSettings';

export default {
  title: 'Profile/AppearanceSettings',
  component: AppearanceSettings,
  tags: ['autodocs'],
};

const Template = (args) => <AppearanceSettings {...args} />;

export const AppearanceSettingsDefault = Template.bind({});
export const AppearanceSettingsLoading = Template.bind({});

AppearanceSettingsLoading.args = {
  loading: true,
  profileDetails: {},
};

AppearanceSettingsDefault.args = {
  loading: false,
  profileDetails: {
    id: '96cf5b68-fcda-422c-8d61-8f638e2803a5',
    username: 'IngestSvcUser',
    full_name: 'John Doe',
    email_address: 'admin@gmail.com',
    phone_number: '1234567890',
    about_me: '',
    online_status: false,
    appearance: false,
    grid_view: false,
    created_at: '0001-01-01T00:00:00Z',
    updated_at: '2024-11-24T01:24:30.874189Z',
  },
};
