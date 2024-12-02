import { Stack } from '@mui/material';

export default function UserDemographicsRow({ children }) {
  return (
    <Stack direction={'row'} spacing={3} alignItems={'center'} justifyContent={'space-between'}>
      {children}
    </Stack>
  );
}
