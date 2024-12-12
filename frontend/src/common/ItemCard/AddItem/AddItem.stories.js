import AddItem from '@common/ItemCard/AddItem/AddItem';

export default {
  title: 'Common/ItemCard/AddItem/AddItem',
  component: AddItem,
  tags: ['autodocs'],
};

const Template = (args) => <AddItem {...args} />;

export const AddItemDefault = Template.bind({});

AddItemDefault.args = {
  selectedIDList: [],
  setSelectedIDList: () => {},
  itemsInMaintenancePlan: [],
};
