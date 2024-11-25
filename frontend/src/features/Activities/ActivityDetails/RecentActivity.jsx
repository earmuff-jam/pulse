import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CreateNewFolderRounded } from '@mui/icons-material';
import { RECENT_ACTIVITY_TYPE_MAPPER } from '../constants';
import { capitalizeFirstLetter } from '@utils/utils';
import StyledTimeline from '../StyledTimeline/StyledTimeline';

const RecentActivity = ({ activity }) => {
  dayjs.extend(relativeTime);
  return (
    <Stack key={activity.id} sx={{ borderRadius: '0.2rem', alignItems: 'flex-start' }}>
      <StyledTimeline
        color="primary"
        icon={<CreateNewFolderRounded fontSize="small" />}
        label={`${capitalizeFirstLetter(activity.custom_action)} ${activity.title}`}
        secondaryLabel={`${RECENT_ACTIVITY_TYPE_MAPPER[activity.type].display}`}
      />
      <Typography variant="caption" alignSelf="flex-end">
        {`Occured around ${dayjs(activity?.created_at).fromNow()} by ${activity?.creator}`}
      </Typography>
    </Stack>
  );
};

export default RecentActivity;
