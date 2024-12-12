import SectionCardHeader from '@common/SectionCard/SectionCardHeader';

export default {
  title: 'Common/SectionCard/SectionCardHeader',
  component: SectionCardHeader,
  tags: ['autodocs'],
};

const Template = (args) => <SectionCardHeader {...args} />;

export const SectionCardHeaderDefault = Template.bind({});
export const SectionCardHeaderDraftStatus = Template.bind({});
export const SectionCardHeaderASCSortingOrder = Template.bind({});

SectionCardHeaderDefault.args = {
  title: 'Test Title',
  caption: 'Selected filter are displayed here',
  toggleModal: () => {},
  selectedFilter: null,
  setSelectedFilter: () => {},
  sortingOrder: true,
  setSortingOrder: () => {},
};

SectionCardHeaderDraftStatus.args = {
  title: 'Test Title',
  caption: 'Selected filter are displayed here',
  toggleModal: () => {},
  selectedFilter: 'draft',
  setSelectedFilter: () => {},
  sortingOrder: true,
  setSortingOrder: () => {},
};

SectionCardHeaderASCSortingOrder.args = {
  title: 'Test Title',
  caption: 'Selected filter are displayed here',
  toggleModal: () => {},
  selectedFilter: null,
  setSelectedFilter: () => {},
  sortingOrder: false,
  setSortingOrder: () => {},
};
