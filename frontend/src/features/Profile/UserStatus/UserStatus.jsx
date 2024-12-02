import UserStats from '@features/Profile/UserStats/UserStats';
import { Divider, Stack, Typography } from '@mui/material';

export default function UserStatus({ onlySmallScreen }) {
  const profileStats = [
    {
      id: 1,
      label: 'Total Categories',
      caption: 'The total number of categories created',
      value: 2,
      color: 'rgb(255, 99, 132)',
    },
    {
      id: 2,
      label: 'Total Maintenance Plans',
      caption: 'The total number of maintenance plans created',
      value: 3,
      color: 'rgb(54, 162, 235)',
    },
    {
      id: 3,
      label: 'Total assets',
      caption: 'The total number of assets created',
      value: 4,
      color: 'rgb(255, 205, 86)',
    },
  ];

  const total = profileStats.map(({ value }) => value).reduce((acc, el) => acc + el, 0);

  return (
    <>
      <Typography variant="h5" color="text.secondary">
        Profile Stats
      </Typography>
      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />
      <Stack direction={onlySmallScreen ? 'column' : 'row'} justifyContent={'space-between'} useFlexGap flexWrap="wrap">
        {profileStats.map((v) => (
          <Stack key={v.id} alignItems={'center'} spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              {v.label}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              {v.value}
            </Typography>
            <UserStats label={v.label} value={v.value} color={v.color} total={total} />
          </Stack>
        ))}
      </Stack>
    </>
  );
}
