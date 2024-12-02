import { Paper, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import SimpleModal from '@common/SimpleModal';
import UserDemographics from '@features/Profile/UserDemographics/UserDemographics';
import UserDetails from '@features/Profile/UserDetails/UserDetails';
import UserStatus from '@features/Profile/UserStatus/UserStatus';
import AppearanceSettings from '@features/Profile/AppearanceSettings/AppearanceSettings';
import ProfileForm from '@features/Profile/ProfileForm/ProfileForm';

const ProfilePage = () => {
  const theme = useTheme();
  const onlySmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { profileDetails: data = {}, loading } = useSelector((state) => state.profile);

  const [editMode, setEditMode] = useState(false);

  return (
    <Stack spacing={2}>
      <Stack direction={onlySmallScreen ? 'column' : 'row'} spacing={1}>
        <UserDemographics data={data} handleEditMode={() => setEditMode(!editMode)} />
        <UserDetails data={data} />
      </Stack>
      <Paper sx={{ padding: '1rem' }}>
        <UserStatus data={data} onlySmallScreen={onlySmallScreen} />
      </Paper>
      <Paper sx={{ padding: '1rem' }}>
        <AppearanceSettings loading={loading} profileDetails={data} />
      </Paper>
      {editMode && (
        <SimpleModal
          open={editMode}
          handleClose={() => setEditMode(false)}
          maxSize={'sm'}
          title="Edit profile details"
          subtitle="Edit general details about yourself so others can notice you."
        >
          <ProfileForm />
        </SimpleModal>
      )}
    </Stack>
  );
};

export default ProfilePage;
