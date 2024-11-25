import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { EmptyComponent } from '../../utils/utils';
import { useEffect, useState } from 'react';
import SimpleModal from '@common/SimpleModal/SimpleModal';
import ImagePicker from '../../common/ImagePicker/ImagePicker';
import { useDispatch, useSelector } from 'react-redux';
import { inventoryActions } from './inventorySlice';

const GridComponent = ({ isLoading, data, rowSelected, handleRowSelection }) => {
  const dispatch = useDispatch();
  const { inventories } = useSelector((state) => state.inventory);

  const [displayModal, setDisplayModal] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState(-1);
  const handleCloseModal = () => setDisplayModal(false);

  const handleUpload = (id, imgFormData) => {
    dispatch(inventoryActions.createInventoryImage({ assetID: id, imageData: imgFormData }));
    handleCloseModal();
  };

  useEffect(() => {
    if (Array.isArray(data)) {
      data.forEach((element) => {
        if (element.associated_image_url.length > 0) {
          dispatch(
            inventoryActions.retrieveSelectedImage({
              assetID: element.id,
              filename: `${element.associated_image_url}.png`,
            })
          );
        }
      });
    }
  }, [data]);

  if (isLoading) return <Skeleton height="10vh" />;
  if (data.length <= 0) return <EmptyComponent />;

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Stack spacing={{ xs: 1 }} marginBottom="1rem" direction="row" useFlexGap flexWrap="wrap">
        {inventories.map((row, index) => {
          const isSelected = (id) => rowSelected.indexOf(id) !== -1;
          const selectedID = row.id;
          const isItemSelected = isSelected(selectedID);
          return (
            <Stack key={index} flexGrow={1} height="14rem" width="20rem">
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Tooltip title={row.description}>
                  <CardMedia
                    sx={{ height: '10rem' }}
                    image={row.selectedImage ? row.selectedImage : '/blank_canvas.png'}
                    onClick={() => {
                      setDisplayModal(true);
                      setSelectedItemID(selectedID);
                    }}
                  />
                </Tooltip>
                <CardContent>
                  <Typography variant="caption">{row.name}</Typography>
                </CardContent>
                <CardActions>
                  <Stack flexGrow={1}>
                    <Typography variant="caption">{row.quantity} items</Typography>
                    <Typography variant="caption">Edited around {dayjs(row.updated_at).fromNow()}</Typography>
                  </Stack>
                  <Checkbox
                    checked={isItemSelected}
                    color="primary"
                    size="small"
                    onClick={(event) => handleRowSelection(event, selectedID)}
                    inputProps={{ 'aria-labelledby': 'labelId' }}
                  />
                </CardActions>
              </Card>
            </Stack>
          );
        })}
        {displayModal && (
          <SimpleModal title={'Edit image'} handleClose={handleCloseModal} maxSize="sm">
            <ImagePicker
              selectedData={inventories.filter((v) => v.id === selectedItemID).find(() => true)}
              handleUpload={handleUpload}
            />
          </SimpleModal>
        )}
      </Stack>
    </Box>
  );
};

export default GridComponent;
