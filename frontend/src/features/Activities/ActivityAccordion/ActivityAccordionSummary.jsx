import { ExpandMoreRounded } from '@mui/icons-material';
import { AccordionSummary, Stack, Typography } from '@mui/material';
import { capitalizeFirstLetter } from '@utils/utils';

export default function ActivityAccordionSummary({ title, label, prefix }) {
  return (
    <AccordionSummary expandIcon={<ExpandMoreRounded />}>
      <Stack>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="caption">{`${capitalizeFirstLetter(label)} ${prefix}`}</Typography>
      </Stack>
    </AccordionSummary>
  );
}
