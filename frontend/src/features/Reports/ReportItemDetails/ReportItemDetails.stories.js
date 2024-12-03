import { Card } from '@mui/material';
import ReportItemDetails from '@features/Reports/ReportItemDetails/ReportItemDetails';

export default {
  title: 'Reports/ReportItemDetails',
  component: ReportItemDetails,
  tags: ['autodocs'],
};

const Template = (args) => (
  <Card sx={{ padding: 1 }}>
    <ReportItemDetails {...args} />
  </Card>
);

export const ReportItemDetailsDefault = Template.bind({});
export const ReportItemDetailsLoading = Template.bind({});

ReportItemDetailsDefault.args = {
  loading: false,
  avatarValue: 'DF',
  label: 'Dog food',
  caption: 'Purina dog food for large dog breeds',
};

ReportItemDetailsLoading.args = {
  loading: true,
  avatarValue: 'DF',
  label: 'Dog food',
  caption: 'Purina dog food for large dog breeds',
};
