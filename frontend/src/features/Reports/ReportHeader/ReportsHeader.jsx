import dayjs from 'dayjs';

import { Stack } from '@mui/material';
import RowHeader from '@common/RowHeader';
import relativeTime from 'dayjs/plugin/relativeTime';
import { capitalizeFirstLetter } from '@common/utils';
import { DownloadRounded, FilterAltRounded } from '@mui/icons-material';
import ReportCardWrapper from '@features/Reports/ReportCard/ReportCardWrapper';
import ReportItemDetails from '@features/Reports/ReportItemDetails/ReportItemDetails';

dayjs.extend(relativeTime);

export default function ReportsHeader({
  sinceValue,
  reports,
  loading,
  selectedAsset,
  selectedMaintenancePlan,
  setDisplayModal,
  downloadReports,
}) {
  const handleFilter = () => setDisplayModal(true);

  const renderCaption = () => {
    if (sinceValue) {
      return `Viewing reports since ${dayjs(sinceValue).fromNow()}`;
    } else {
      return `Viewing results for the ${dayjs().startOf('year').fromNow()}`;
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return dayjs(date).isValid() && `Since ${dayjs(sinceValue).format('MMM, YYYY')}`;
  };

  return (
    <Stack spacing={1}>
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
          <ReportItemDetails
            loading={loading}
            avatarValue={
              Object.keys(selectedMaintenancePlan) > 0 && capitalizeFirstLetter(selectedAsset?.updater_name?.charAt(0))
            }
            label={selectedAsset?.name || ''}
            caption={selectedAsset?.description || ''}
          />
        </ReportCardWrapper>
        <ReportCardWrapper title="Maintenance due">
          <ReportItemDetails
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
    </Stack>
  );
}
