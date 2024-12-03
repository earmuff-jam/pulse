import ReportCardWrapper from '@features/Reports/ReportCard/ReportCardWrapper';
import ReportItemDetails from '@features/Reports/ReportItemDetails/ReportItemDetails';

export default {
  title: 'Reports/ReportCardWrapper',
  component: ReportCardWrapper,
  tags: ['autodocs'],
};

const Template = (args) => <ReportCardWrapper {...args} />;

export const ReportCardWrapperDefault = Template.bind({});
export const ReportCardWrapperLongTitle = Template.bind({});
export const ReportCardWrapperChildren = Template.bind({});

ReportCardWrapperDefault.args = {
  title: 'Total Valuation',
  chipLabel: 'Since Jan, 2024',
  value: '$141.00',
  footerText: 'Total cost of assets in',
  footerSuffix: 'dollar value',
};

ReportCardWrapperLongTitle.args = {
  title: 'Total Valuation for the long title name',
  chipLabel: 'Since Jan, 2024',
  value: '$141.00',
  footerText: 'Total cost of assets in',
  footerSuffix: 'dollar value',
};

ReportCardWrapperChildren.args = {
  title: 'Total Valuation for the long title name',
  children: (
    <ReportItemDetails
      loading={false}
      avatarValue={'DF'}
      label={'Dog food'}
      caption={'Purina dog food for large dog breeds'}
    />
  ),
};
