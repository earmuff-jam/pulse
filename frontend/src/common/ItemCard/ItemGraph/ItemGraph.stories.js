import ItemGraph from '@common/ItemCard/ItemGraph/ItemGraph';

export default {
  title: 'Common/ItemCard/ItemGraph/ItemGraph',
  component: ItemGraph,
  tags: ['autodocs'],
};

const Template = (args) => <ItemGraph {...args} />;

export const ItemGraphDefault = Template.bind({});
export const ItemGraphMultiple = Template.bind({});
export const ItemGraphEmpty = Template.bind({});

ItemGraphDefault.args = {
  totalItems: [
    {
      id: '6e9df958-cb4d-4d5f-a38c-c31544eaa115',
      plan_id: 'd4d6ce04-1eb1-42fc-89ae-26abb6ac0c2b',
      item_id: 'ffb9a4f5-524c-4831-adce-b33ce204d1ba',
      name: 'Dog food',
      description: '6 pounds of food bought from tractor supply',
      price: '12.99',
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
};

ItemGraphEmpty.args = {
  totalItems: [],
};

ItemGraphMultiple.args = {
  totalItems: [
    {
      id: '6e9df958-cb4d-4d5f-a38c-c31544eaa115',
      plan_id: 'd4d6ce04-1eb1-42fc-89ae-26abb6ac0c2b',
      item_id: 'ffb9a4f5-524c-4831-adce-b33ce204d1ba',
      name: 'Dog food',
      description: '6 pounds of food bought from tractor supply',
      price: '12.99',
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
      id: '6e9df958-cb4d-4d5f-a38c-c31544eaa115',
      plan_id: 'd4d6ce04-1eb1-42fc-89ae-26abb6ac0c2b',
      item_id: 'ffb9a4f5-524c-4831-adce-b33ce204d1ba',
      name: 'Cat food',
      description: '4 pounds of food bought from tractor supply',
      price: '21.99',
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
};
