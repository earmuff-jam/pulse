import RecentActivity from '@features/RecentActivities/RecentActivity/RecentActivity';

export default {
  title: 'RecentActivities/RecentActivity',
  component: RecentActivity,
  tags: ['autodocs'],
};

const Template = (args) => <RecentActivity {...args} />;

export const RecentActivityDefault = Template.bind({});

RecentActivityDefault.args = {
  activity: {
    id: 'ea057b1f-358b-4fb9-821e-4dfc2f214307',
    activity_id: '34b8d5f8-9139-4c15-92c2-0e8314c7b59c',
    type: 'M',
    title: 'Basic Equipment Checkup',
    custom_action: 'created',
    created_at: '2024-11-29T13:19:17.441061Z',
    created_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
    creator: 'IngestSvcUser',
    updated_at: '2024-11-29T13:19:17.441061Z',
    updated_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
    updator: 'IngestSvcUser',
    sharable_groups: ['fa956520-fc6c-4783-acc6-4ba743fae9dc'],
  },
};
