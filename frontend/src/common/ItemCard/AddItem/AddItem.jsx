import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

import { Stack } from '@mui/material';
import { VIEW_INVENTORY_LIST_HEADERS } from '@features/Assets/constants';
import TableComponent from '@common/DataTable/CustomTableComponent/TableComponent';

export default function AddItem({ selectedIDList, setSelectedIDList, associatedItems }) {
  const { inventories, loading: inventoriesLoading } = useSelector((state) => state.inventory);

  const handleRowSelection = (_, id) => {
    if (id === 'all') {
      if (selectedIDList.length !== 0) {
        setSelectedIDList([]);
      } else {
        setSelectedIDList(inventories.map((v) => v.id));
      }
    } else {
      const selectedIndex = selectedIDList.indexOf(id);
      let draftSelected = [];
      if (selectedIndex === -1) {
        draftSelected = draftSelected.concat(selectedIDList, id);
      } else if (selectedIndex === 0) {
        draftSelected = draftSelected.concat(selectedIDList.slice(1));
      } else if (selectedIndex === selectedIDList.length - 1) {
        draftSelected = draftSelected.concat(selectedIDList.slice(0, -1));
      } else if (selectedIndex > 0) {
        draftSelected = draftSelected.concat(
          selectedIDList.slice(0, selectedIndex),
          selectedIDList.slice(selectedIndex + 1)
        );
      }
      setSelectedIDList(draftSelected);
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
        paper
        showActions={false}
        isLoading={inventoriesLoading}
        data={inventories.filter((inventory) => !associatedItems?.some((item) => item.item_id === inventory.id))}
        columns={Object.values(VIEW_INVENTORY_LIST_HEADERS).filter((v) => v.displayConcise)}
        rowFormatter={rowFormatter}
        selectedIDList={selectedIDList}
        handleRowSelection={handleRowSelection}
        emptyComponentSubtext="Add assets to associated them with selected plan."
      />
    </Stack>
  );
}
