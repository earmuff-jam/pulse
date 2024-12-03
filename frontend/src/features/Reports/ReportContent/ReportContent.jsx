import dayjs from 'dayjs';

import RowHeader from '@common/RowHeader';
import DataTable from '@common/DataTable/DataTable';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ITEMS_IN_MAINTENANCE_PLAN_HEADER } from '@features/MaintenancePlanList/constants';

dayjs.extend(relativeTime);

export default function ReportContent({ sinceValue, assets }) {
  return (
    <>
      <RowHeader title="Asset Details" caption={`Asset movement since ${dayjs(sinceValue).fromNow()}`} />
      <DataTable
        rows={assets}
        columns={ITEMS_IN_MAINTENANCE_PLAN_HEADER}
        subtitle={'Associate items into maintenance plan to begin.'}
      />
    </>
  );
}
