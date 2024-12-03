import ReportsHeader from '@features/Reports/ReportHeader/ReportsHeader';
import dayjs from 'dayjs';

export default {
  title: 'Reports/ReportsHeader',
  component: ReportsHeader,
  tags: ['autodocs'],
};

const Template = (args) => <ReportsHeader {...args} />;

export const ReportsFilterMenuDefault = Template.bind({});

ReportsFilterMenuDefault.args = {
  sinceValue: dayjs().toISOString(),
  reports: [
    {
      id: '',
      selected_time_range: '2024-01-01T06:00:00Z',
      total_valuation: 297.96,
      cost_category_items: 0,
      created_at: '0001-01-01T00:00:00Z',
      created_by: '',
      creator_name: '',
      updated_at: '0001-01-01T00:00:00Z',
      updated_by: '',
      updater_name: '',
      sharable_groups: null,
    },
  ],
  loading: false,
  selectedAsset: {},
  selectedMaintenancePlan: {},
  setDisplayModal: () => {},
  downloadReports: () => {},
};
