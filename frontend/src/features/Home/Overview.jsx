import { Card, CardContent, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { CategoryRounded, EngineeringRounded, WarningRounded } from '@mui/icons-material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assetSummaryActions } from './SummarySlice';
import { prefix } from '../../utils/utils';
import RowHeader from '../../utils/RowHeader';
import dayjs from 'dayjs';
import PieChart from '@common/Chart/PieChart';

const Overview = () => {
  const dispatch = useDispatch();
  const { assetSummary = [], loading } = useSelector((state) => state.summary);

  const categories = assetSummary?.AssetSummaryList?.filter((v) => v.type.toUpperCase() === 'C') || [];
  const maintenancePlans = assetSummary?.AssetSummaryList?.filter((v) => v.type.toUpperCase() === 'M') || [];
  const assets = assetSummary?.AssetList || [];
  const zeroCostItems = assets.filter((v) => v.price === 0);
  const totalPastDueItems = assets.filter((v) => dayjs(v.returntime).isBefore(dayjs())).length || 0;
  const totalAssetCosts = assets.reduce((acc, el) => {
    acc += el?.price || 0;
    return acc;
  }, 0);

  const totalItemsUnderCategory = categories.reduce((acc, el) => {
    if (el.items && el.items[0] != '') {
      acc += el.items.length;
    }
    return acc;
  }, 0);

  const totalItemsUnderMaintenancePlans = maintenancePlans.reduce((acc, el) => {
    if (el.items && el.items[0] != '') {
      acc += el.items.length;
    }
    return acc;
  }, 0);

  useEffect(() => {
    dispatch(assetSummaryActions.getAssetSummary());
  }, []);

  if (loading) {
    return <Skeleton height="50vh" />;
  }

  return (
    <>
      <RowHeader title="Overview" caption="View summary details about your assets" />
      <Stack spacing={{ xs: 1 }}>
        <RowHeader title="Asset Summary" />
        <Stack direction="row" spacing={{ xs: 1 }} useFlexGap flexWrap="wrap">
          <CardItem>
            <ColumnItem
              label="under assigned categories"
              icon={<CategoryRounded />}
              color="primary"
              dataLabel={totalItemsUnderCategory}
              loading={false}
            />
          </CardItem>
          <CardItem>
            <ColumnItem
              label="under assigned maintenance plan"
              icon={<EngineeringRounded />}
              color="primary"
              dataLabel={totalItemsUnderMaintenancePlans}
              loading={false}
            />
          </CardItem>
          <CardItem>
            <ColumnItem
              label="require attention"
              icon={<WarningRounded />}
              color="error"
              dataLabel={totalPastDueItems}
              loading={false}
            />
          </CardItem>
        </Stack>
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" spacing="2rem" useFlexGap flexWrap="wrap">
              <Stack spacing="2rem">
                <Typography variant="h5">Cost Summary</Typography>
                <RowItem label="Total estimated cost" color="text.secondary" dataValue={prefix('$', totalAssetCosts)} />
                <RowItem label="Unestimated" color="text.secondary" dataValue={`${zeroCostItems.length || 0} items`} />
              </Stack>
              <Stack>
                <Typography variant="h5" gutterBottom>
                  Asset Breakdown
                </Typography>
                <Stack direction="row" spacing="2rem" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                  <Stack spacing="2rem" justifyContent="space-evenly">
                    <RowItem label="Categories" color="text.secondary" dataValue={categories.length || 0} />
                    <RowItem label="Plans" color="text.secondary" dataValue={maintenancePlans.length || 0} />
                    <RowItem label="Assets" color="text.secondary" dataValue={assets.length || 0} />
                  </Stack>
                  <Stack direction="row" spacing="2rem">
                    <PieChart
                      height="15rem"
                      legendLabel="assets summary"
                      data={[categories, maintenancePlans, assets].map((v, index) => ({
                        label: ['Categories', 'Plans', 'Assets'][index],
                        count: v.length,
                        color: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(211, 211, 211)'][index],
                      }))}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};

const CardItem = ({ children }) => (
  <Card sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
    <CardContent>{children}</CardContent>
  </Card>
);

const RowItem = ({ label, color, dataValue }) => {
  return (
    <Stack direction="row" justifyContent="space-between" spacing="2rem">
      <Typography color={color}>{label}</Typography>
      <Typography color={color}>{dataValue}</Typography>
    </Stack>
  );
};

const ColumnItem = ({ label, dataLabel, icon, color, loading }) => {
  if (loading) return <Skeleton height="1rem" />;
  return (
    <Stack>
      <Typography textAlign="center" variant="h4" color={color}>
        {dataLabel}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <IconButton disabled size="small">
          {icon}
        </IconButton>
        <Typography variant="caption" textAlign="center">
          item(s)
        </Typography>
      </Stack>
      <Typography>{label}</Typography>
    </Stack>
  );
};

export default Overview;
