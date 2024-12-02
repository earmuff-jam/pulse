import StyledTimeline from '@features/RecentActivities/StyledTimeline/StyledTimeline';
import { CreateNewFolderRounded } from '@mui/icons-material';

export default {
  title: 'RecentActivities/StyledTimeline',
  component: StyledTimeline,
  tags: ['autodocs'],
};

const Template = (args) => <StyledTimeline {...args} />;

export const StyledTimelineDefault = Template.bind({});
export const StyledTimelineEmpty = Template.bind({});
export const StyledTimelineColorized = Template.bind({});
export const StyledTimelineLongLabel = Template.bind({});

StyledTimelineDefault.args = {
  color: 'primary',
  icon: <CreateNewFolderRounded />,
  label: 'Styled timeline label',
  secondaryLabel: 'Styled timeline secondary label',
};

StyledTimelineEmpty.args = {
  color: 'primary',
  icon: <CreateNewFolderRounded />,
  label: '',
  secondaryLabel: '',
};

StyledTimelineColorized.args = {
  color: 'success',
  icon: <CreateNewFolderRounded />,
  label: 'Styled timeline colorized primary label',
  secondaryLabel: 'Styled timeline colorized secondary label',
};

StyledTimelineLongLabel.args = {
  color: 'success',
  icon: <CreateNewFolderRounded />,
  label:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  secondaryLabel:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
};
