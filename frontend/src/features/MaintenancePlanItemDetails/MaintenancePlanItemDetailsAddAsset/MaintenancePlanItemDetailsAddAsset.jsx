import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

import { Stack } from '@mui/material';

import { VIEW_INVENTORY_LIST_HEADERS } from '../../InventoryList/constants';
import TableComponent from '../../../common/DataTable/CustomTableComponent/TableComponent';

export default function MaintenancePlanItemDetailsAddAsset({ rowSelected, setRowSelected, itemsInMaintenancePlan }) {
  const { inventories, loading: inventoriesLoading } = useSelector((state) => state.inventory);

  const handleRowSelection = (_, id) => {
    if (id === 'all') {
      setRowSelected(inventories.map((v) => v.id));
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

  return (
    <Stack spacing={1}>
      <TableComponent
        showActions={false}
        isLoading={inventoriesLoading}
        data={inventories.filter((inventory) => !itemsInMaintenancePlan?.some((item) => item.item_id === inventory.id))}
        columns={Object.values(VIEW_INVENTORY_LIST_HEADERS).filter((v) => v.displayConcise)}
        rowFormatter={rowFormatter}
        rowSelected={rowSelected}
        handleRowSelection={handleRowSelection}
        emptyComponentSubtext="Create inventory items to associate them."
      />
    </Stack>
  );
}
