import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { produce } from 'immer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Card, CardMedia } from '@mui/material';
import relativeTime from 'dayjs/plugin/relativeTime';

import SimpleModal from '../SimpleModal';
import SharableGroups from '../SharableGroups';
import ImagePicker from '../ImagePicker/ImagePicker';
import { profileActions } from '../../features/Profile/profileSlice';
import DetailsCardItemContent from './ItemContent/DetailsCardItemContent';
import DetailsCardItemActions from './ItemContent/DetailsCardItemActions';
import { categoryActions } from '../../features/Categories/categoriesSlice';
import { maintenancePlanActions } from '../../features/MaintenancePlanList/maintenanceSlice';
import { categoryItemDetailsActions } from '../../features/CategoryItemDetails/categoryItemDetailsSlice';
import { maintenancePlanItemActions } from '../../features/MaintenancePlanDetails/maintenancePlanItemSlice';

dayjs.extend(relativeTime);

export default function DetailsCard({ selectedItem, selectedImage, isViewingCategory = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');

  const [editImgMode, setEditImgMode] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleUpload = (id, selectedImage) => {
    if (isViewingCategory) {
      dispatch(categoryItemDetailsActions.uploadImage({ id: id, selectedImage: selectedImage }));
    } else {
      dispatch(maintenancePlanItemActions.uploadImage({ id: id, selectedImage: selectedImage }));
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
    handleCloseModal();
  };

  useEffect(() => {
    dispatch(profileActions.getFavItems({ limit: 1000 }));
  }, []);

  return (
    <>
      <Card>
        <CardMedia sx={{ height: '10rem' }} image={selectedImage || '/blank_canvas.png'} />
        <DetailsCardItemContent selectedItem={selectedItem} isViewingCategory={isViewingCategory} />
        <DetailsCardItemActions
          selectedItem={selectedItem}
          handleOpenModal={handleOpenModal}
          setEditImgMode={setEditImgMode}
        />
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
