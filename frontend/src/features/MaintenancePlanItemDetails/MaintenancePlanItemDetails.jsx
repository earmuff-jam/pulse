import { useEffect, useState } from 'react';

import { enqueueSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SimpleModal from '@common/SimpleModal';
import { Skeleton, Stack } from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { ConfirmationBoxModal } from '@common/utils';
import { inventoryActions } from '@features/InventoryList/inventorySlice';
import { maintenancePlanItemActions } from '@features/MaintenancePlanItemDetails/maintenancePlanItemSlice';
import MaintenancePlanItemDetailsGraph from '@features/MaintenancePlanItemDetails/MaintenancePlanItemDetailsContent/MaintenancePlanItemDetailsGraph';
import MaintenancePlanItemDetailsHeader from '@features/MaintenancePlanItemDetails/MaintenancePlanItemDetailsHeader/MaintenancePlanItemDetailsHeader';
import MaintenancePlanItemDetailsContent from '@features/MaintenancePlanItemDetails/MaintenancePlanItemDetailsContent/MaintenancePlanItemDetailsContent';
import MaintenancePlanItemDetailsAddAsset from '@features/MaintenancePlanItemDetails/MaintenancePlanItemDetailsAddAsset/MaintenancePlanItemDetailsAddAsset';

export default function MaintenancePlanItemDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    selectedMaintenancePlan,
    itemsInMaintenancePlan = [],
    selectedMaintenancePlanImage,
    loading = false,
  } = useSelector((state) => state.maintenancePlanItem);

  const [rowSelected, setRowSelected] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const [openConfirmationBoxModal, setOpenConfirmationBoxModal] = useState(false);

  const handleOpenModal = () => {
    setDisplayModal(true);
    dispatch(inventoryActions.getAllInventoriesForUser());
  };

  const handleOpenConfirmationBoxModal = () => setOpenConfirmationBoxModal(!openConfirmationBoxModal);

  const resetConfirmationBoxModal = () => setOpenConfirmationBoxModal(false);

  const confirmDelete = () => {
    dispatch(
      maintenancePlanItemActions.removeItemsFromMaintenancePlan({ id: selectedMaintenancePlan?.id, rowSelected })
    );
    enqueueSnackbar(`Removed association of assets for ${selectedMaintenancePlan.name}.`, {
      variant: 'default',
    });
    resetConfirmationBoxModal();
  };

  const addItems = () => {
    const collaborators = selectedMaintenancePlan.sharable_groups;
    dispatch(
      maintenancePlanItemActions.addItemsInPlan({ id: selectedMaintenancePlan?.id, rowSelected, collaborators })
    );
    enqueueSnackbar(`Added association of assets for ${selectedMaintenancePlan.name}.`, {
      variant: 'success',
    });
    resetSelection();
  };

  const handleRemoveAssociation = () => {
    handleOpenConfirmationBoxModal();
  };

  const resetSelection = () => {
    setDisplayModal(false);
    setRowSelected([]);
  };

  useEffect(() => {
    if (id) {
      dispatch(maintenancePlanItemActions.getItemsInMaintenancePlan(id));
      dispatch(maintenancePlanItemActions.getSelectedMaintenancePlan(id));
      dispatch(maintenancePlanItemActions.getSelectedImage({ id }));
    }
  }, [id]);

  if (loading) {
    return <Skeleton height="20rem" />;
  }

  return (
    <Stack spacing={1}>
      <MaintenancePlanItemDetailsHeader
        label={selectedMaintenancePlan?.name ? `${selectedMaintenancePlan.name} Overview` : 'Maintenance Plan Overview'}
        caption="View details of selected maintenance plan"
        item={selectedMaintenancePlan}
        image={selectedMaintenancePlanImage}
      />
      <MaintenancePlanItemDetailsContent
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        itemsInMaintenancePlan={itemsInMaintenancePlan}
        handleOpenModal={handleOpenModal}
        handleRemoveAssociation={handleRemoveAssociation}
      />
      <MaintenancePlanItemDetailsGraph totalItems={itemsInMaintenancePlan} />
      {displayModal && (
        <SimpleModal
          title={`Add items to ${selectedMaintenancePlan?.name}`}
          handleClose={resetSelection}
          maxSize="md"
          showSecondaryButton
          secondaryButtonAction={addItems}
          secondaryButtonIcon={<AddRounded />}
          disableSecondaryButton={rowSelected.length <= 0}
        >
          <MaintenancePlanItemDetailsAddAsset
            rowSelected={rowSelected}
            setRowSelected={setRowSelected}
            resetSelection={resetSelection}
            itemsInMaintenancePlan={itemsInMaintenancePlan}
          />
        </SimpleModal>
      )}
      <ConfirmationBoxModal
        openDialog={openConfirmationBoxModal}
        title="Confirm deletion"
        handleClose={resetConfirmationBoxModal}
        maxSize="xs"
        confirmDelete={confirmDelete}
      />
    </Stack>
  );
}
