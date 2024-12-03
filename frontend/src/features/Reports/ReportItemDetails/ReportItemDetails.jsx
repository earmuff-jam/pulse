import { Avatar, Skeleton, Stack, Typography } from '@mui/material';

export default function ReportItemDetails({ loading, avatarValue, label, caption }) {
  if (loading) {
    return <Skeleton height="2rem" />;
  }
  return (
    <Stack direction="row" spacing={1} alignItems="center" marginTop="1rem">
      <Avatar>{avatarValue}</Avatar>
      <Stack>
        <Typography variant="h6">{label}</Typography>
        <Typography variant="caption">{caption}</Typography>
      </Stack>
    </Stack>
  );
}
