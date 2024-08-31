import { Button, Card, CardActions, CardContent, IconButton, Stack, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ShareRounded } from '@mui/icons-material';

dayjs.extend(relativeTime);

export default function ItemCard({ selectedItem }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="flex-start">
          <IconButton size="small">
            <FavoriteIcon fontSize="small" sx={{ color: selectedItem.color }} />
          </IconButton>
          <Typography gutterBottom variant="h5" component="div">
            {selectedItem.name}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {selectedItem.description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}
      >
        <Typography variant="caption">Last updated {dayjs(selectedItem?.updated_at).fromNow()}</Typography>
        <Stack direction="row" alignItems="center">
          <Button size="small" endIcon={<ShareRounded />}>
            Share
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}