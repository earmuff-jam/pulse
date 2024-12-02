import { Stack } from '@mui/material';
import {
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineContent,
  TimelineOppositeContent,
  Timeline,
} from '@mui/lab';

export default function StyledTimeline({ color = '', icon, label = '', secondaryLabel = '' }) {
  return (
    <Timeline sx={{ padding: 0, margin: 0 }}>
      <TimelineItem sx={{ alignItems: 'center' }}>
        <TimelineOppositeContent display="none" />
        <TimelineSeparator>
          <TimelineDot color={color}>{icon}</TimelineDot>
        </TimelineSeparator>
        <Stack>
          <TimelineContent variant="caption">{label}</TimelineContent>
          <TimelineContent variant="caption">{secondaryLabel}</TimelineContent>
        </Stack>
      </TimelineItem>
    </Timeline>
  );
}
