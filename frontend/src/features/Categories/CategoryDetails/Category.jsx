import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';

import { Skeleton } from '@mui/material';
import relativeTime from 'dayjs/plugin/relativeTime';

import { categoryActions } from '../categoriesSlice';
import ItemCard from '../../../common/ItemCard/ItemCard';
import { ConfirmationBoxModal, EmptyComponent } from '../../../common/utils';

dayjs.extend(relativeTime);

const Category = ({ categories = [], loading, setSelectedCategoryID, setDisplayModal }) => {
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(-1);

  const handleDelete = (id) => {
    setOpenDialog(true);
    setIdToDelete(id);
  };

  const handleEdit = (id) => {
    setDisplayModal(true);
    setSelectedCategoryID(id);
  };

  const reset = () => {
    setOpenDialog(false);
    setIdToDelete(-1);
  };

  const confirmDelete = (id) => {
    if (id === -1) {
      return;
    }
    dispatch(categoryActions.removeCategory({ id }));
    reset();
  };

  useEffect(() => {
    dispatch(categoryActions.getCategories(100));
  }, []);

  if (loading) {
    return <Skeleton height="10rem" />;
  }
  if (categories?.length <= 0 || categories == null) {
    return <EmptyComponent />;
  }

  return (
    <>
      <ItemCard data={categories} handleDelete={handleDelete} handleEdit={handleEdit} prefixURI={'category'} />
      <ConfirmationBoxModal
        openDialog={openDialog}
        title="Confirm deletion"
        handleClose={reset}
        maxSize="xs"
        deleteID={idToDelete}
        confirmDelete={confirmDelete}
      />
    </>
  );
};

export default Category;
