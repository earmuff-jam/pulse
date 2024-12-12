import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Skeleton, Stack } from '@mui/material';
import { AddRounded } from '@mui/icons-material';

import SimpleModal from '@common/SimpleModal';
import { ConfirmationBoxModal } from '@common/utils';
import AddItem from '@common/ItemCard/AddItem/AddItem';
import ItemHeader from '@common/ItemCard/ItemHeader/ItemHeader';

import ItemContent from '@common/ItemCard/ItemContent/ItemContent';
import { inventoryActions } from '@features/Assets/inventorySlice';
import ItemGraphWrapper from '@common/ItemCard/ItemGraph/ItemGraphWrapper';
import { categoryItemDetailsActions } from '@features/CategoryItemDetails/categoryItemDetailsSlice';

export default function CategoryItemDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    selectedCategory,
    selectedCategoryImage,
    itemsInCategory = [],
    loading = false,
  } = useSelector((state) => state.categoryItemDetails);

  const [rowSelected, setRowSelected] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const [openConfirmationBoxModal, setOpenConfirmationBoxModal] = useState(false);

  const handleOpenModal = () => {
    setDisplayModal(true);
    dispatch(inventoryActions.getAllInventoriesForUser());
  };

  const handleOpenConfirmationBoxModal = () => setOpenConfirmationBoxModal(!openConfirmationBoxModal);

  const resetSelection = () => {
    setDisplayModal(false);
    setRowSelected([]);
  };

  const resetConfirmationBoxModal = () => setOpenConfirmationBoxModal(false);

  const confirmDelete = () => {
    dispatch(categoryItemDetailsActions.removeItemsFromCategory({ id: selectedCategory?.id, rowSelected }));
    enqueueSnackbar(`Removed association of assets for ${selectedCategory.name}.`, {
      variant: 'default',
    });
    resetConfirmationBoxModal();
  };

  const addItems = () => {
    const collaborators = selectedCategory.sharable_groups;
    dispatch(categoryItemDetailsActions.addItemsInCategory({ id: selectedCategory?.id, rowSelected, collaborators }));
    enqueueSnackbar(`Added association of assets for ${selectedCategory.name}.`, {
      variant: 'success',
    });
    resetSelection();
  };

  const handleRemoveAssociation = () => {
    handleOpenConfirmationBoxModal();
  };

  useEffect(() => {
    if (id) {
      dispatch(categoryItemDetailsActions.getItemsForCategory(id));
      dispatch(categoryItemDetailsActions.getCategory(id));
      dispatch(categoryItemDetailsActions.getSelectedImage({ id }));
    }
  }, [id]);

  if (loading) {
    return <Skeleton height="20rem" />;
  }

  return (
    <Stack direction="column" spacing="1rem">
      <ItemHeader
        label={selectedCategory?.name ? `${selectedCategory.name} Overview` : 'Category Overview'}
        caption="View details of selected category"
        item={selectedCategory}
        image={selectedCategoryImage}
      />
      <ItemContent
        selectedIDList={rowSelected}
        setSelectedIDList={setRowSelected}
        items={itemsInCategory}
        handleOpenModal={handleOpenModal}
        handleRemoveAssociation={handleRemoveAssociation}
      />
      <ItemGraphWrapper associatedAssets={itemsInCategory} />
      {displayModal && (
        <SimpleModal
          title={`Add items to ${selectedCategory?.name}`}
          handleClose={resetSelection}
          showSecondaryButton
          secondaryButtonAction={addItems}
          disableSecondaryButton={rowSelected.length <= 0}
          secondaryButtonIcon={<AddRounded />}
          maxSize="md"
        >
          <AddItem
            selectedIDList={rowSelected}
            setSelectedIDList={setRowSelected}
            resetSelection={resetSelection}
            associatedItems={itemsInCategory}
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
