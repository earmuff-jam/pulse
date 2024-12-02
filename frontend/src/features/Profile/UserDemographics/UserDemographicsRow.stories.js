import UserDemographicsRow from '@features/Profile/UserDemographics/UserDemographicsRow';
import { Typography } from '@mui/material';

export default {
  title: 'Profile/UserDemographicsRow',
  component: UserDemographicsRow,
  tags: ['autodocs'],
};

const Template = (args) => <UserDemographicsRow {...args} />;

export const UserDemographicsRowDefault = Template.bind({});

UserDemographicsRowDefault.args = {
  children: (
    <>
      <Typography variant="subtitle2" color="text.secondary">
        Username
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        xxKittenxx
      </Typography>
    </>
  ),
};
