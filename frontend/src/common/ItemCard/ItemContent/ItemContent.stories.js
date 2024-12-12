import ItemContent from '@common/ItemCard/ItemContent/ItemContent';

export default {
  title: 'Common/ItemCard/ItemContent',
  component: ItemContent,
  tags: ['autodocs'],
};

const Template = (args) => <ItemContent {...args} />;

export const ItemContentDefault = Template.bind({});
export const ItemContentMultipleList = Template.bind({});
export const ItemContentEmpty = Template.bind({});

ItemContentDefault.args = {
  selectedIDList: ['6e9df958-cb4d-4d5f-a38c-c31544eaa115'],
  itemsInMaintenancePlan: [
    {
      id: '6e9df958-cb4d-4d5f-a38c-c31544eaa115',
      plan_id: 'd4d6ce04-1eb1-42fc-89ae-26abb6ac0c2b',
      item_id: 'ffb9a4f5-524c-4831-adce-b33ce204d1ba',
      name: 'Dog food',
      description: '6 pounds of food bought from tractor supply',
      price: '96.0000',
      quantity: '1',
      location: 'Utility Closet',
      created_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
      created_at: '2024-12-04T00:16:28.764826Z',
      creator: 'IngestSvcUser',
      updated_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
      updated_at: '2024-12-04T00:16:28.764826Z',
      updator: 'IngestSvcUser',
      sharable_groups: ['fa956520-fc6c-4783-acc6-4ba743fae9dc'],
    },
  ],
  setSelectedIDList: () => {},
  handleOpenModal: () => {},
  handleRemoveAssociation: () => {},
};

ItemContentEmpty.args = {
  selectedIDList: [],
  itemsInMaintenancePlan: [],
  setSelectedIDList: () => {},
  handleOpenModal: () => {},
  handleRemoveAssociation: () => {},
};

ItemContentMultipleList.args = {
  selectedIDList: [],
  itemsInMaintenancePlan: [
    {
      id: '6e9df958-cb4d-4d5f-a38c-c31544eaa115',
      plan_id: 'd4d6ce04-1eb1-42fc-89ae-26abb6ac0c2b',
      item_id: 'ffb9a4f5-524c-4831-adce-b33ce204d1ba',
      name: 'Dog food',
      description: '6 pounds of food bought from tractor supply',
      price: '96.0000',
      quantity: '1',
      location: 'Utility Closet',
      created_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
      created_at: '2024-12-04T00:16:28.764826Z',
      creator: 'IngestSvcUser',
      updated_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
      updated_at: '2024-12-04T00:16:28.764826Z',
      updator: 'IngestSvcUser',
      sharable_groups: ['fa956520-fc6c-4783-acc6-4ba743fae9dc'],
    },
    {
      id: '6e9df958-cb4d-4d5f-a38c-c31544eaa116',
      plan_id: 'd4d6ce04-1eb1-42fc-89ae-26abb6ac0c25',
      item_id: 'ffb9a4f5-524c-4831-adce-b33ce204d1bv',
      name: 'Cat food',
      description: '12 pounds bought from tractor supply',
      price: '24.000',
      quantity: '1',
      location: 'Utility Closet',
      created_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
      created_at: '2024-12-04T00:16:28.764826Z',
      creator: 'IngestSvcUser',
      updated_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
      updated_at: '2024-12-04T00:16:28.764826Z',
      updator: 'IngestSvcUser',
      sharable_groups: ['fa956520-fc6c-4783-acc6-4ba743fae9dc'],
    },
  ],
  setSelectedIDList: () => {},
  handleOpenModal: () => {},
  handleRemoveAssociation: () => {},
};
