import ReportContent from '@features/Reports/ReportContent/ReportContent';
import dayjs from 'dayjs';

export default {
  title: 'Reports/ReportsContent',
  component: ReportContent,
  tags: ['autodocs'],
};

const Template = (args) => <ReportContent {...args} />;

export const ReportContentDefault = Template.bind({});

ReportContentDefault.args = {
  sinceValue: dayjs().toISOString(),
  assets: [
    {
      id: 'ffb9a4f5-524c-4831-adce-b33ce204d1ba',
      name: 'Dog food',
      description: '6 pounds of food bought from tractor supply',
      price: 96,
      status: 'HIDDEN',
      barcode: 'barcode#1123928',
      sku: 'sku#123456734',
      quantity: 1,
      location: 'Utility Closet',
      storage_location_id: '19ad327a-95bd-4830-85a1-c418958bee58',
      is_returnable: false,
      return_location: 'amazon return',
      max_weight: '12',
      min_weight: '4',
      max_height: '20',
      min_height: '12',
      associated_image_url: '',
      created_at: '2024-11-29T13:19:16.761097Z',
      created_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
      creator_name: 'IngestSvcUser',
      updated_at: '2024-11-29T13:19:16.761097Z',
      updated_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
      updator: 'IngestSvcUser',
      bought_at: 'Walmart',
      sharable_groups: ['fa956520-fc6c-4783-acc6-4ba743fae9dc'],
    },
    {
      id: 'a42ae4e9-da42-4f28-b963-86e48bf5bbc0',
      name: '4 pounds of kitty litter',
      description: 'Bought from tractor supply in fm969',
      price: 12,
      status: 'DRAFT',
      barcode: 'barcode#1123928',
      sku: 'sku#123456734',
      quantity: 12,
      location: 'Kitchen Pantry',
      storage_location_id: '85db4cab-6b44-4f7a-8b0f-ff778abadc61',
      is_returnable: false,
      return_location: 'amazon return',
      max_weight: '12',
      min_weight: '4',
      max_height: '20',
      min_height: '12',
      associated_image_url: '',
      created_at: '2024-11-29T13:19:16.757818Z',
      created_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
      creator_name: 'IngestSvcUser',
      updated_at: '2024-11-29T13:19:16.757818Z',
      updated_by: 'fa956520-fc6c-4783-acc6-4ba743fae9dc',
      updator: 'IngestSvcUser',
      bought_at: 'Walmart',
      sharable_groups: ['fa956520-fc6c-4783-acc6-4ba743fae9dc'],
    },
  ],
};
