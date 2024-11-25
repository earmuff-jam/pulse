import { Stack } from '@mui/material';
import RowHeader from '../../utils/RowHeader';
import ReportCardWrapper from './ReportCardWrapper';
import dayjs from 'dayjs';
import { DownloadRounded, FilterAltRounded } from '@mui/icons-material';
import { capitalizeFirstLetter } from '../../utils/utils';
import ItemDetails from './ItemDetails';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { inventoryActions } from '../InventoryList/inventorySlice';
import { maintenancePlanActions } from '../Maintenance/maintenanceSlice';
import DataTable from '../../common/DataTable/DataTable';
import { ITEMS_IN_MAINTENANCE_PLAN_HEADER } from '../Maintenance/constants';
import FilterMenu from './FilterMenu';
import { reportActions } from './reportSlice';
import { FILTER_OPTIONS } from './constants';
import SimpleModal from '@common/SimpleModal/SimpleModal';

export default function Reports() {
  const dispatch = useDispatch();
  const { inventories = [], loading } = useSelector((state) => state.inventory);
  const { reports = [], loading: reportLoading } = useSelector((state) => state.reports);
  const { maintenancePlan: maintenancePlanList = [], loading: maintenancePlanListLoading } = useSelector(
    (state) => state.maintenance
  );

  const [includeOverdue, setIncludeOverdue] = useState(true);
  const [sinceValue, setSinceValue] = useState(FILTER_OPTIONS.find((item) => item.label === 'ytd').value);
  const [selectedAsset, setSelectedAsset] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const [selectedMaintenancePlan, setSelectedMaintenancePlan] = useState([]);

  const handleFilter = () => setDisplayModal(true);
  const closeFilter = () => setDisplayModal(false);

  const renderCaption = () => {
    if (sinceValue) {
      return `Viewing reports since ${dayjs(sinceValue).fromNow()}`;
    } else {
      return `Viewing results for the ${dayjs().startOf('year').fromNow()}`;
    }
  };

  const downloadReports = () => {
    dispatch(reportActions.downloadReports({ since: sinceValue, includeOverdue: includeOverdue, inventories }));
  };

  const formatDate = (date) => {
    if (!date) return null;
    return dayjs(date).isValid() && `Since ${dayjs(sinceValue).format('MMM, YYYY')}`;
  };

  useEffect(() => {
    if (!loading && inventories.length > 0) {
      setSelectedAsset(inventories[0] || {});
    }
  }, [loading, inventories.length]);

  useEffect(() => {
    if (!maintenancePlanListLoading && maintenancePlanList.length > 0) {
      setSelectedMaintenancePlan(maintenancePlanList[0]);
    }
  }, [maintenancePlanListLoading, maintenancePlanList.length]);

  useEffect(() => {
    dispatch(inventoryActions.getAllInventoriesForUser({ since: sinceValue }));
    dispatch(maintenancePlanActions.getPlans());
  }, []);

  useEffect(() => {
    if (!reportLoading && reports.length <= 0) {
      dispatch(reportActions.getReports({ since: dayjs().startOf('year').toISOString(), includeOverdue: true }));
    }
  }, [reportLoading]);

  return (
    <>
      <RowHeader
        title="Reports Overview"
        caption={renderCaption()}
        primaryStartIcon={<FilterAltRounded />}
        primaryButtonTextLabel={'Filter results'}
        handleClickPrimaryButton={handleFilter}
        secondaryStartIcon={<DownloadRounded />}
        secondaryButtonTextLabel={'Export'}
        handleClickSecondaryButton={() => downloadReports()}
      />
      <Stack spacing="1rem">
        <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: '1rem' }}>
          <ReportCardWrapper
            title="Valuation"
            chipLabel={formatDate(sinceValue)}
            value={`$${reports[0]?.total_valuation.toFixed(2) || 0.0}`}
            footerText="Total cost of items in"
            footerSuffix="dollar value."
          />
          <ReportCardWrapper
            title="Categorized Assets"
            chipLabel={formatDate(sinceValue)}
            value={`$${reports[0]?.cost_category_items.toFixed(2) || 0.0}`}
          />
        </Stack>
        <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: '1rem' }}>
          <ReportCardWrapper title="Recently Added Asset">
            <ItemDetails
              loading={loading}
              avatarValue={
                Object.keys(selectedMaintenancePlan) > 0 &&
                capitalizeFirstLetter(selectedAsset?.updater_name?.charAt(0))
              }
              label={selectedAsset?.name || ''}
              caption={selectedAsset?.description || ''}
            />
          </ReportCardWrapper>
          <ReportCardWrapper title="Maintenance due">
            <ItemDetails
              loading={loading}
              avatarValue={
                Object.keys(selectedMaintenancePlan) > 0 &&
                capitalizeFirstLetter(selectedMaintenancePlan?.updator?.charAt(0))
              }
              label={selectedMaintenancePlan?.name || ''}
              caption={selectedMaintenancePlan?.description || ''}
            />
          </ReportCardWrapper>
        </Stack>
        <RowHeader title="Asset Details" caption={`Asset movement since ${dayjs(sinceValue).fromNow()}`} />
        <DataTable
          rows={inventories}
          columns={ITEMS_IN_MAINTENANCE_PLAN_HEADER}
          subtitle={'Associate items into maintenance plan to begin.'}
        />
      </Stack>
      {displayModal && (
        <SimpleModal
          title="Filter results"
          subtitle="Select time range to filter the selected results for."
          handleClose={closeFilter}
          maxSize="sm"
        >
          <FilterMenu
            handleClose={closeFilter}
            sinceValue={sinceValue}
            setSinceValue={setSinceValue}
            includeOverdue={includeOverdue}
            setIncludeOverdue={setIncludeOverdue}
          />
        </SimpleModal>
      )}
    </>
  );
}
