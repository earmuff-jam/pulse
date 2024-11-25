import { Box, Button, Skeleton, Stack } from '@mui/material';
import BarChart from '@common/Chart/BarChart';
import TableComponent from '../InventoryList/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import { AddRounded } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import DetailsCard from '../../common/ItemCard/DetailsCard';
import RowHeader from '../../utils/RowHeader';
import DataTable from '../../common/DataTable/DataTable';
import { ITEMS_IN_MAINTENANCE_PLAN_HEADER } from './constants';
import { maintenancePlanActions } from './maintenanceSlice';
import { useParams } from 'react-router-dom';
import { VIEW_INVENTORY_LIST_HEADERS } from '../InventoryList/constants';
import { generateTitleColor } from '../../utils/utils';
import dayjs from 'dayjs';
import { inventoryActions } from '../InventoryList/inventorySlice';
import SimpleModal from '@common/SimpleModal/SimpleModal';

export default function MaintenanceItem() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { inventories, loading: inventoriesLoading } = useSelector((state) => state.inventory);
  const {
    maintenancePlan,
    selectedMaintenancePlan,
    itemsInMaintenancePlan = [],
    selectedMaintenancePlanImage,
    loading = false,
  } = useSelector((state) => state.maintenance);

  const [displayModal, setDisplayModal] = useState(false);
  const [rowSelected, setRowSelected] = useState([]);

  const handleOpenModal = () => {
    setDisplayModal(true);
    dispatch(inventoryActions.getAllInventoriesForUser());
  };

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

  const resetSelection = () => {
    setDisplayModal(false);
    setRowSelected([]);
  };

  const addItems = () => {
    const collaborators = maintenancePlan.find((v) => v.id === id).sharable_groups;
    dispatch(maintenancePlanActions.addItemsInPlan({ rowSelected, id, collaborators }));
    resetSelection();
  };

  useEffect(() => {
    if (id) {
      dispatch(maintenancePlanActions.getItemsInMaintenancePlan(id));
      dispatch(maintenancePlanActions.getSelectedMaintenancePlan(id));
      dispatch(maintenancePlanActions.getSelectedImage({ id }));
    }
  }, [id]);

  if (loading) {
    return <Skeleton height="20rem" />;
  }

  return (
    <Stack direction="column" spacing="1rem">
      <RowHeader
        title={selectedMaintenancePlan?.name ? `${selectedMaintenancePlan.name} Overview` : 'Maintenance Plan Overview'}
        caption="View details of selected maintenance plan"
      />
      <DetailsCard selectedItem={selectedMaintenancePlan} selectedImage={selectedMaintenancePlanImage} />
      <RowHeader
        title="Items"
        caption={`Total ${itemsInMaintenancePlan?.length || 0} item(s)`}
        primaryButtonTextLabel="Add Items"
        primaryStartIcon={<AddRounded />}
        handleClickPrimaryButton={handleOpenModal}
      />
      <DataTable
        rows={itemsInMaintenancePlan}
        columns={ITEMS_IN_MAINTENANCE_PLAN_HEADER}
        isEmpty={itemsInMaintenancePlan === null}
        subtitle={'Associate items into maintenance plan to begin.'}
      />
      <RowHeader title="Graph" caption="Graph details for last 10 recently updated" />
      <Box sx={{ position: 'relative', width: 'calc(100% - 1rem)' }}>
        <BarChart
          legendLabel="Name Vs Cost"
          data={
            itemsInMaintenancePlan
              ?.filter((_, index) => index < 10)
              ?.map((v, index) => ({
                label: v.name,
                count: v.price,
                color: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'][index % 2],
              })) || []
          }
          backgroundColor="rgba(75, 192, 192, 0.4)"
          borderColor="rgba(75, 192, 192, 1)"
        />
      </Box>
      {displayModal && (
        <SimpleModal title={`Add items to ${selectedMaintenancePlan?.name}`} handleClose={resetSelection} maxSize="md">
          <Button variant="outlined" disabled={rowSelected.length <= 0} sx={{ mt: '1rem' }} onClick={addItems}>
            Add Selected items
          </Button>
          <TableComponent
            isLoading={inventoriesLoading}
            hideCheckBox={false}
            hideIconButton={true}
            hideMoreDetailsButton={true}
            data={inventories.filter(
              (inventory) => !itemsInMaintenancePlan?.some((item) => item.item_id === inventory.id)
            )}
            columns={Object.values(VIEW_INVENTORY_LIST_HEADERS).filter((v) => v.displayConcise)}
            rowFormatter={rowFormatter}
            generateTitleColor={generateTitleColor}
            rowSelected={rowSelected}
            onRowSelect={() => {}}
            handleRowSelection={handleRowSelection}
            emptyComponentSubtext="Create inventory items to associate them."
          />
        </SimpleModal>
      )}
    </Stack>
  );
}
