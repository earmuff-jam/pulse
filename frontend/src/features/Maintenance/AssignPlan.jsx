import { Alert, Box, Card, CardContent, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useAssignItemsToPlan, useFetchPlans } from '../../features/plan';
import { WarningOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { EmptyComponent } from '../../utils/utils';

const AssignPlan = ({ rowSelected, handleCloseAssignFn }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useFetchPlans();
  const assignItemsToPlan = useAssignItemsToPlan();

  if (isLoading) return <Skeleton height="10rem" />;
  if (data.length <= 0) return <EmptyComponent subtitle="Add maintenance plan to begin" />;

  const handleAssignMaintenancePlan = (planID, planName, rowSelected) => {
    assignItemsToPlan.mutate({ planID, planName, selectedIDs: rowSelected });
    handleCloseAssignFn();
  };

  const existsInAnotherPlan = data.reduce((acc, el) => {
    const itemsWithinSelectedPlan = el.maintenanceItems;
    const itemExists = itemsWithinSelectedPlan.some((item) => rowSelected.includes(item.item_id));
    if (itemExists) {
      acc = true;
    }
    return acc;
  }, false);

  return (
    <Box>
      {existsInAnotherPlan ? (
        <Alert severity="warning" icon={<WarningOutlined fontSize="inherit" color="warning" />} sx={{ mb: 1 }}>
          One or more selected item(s) belongs to an existing maintenance plan. Adding to another maintenance plan will
          not reassign selected item. Manage individual items from{' '}
          <Typography
            variant="subtitle"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/inventories/maintenance/list')}
          >
            maintenance plan section
          </Typography>
        </Alert>
      ) : null}
      <Stack direction="row" spacing={2}>
        {data.map((v) => (
          <Card
            key={v.id}
            onClick={() => handleAssignMaintenancePlan(v.id, v.plan, rowSelected)}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              ':hover': {
                cursor: 'pointer',
                bgcolor: 'secondary.light',
              },
            }}
          >
            <CardContent>
              <Stack direction="row">
                <Stack>
                  <Tooltip title={v.description}>
                    <Typography>{v.plan}</Typography>
                  </Tooltip>
                  <Typography variant="caption" color="text.secondary">
                    Created around {dayjs(v?.created_on).fromNow()} by {v.creator_name || 'Anonymous'}
                  </Typography>
                  {v.updated_on === null ? (
                    <Typography variant="caption" color="text.secondary">
                      Never updated
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Last updated around {dayjs(v?.updated_on).fromNow()}
                    </Typography>
                  )}
                </Stack>
                <Typography></Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default AssignPlan;
