import { Button, IconButton, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { AddRounded, FileDownload } from '@mui/icons-material';
import AddCategory from './AddCategory';
import RowHeader from '../../utils/RowHeader';
import Category from './Category';
import { useDispatch, useSelector } from 'react-redux';
import FilterAndSortMenu from '../../common/FilterAndSortMenu/FilterAndSortMenu';
import { categoryActions } from './categoriesSlice';
import SimpleModal from '@common/SimpleModal/SimpleModal';


const CategoryList = ({ displayConcise = false }) => {
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector((state) => state.categories);

  const [sortedData, setSortedData] = useState([]);
  const [sortingOrder, setSortingOrder] = useState(true); // false ascending

  const [displayModal, setDisplayModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedCategoryID, setSelectedCategoryID] = useState('');

  const handleClose = () => {
    setDisplayModal(false);
    setSelectedCategoryID('');
  };

  const toggleModal = () => setDisplayModal(!displayModal);
  const downloadCategories = () => dispatch(categoryActions.download());

  const filterAndBuildCategories = (displayConcise, categories, selectedFilter) => {
    if (displayConcise) {
      return categories?.slice(0, 4);
    } else if (selectedFilter.length > 0) {
      return categories.filter((element) => element.status_name === selectedFilter);
    } else {
      return sortedData;
    }
  };

  const buildCaption = (displayConcise, selectedFilter) => {
    if (displayConcise) {
      return categories?.length ? `Viewing recently edited categories` : null;
    } else if (selectedFilter) {
      return `Applying ${selectedFilter} filter`;
    } else {
      return 'Organize items into categories.';
    }
  };

  useEffect(() => {
    if (sortingOrder) {
      if (categories && categories.length > 0) {
        const draft = [...categories].sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
        setSortedData(draft);
      }
    } else {
      setSortedData(categories);
    }
  }, [sortingOrder, categories]);

  return (
    <Stack sx={{ py: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <RowHeader title="Categories" caption={buildCaption(displayConcise, selectedFilter)} />
        <Stack direction="row" spacing="1rem">
          <Button onClick={toggleModal} startIcon={<AddRounded />} variant="outlined">
            Add Category
          </Button>
          {!displayConcise && (
            <IconButton
              size="small"
              disabled={Boolean(categories) && categories.length <= 0}
              onClick={downloadCategories}
            >
              <FileDownload fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Stack>
      {!displayConcise && (
        <FilterAndSortMenu
          sortingOrder={sortingOrder}
          setSortingOrder={setSortingOrder}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      )}
      <Category
        categories={filterAndBuildCategories(displayConcise, categories, selectedFilter)} // sorted data is after sort method
        loading={loading}
        setSelectedCategoryID={setSelectedCategoryID}
        setDisplayModal={setDisplayModal}
      />
      {displayModal && (
        <SimpleModal title="Add New Category" handleClose={handleClose} maxSize="md">
          <AddCategory
            categories={categories}
            loading={loading}
            handleCloseAddCategory={handleClose}
            selectedCategoryID={selectedCategoryID}
            setSelectedCategoryID={setSelectedCategoryID}
          />
        </SimpleModal>
      )}
    </Stack>
  );
};

export default CategoryList;
