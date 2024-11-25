import { Paper, Stack, useMediaQuery } from '@mui/material';
import UserDemographics from './UserDetails/UserDemographics';
import UserDetails from './UserDetails/UserDetails';
import UserStatus from './UserDetails/UserStatus';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import AppearanceSettings from './UserDetails/AppearanceSettings';
import ProfileForm from './ProfileForm/ProfileForm';
import { useTheme } from '@emotion/react';
import SimpleModal from '@common/SimpleModal/SimpleModal';

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
