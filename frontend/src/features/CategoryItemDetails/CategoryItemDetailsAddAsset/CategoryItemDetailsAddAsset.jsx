import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Stack } from '@mui/material';

import { categoryItemDetailsActions } from '../categoryItemDetailsSlice';
import { VIEW_INVENTORY_LIST_HEADERS } from '../../InventoryList/constants';
import TableComponent from '../../../common/DataTable/CustomTableComponent/TableComponent';

export default function CategoryItemDetailsAddAsset({
  selectedCategory,
  rowSelected,
  setRowSelected,
  resetSelection,
  itemsInCategory,
}) {
  const dispatch = useDispatch();
  const { inventories, loading: inventoriesLoading } = useSelector((state) => state.inventory);

  const unassignedAssetsForCategories = inventories.filter(
    (inventory) => !itemsInCategory?.some((item) => item.item_id === inventory.id)
  );

  const handleRowSelection = (_, id) => {
    if (id === 'all') {
      if (rowSelected.length !== 0) {
        setRowSelected([]);
      } else {
        setRowSelected(unassignedAssetsForCategories.map((v) => v.id));
      }
    } else {
      const selectedIndex = rowSelected.indexOf(id);
      let draftSelected = [];
      if (selectedIndex === -1) {
        draftSelected = draftSelected.concat(rowSelected, id);
      } else if (selectedIndex === 0) {
        draftSelected = draftSelected.concat(rowSelected.slice(1));
      } else if (selectedIndex === rowSelected.length - 1) {
        draftSelected = draftSelected.concat(rowSelected.slice(0, -1));
      } else if (selectedIndex > 0) {
        draftSelected = draftSelected.concat(rowSelected.slice(0, selectedIndex), rowSelected.slice(selectedIndex + 1));
      }
      setRowSelected(draftSelected);
    }
  };

  const rowFormatter = (row, column) => {
    if (['created_at', 'updated_at'].includes(column)) {
      return dayjs(row[column]).fromNow();
    }
    if (['updater_name', 'creator_name'].includes(column)) {
      return row[column] ?? '-';
    }
    return row[column] ?? '-';
  };

  const addItems = () => {
    const collaborators = selectedCategory.sharable_groups;
    dispatch(categoryItemDetailsActions.addItemsInCategory({ id: selectedCategory?.id, rowSelected, collaborators }));
    resetSelection();
  };

  return (
    <Stack spacing={1}>
      <Button variant="outlined" disabled={rowSelected.length <= 0} sx={{ mt: '1rem' }} onClick={addItems}>
        Add Selected items
      </Button>
      <TableComponent
        isLoading={inventoriesLoading}
        showActions={false}
        data={unassignedAssetsForCategories}
        columns={Object.values(VIEW_INVENTORY_LIST_HEADERS).filter((v) => v.displayConcise)}
        rowFormatter={rowFormatter}
        rowSelected={rowSelected}
        handleRowSelection={handleRowSelection}
        emptyComponentSubtext="Create inventory items to associate them."
      />
    </Stack>
  );
}
