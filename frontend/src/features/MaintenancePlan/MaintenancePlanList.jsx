import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { Box } from '@mui/material';
import SimpleModal from '@common/SimpleModal';
import MaintenancePlanContent from '@features/MaintenancePlan/MaintenancePlanContent/MaintenancePlanContent';
import MaintenancePlanAddPlan from '@features/MaintenancePlan/MaintenancePlanAddPlan/MaintenancePlanAddPlan';
import SectionCardHeader from '@common/SectionCard/SectionCardHeader';
import { maintenancePlanActions } from '@features/MaintenancePlan/maintenanceSlice';

const MaintenancePlanList = () => {
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

  const handleDownload = () => {
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
      <SectionCardHeader
        title="Maintenance Plans"
        caption={selectedFilter ? `Applying ${selectedFilter} status filter` : 'Assign items to maintenance plans'}
        primaryBtnTitle="Add plan"
        toggleModal={toggleModal}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        sortingOrder={sortingOrder}
        setSortingOrder={setSortingOrder}
        handleDownload={handleDownload}
      />
      <MaintenancePlanContent
        loading={loading}
        displayModal={displayModal}
        setDisplayModal={setDisplayModal}
        setSelectedMaintenancePlanID={setSelectedMaintenancePlanID}
        maintenancePlan={filterAndBuildMaintenancePlans(maintenancePlan, selectedFilter)}
      />
      {displayModal && (
        <SimpleModal
          title="Add new maintenance plan"
          subtitle="Create maintenance plan to associate assets and periodically perform checks on them.
"
          handleClose={handleCloseAddNewPlan}
          maxSize="sm"
        >
          <MaintenancePlanAddPlan
            maintenancePlan={maintenancePlan}
            handleCloseAddNewPlan={handleCloseAddNewPlan}
            selectedMaintenancePlanID={selectedMaintenancePlanID}
            setSelectedMaintenancePlanID={setSelectedMaintenancePlanID}
          />
        </SimpleModal>
      )}
    </Box>
  );
};

export default MaintenancePlanList;
