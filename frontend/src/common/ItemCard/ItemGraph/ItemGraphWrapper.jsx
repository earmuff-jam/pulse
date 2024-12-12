import ItemGraph from '@common/ItemCard/ItemGraph/ItemGraph';
import { Paper } from '@mui/material';

export default function ItemGraphWrapper({ associatedAssets = [] }) {
  return (
    <Paper elevation={1} sx={{ padding: '1rem' }}>
      <ItemGraph associatedAssets={associatedAssets} />
    </Paper>
  );
}
