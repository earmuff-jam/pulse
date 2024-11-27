import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';

import { Skeleton } from '@mui/material';
import relativeTime from 'dayjs/plugin/relativeTime';

import ItemCard from '../../../common/ItemCard/ItemCard';
import { maintenancePlanActions } from '../maintenanceSlice';
import { ConfirmationBoxModal, EmptyComponent } from '../../../common/utils';

dayjs.extend(relativeTime);

const Plan = ({ maintenancePlan, loading, displayModal, setDisplayModal, setSelectedMaintenancePlanID }) => {
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(-1);

  const handleDelete = (id) => {
    setOpenDialog(true);
    setIdToDelete(id);
  };

  const handleEdit = (id) => {
    setDisplayModal(true);
    setSelectedMaintenancePlanID(id);
  };
  const resetConfirmationBox = () => {
    setOpenDialog(false);
    setIdToDelete(-1);
  };

  const confirmDelete = (id) => {
    if (id === -1) {
      return;
    }
    dispatch(maintenancePlanActions.removePlan(id));
    resetConfirmationBox();
  };

  useEffect(() => {
    dispatch(maintenancePlanActions.getPlans(100));
  }, []);

  if (loading && !displayModal) {
    return <Skeleton height="10rem" />;
  }
  if (maintenancePlan?.length <= 0 || maintenancePlan == null) return <EmptyComponent />;

  return (
    <>
      <ItemCard data={maintenancePlan} handleEdit={handleEdit} handleDelete={handleDelete} prefixURI={'plan'} />
      <ConfirmationBoxModal
        openDialog={openDialog}
        title="Confirm deletion"
        handleClose={resetConfirmationBox}
        maxSize="xs"
        deleteID={idToDelete}
        confirmDelete={confirmDelete}
      />
    </>
  );
};

export default Plan;
