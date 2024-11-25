import { useEffect, useState } from 'react';
import { AddRounded, FileDownload } from '@mui/icons-material';
import { Box, Button, IconButton, Stack } from '@mui/material';
import AddPlan from './AddPlan';
import Plan from './Plan';
import RowHeader from '../../utils/RowHeader';
import { useDispatch, useSelector } from 'react-redux';
import FilterAndSortMenu from '../../common/FilterAndSortMenu/FilterAndSortMenu';
import { maintenancePlanActions } from './maintenanceSlice';
import SimpleModal from '@common/SimpleModal/SimpleModal';

const PlanList = () => {
  const dispatch = useDispatch();
  const { maintenancePlan, loading } = useSelector((state) => state.maintenance);

  const [sortedData, setSortedData] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState('');
  const [sortingOrder, setSortingOrder] = useState(true); // false ascending
  const [selectedMaintenancePlanID, setSelectedMaintenancePlanID] = useState('');

  const toggleModal = () => setDisplayModal(!displayModal);
  const handleCloseAddNewPlan = () => {
    setDisplayModal(false);
    setSelectedMaintenancePlanID('');
  };

  const downloadMaintenancePlans = () => {
    dispatch(maintenancePlanActions.download());
  };

  const filterAndBuildMaintenancePlans = (plans, selectedFilter) => {
    if (selectedFilter.length > 0) {
      return plans.filter((element) => element.maintenance_status_name === selectedFilter);
    } else {
      return sortedData;
    }
  };

  useEffect(() => {
    if (sortingOrder) {
      if (maintenancePlan.length > 0) {
        const draft = [...maintenancePlan].sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
        setSortedData(draft);
      }
    } else {
      setSortedData(maintenancePlan);
    }
  }, [sortingOrder, maintenancePlan]);

  return (
    <Box sx={{ py: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <RowHeader
          title="Maintenance Plans"
          caption={selectedFilter ? `Applying ${selectedFilter} filter` : 'Assign items to maintenance plan(s)'}
        />
        <Stack direction="row" spacing="1rem">
          <Button onClick={toggleModal} startIcon={<AddRounded />} variant="outlined">
            Add Plan
          </Button>
          <IconButton size="small" onClick={downloadMaintenancePlans}>
            <FileDownload fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <FilterAndSortMenu
        sortingOrder={sortingOrder}
        setSortingOrder={setSortingOrder}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      <Plan
        maintenancePlan={filterAndBuildMaintenancePlans(maintenancePlan, selectedFilter)}
        loading={loading}
        displayModal={displayModal}
        setDisplayModal={setDisplayModal}
        setSelectedMaintenancePlanID={setSelectedMaintenancePlanID}
      />
      {displayModal && (
        <SimpleModal title="Add new maintenance plan" handleClose={handleCloseAddNewPlan} maxSize="md">
          <AddPlan
            handleCloseAddNewPlan={handleCloseAddNewPlan}
            maintenancePlan={maintenancePlan}
            selectedMaintenancePlanID={selectedMaintenancePlanID}
            setSelectedMaintenancePlanID={setSelectedMaintenancePlanID}
          />
        </SimpleModal>
      )}
    </Box>
  );
};

export default PlanList;
