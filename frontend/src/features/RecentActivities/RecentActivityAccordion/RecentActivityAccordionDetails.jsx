import { AccordionDetails } from '@mui/material';
import RecentActivity from '@features/RecentActivities/RecentActivity/RecentActivity';

export default function RecentActivityAccordionDetails({ index, activity }) {
  return (
    <AccordionDetails>
      <RecentActivity key={index} index={index} activity={activity} />
    </AccordionDetails>
  );
}
