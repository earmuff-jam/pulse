import { RECENT_ACTIVITY_TYPE_MAPPER } from '@features/RecentActivities/constants';
import RecentActivityAccordionSummary from '@features/RecentActivities/RecentActivityAccordion/RecentActivityAccordionSummary';

export default {
  title: 'RecentActivities/RecentActivityAccordionSummary',
  component: RecentActivityAccordionSummary,
  tags: ['autodocs'],
};

const Template = (args) => <RecentActivityAccordionSummary {...args} />;

export const RecentActivityAccordionSummaryDefault = Template.bind({});
export const RecentActivityAccordionSummaryCategory = Template.bind({});
export const RecentActivityAccordionSummaryAssetDefault = Template.bind({});

RecentActivityAccordionSummaryDefault.args = {
  title: 'Warranty Support Plan',
  label: 'Updated',
  prefix: RECENT_ACTIVITY_TYPE_MAPPER['M'].display,
};

RecentActivityAccordionSummaryCategory.args = {
  title: 'Groceries',
  label: 'Created',
  prefix: RECENT_ACTIVITY_TYPE_MAPPER['C'].display,
};

RecentActivityAccordionSummaryAssetDefault.args = {
  title: 'Sugar',
  label: 'Created',
  prefix: RECENT_ACTIVITY_TYPE_MAPPER['A'].display,
};
