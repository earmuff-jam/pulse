import SectionCardHeaderButton from '@common/SectionCard/SectionCardHeaderButton';

export default {
  title: 'Common/SectionCard/SectionCardHeaderButton',
  component: SectionCardHeaderButton,
  tags: ['autodocs'],
};

const Template = (args) => <SectionCardHeaderButton {...args} />;

export const SectionCardHeaderButtonDefault = Template.bind({});

SectionCardHeaderButtonDefault.args = {
  title: 'Add plan',
  handleButtonClick: () => {},
  handleIconButtonClick: () => {},
};
