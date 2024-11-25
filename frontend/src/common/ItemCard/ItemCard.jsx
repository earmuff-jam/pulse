import { AlarmAddRounded, DeleteRounded, EditNoteRounded } from '@mui/icons-material';
import { Box, Card, CardActions, CardContent, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { STATUS_OPTIONS } from '../../features/Notes/constants';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function ItemCard({ data, handleEdit, handleDelete, prefixURI }) {
  const navigate = useNavigate();

  const displayTooltip = (item, prefixURI) => {
    const displayName = prefixURI === 'plan' ? item.maintenance_status_name : item.status_name;
    const displayTitle = STATUS_OPTIONS.find((v) => v.label.toLowerCase() === displayName);
    return (
      <Tooltip title={displayTitle?.display}>
        <Stack direction="row" spacing="0.2rem" alignItems="center" alignSelf="flex-end">
          <Typography variant="caption" alignSelf="flex-end">
            Status:
          </Typography>
          {displayTitle?.icon}
        </Stack>
      </Tooltip>
    );
  };

  return (
    <Box sx={{ overflow: 'auto', paddingBottom: '1rem' }}>
      <Stack spacing={{ xs: 1 }} direction="row" useFlexGap flexWrap="wrap">
        {data?.map((item, index) => (
          <Stack key={index} flexGrow={1}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent>
                <Stack direction="row">
                  <Stack flexGrow={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Stack width={'20rem'}>
                        <Typography
                          variant="h6"
                          component="h3"
                          onClick={() => navigate(encodeURI(`/${prefixURI}/${item.id}`))}
                          sx={{ cursor: 'pointer' }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%',
                          }}
                          noWrap
                        >
                          {item.description}
                        </Typography>
                      </Stack>
                      <Stack direction="row">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(item.id)}
                          disableRipple
                          disableFocusRipple
                          disableTouchRipple
                        >
                          <DeleteRounded fontSize="small" sx={{ color: 'error.main' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(item.id)}
                          disableRipple
                          disableFocusRipple
                          disableTouchRipple
                        >
                          <EditNoteRounded fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Stack direction="row" alignItems="center" useFlexGap spacing={1}>
                      <AlarmAddRounded fontSize="small" sx={{ color: item.color ? `${item.color}` : 'primary.main' }} />
                      <Typography variant="caption">{item?.max_items_limit} items limit </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between' }}>
                {item.updated_at === null ? (
                  <Typography variant="caption" color="text.secondary">
                    Never updated
                  </Typography>
                ) : (
                  <Tooltip title={`Last updated around ${dayjs(item?.updated_at).fromNow()}`}>
                    <Typography variant="caption" color="text.secondary">
                      By {item.updator || 'anonymous'} {dayjs(item.updated_at).fromNow()}
                    </Typography>
                  </Tooltip>
                )}
                {displayTooltip(item, prefixURI)}
              </CardActions>
            </Card>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
