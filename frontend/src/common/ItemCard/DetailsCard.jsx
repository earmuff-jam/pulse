import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { produce } from 'immer';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SharableGroups from '@utils/SharableGroups';
import relativeTime from 'dayjs/plugin/relativeTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SimpleModal from '@common/SimpleModal/SimpleModal';
import ImagePicker from '@common/ImagePicker/ImagePicker';
import { profileActions } from '@features/Profile/profileSlice';
import { categoryActions } from '@features/Categories/categoriesSlice';
import { AddPhotoAlternateRounded, ShareRounded } from '@mui/icons-material';
import { maintenancePlanActions } from '@features/Maintenance/maintenanceSlice';
import { Badge, Button, Card, CardActions, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material';

dayjs.extend(relativeTime);

export default function DetailsCard({ selectedItem, selectedImage, isViewingCategory = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');
  const { favItems = [] } = useSelector((state) => state.profile);

  const [editImgMode, setEditImgMode] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const isFavourite = favItems.some(
    (v) => v.category_id === selectedItem.id || v.maintenance_plan_id === selectedItem.id
  );

  const isShared = selectedItem?.sharable_groups?.length > 1 || false;

  const handleUpload = (id, selectedImage) => {
    if (isViewingCategory) {
      dispatch(categoryActions.uploadImage({ id: id, selectedImage: selectedImage }));
    } else {
      dispatch(maintenancePlanActions.uploadImage({ id: id, selectedImage: selectedImage }));
    }
    setEditImgMode(false);
  };

  const updateCollaborators = (sharableGroups) => {
    const newMembers = sharableGroups.map((v) => v.value);
    const draftSelectionDetails = produce(selectedItem, (draft) => {
      draft.updated_by = userID;
      draft.sharable_groups = newMembers;
      if (isViewingCategory) {
        draft.status = draft.status_name;
      } else {
        draft.maintenance_status = draft.maintenance_status_name;
      }
    });
    if (isViewingCategory) {
      dispatch(categoryActions.updateCategory(draftSelectionDetails));
      if (!newMembers.includes(userID)) {
        navigate('/');
      }
    } else {
      dispatch(maintenancePlanActions.updatePlan(draftSelectionDetails));
      if (!newMembers.includes(userID)) {
        navigate('/');
      }
    }
  };

  const handleFavItem = (_, selectedID, isFavourite) => {
    let draftFavItem = {};
    if (isViewingCategory) {
      draftFavItem = { category_id: selectedID };
    } else {
      draftFavItem = { maintenance_plan_id: selectedID };
    }

    if (isFavourite) {
      // toggle fav off if exists
      const currentItems = favItems?.filter(
        (v) => v.category_id === selectedID || v.maintenance_plan_id === selectedID
      );
      const currentItem = currentItems.find(() => true);
      dispatch(profileActions.removeFavItem(currentItem?.id));
    } else {
      dispatch(profileActions.saveFavItem(draftFavItem));
    }
  };

  useEffect(() => {
    dispatch(profileActions.getFavItems({ limit: 1000 }));
  }, []);

  return (
    <>
      <Card>
        <CardMedia sx={{ height: '10rem' }} image={selectedImage || '/blank_canvas.png'} />
        <CardContent>
          <Stack direction="row" alignItems="flex-start">
            <IconButton size="small" onClick={(ev) => handleFavItem(ev, selectedItem.id, isFavourite)}>
              <FavoriteIcon fontSize="small" sx={{ color: isFavourite ? selectedItem.color : 'secondary.main' }} />
            </IconButton>
            <Typography gutterBottom variant="h5" component="div">
              {selectedItem.name}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {selectedItem.description}
          </Typography>
        </CardContent>
        <CardActions
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}
        >
          <Typography variant="caption">Last updated {dayjs(selectedItem?.updated_at).fromNow()}</Typography>
          <Stack direction="row" alignItems="center">
            <Badge
              badgeContent={isShared ? selectedItem?.sharable_groups.length - 1 : 0} // account for creator in sharable_groups
              color="secondary"
              max={10}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Button size="small" endIcon={<ShareRounded />} onClick={handleOpenModal}>
                Share
              </Button>
            </Badge>
            <IconButton onClick={() => setEditImgMode(true)}>
              <AddPhotoAlternateRounded />
            </IconButton>
          </Stack>
        </CardActions>
      </Card>
      {openModal && (
        <SimpleModal
          title="Add sharable groups"
          subtitle="Assign collaborators."
          handleClose={handleCloseModal}
          maxSize="sm"
        >
          <SharableGroups
            handleSubmit={updateCollaborators}
            existingGroups={selectedItem?.sharable_groups || []}
            creator={selectedItem?.created_by}
          />
        </SimpleModal>
      )}
      {editImgMode && (
        <SimpleModal
          title="Assign image"
          subtitle="Assign image to the selected item."
          handleClose={() => setEditImgMode(false)}
          maxSize="sm"
        >
          <ImagePicker id={selectedItem.id} name={selectedItem.name} handleUpload={handleUpload} disableCancel />
        </SimpleModal>
      )}
    </>
  );
}
