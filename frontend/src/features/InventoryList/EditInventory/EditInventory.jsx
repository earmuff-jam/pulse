import { Box, Button, Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddPhotoAlternateRounded, CheckRounded } from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BLANK_INVENTORY_FORM } from '../constants';
import RowHeader from '../../../common/RowHeader';
import { useDispatch, useSelector } from 'react-redux';
import { inventoryActions } from '../inventorySlice';
import { enqueueSnackbar } from 'notistack';
import ImagePicker from '../../../common/ImagePicker/ImagePicker';
import SimpleModal from '../../../common/SimpleModal';
import EditInventoryFormFields from './EditInventoryFormFields';
import EditInventoryMoreInformation from './EditInventoryMoreInformation';
import EditInventoryWeightDimension from './EditInventoryWeightDimension';

dayjs.extend(relativeTime);

const EditInventory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading: storageLocationsLoading,
    storageLocations,
    inventory,
    loading,
  } = useSelector((state) => state.inventory);

  const [editImgMode, setEditImgMode] = useState(false);
  const [openReturnNote, setOpenReturnNotes] = useState(false);
  const [returnDateTime, setReturnDateTime] = useState(null);
  const [storageLocation, setStorageLocation] = useState({});
  const [formData, setFormData] = useState({ ...BLANK_INVENTORY_FORM });

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const updatedFormData = { ...formData };
    let errorMsg = '';

    for (const validator of updatedFormData[id].validators) {
      if (validator.validate(value)) {
        errorMsg = validator.message;
        break;
      }
    }

    updatedFormData[id] = {
      ...updatedFormData[id],
      value,
      errorMsg,
    };
    setFormData(updatedFormData);
  };

  const handleCheckbox = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: { ...prevFormData[name], value },
    }));
  };

  const isFormDisabled = () => {
    const containsErr = Object.values(formData).reduce((acc, el) => {
      if (el?.errorMsg) {
        return true;
      }
      return acc;
    }, false);

    const requiredFormFields = Object.values(formData).filter((v) => v?.isRequired);
    const isRequiredFieldsEmpty = requiredFormFields
      .filter((el) => el.type === 'text')
      .some((el) => el.value.trim() === '');

    return containsErr || isRequiredFieldsEmpty || storageLocation === null || Object.keys(storageLocation).length <= 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isFormDisabled()) {
      enqueueSnackbar('Unable to update inventory details.', {
        variant: 'error',
      });
      return;
    }

    const formattedData = Object.values(formData).reduce((acc, el) => {
      if (el.value) {
        acc[el.id] = el.value;
      }
      return acc;
    }, {});

    const draftRequest = {
      id: id, // bring id from the params
      ...formattedData,
      return_datetime: returnDateTime !== null ? returnDateTime.toISOString() : null,
      location: storageLocation.location,
    };
    dispatch(inventoryActions.updateInventory(draftRequest));
    navigate('/inventories/list');
  };

  const handleUpload = (id, imgFormData) => {
    console.debug(id, imgFormData);
  };

  useEffect(() => {
    if (id.length > 0) {
      dispatch(inventoryActions.getInvByID(id));
    }
  }, [id]);

  useEffect(() => {
    if (!loading || !storageLocationsLoading) {
      const selectedAsset = { ...BLANK_INVENTORY_FORM };
      selectedAsset.name.value = inventory.name || '';
      selectedAsset.description.value = inventory.description || '';
      selectedAsset.barcode.value = inventory.barcode || '';
      selectedAsset.sku.value = inventory.sku || '';
      selectedAsset.bought_at.value = inventory.bought_at || '';
      selectedAsset.return_location.value = inventory.return_location || '';
      selectedAsset.max_weight.value = inventory.max_weight || '';
      selectedAsset.min_weight.value = inventory.min_weight || '';
      selectedAsset.max_height.value = inventory.max_height || '';
      selectedAsset.min_height.value = inventory.min_height || '';
      selectedAsset.price.value = inventory.price || '';
      selectedAsset.quantity.value = inventory.quantity || '';
      selectedAsset.is_bookmarked.value = inventory.is_bookmarked || false;
      selectedAsset.is_returnable.value = inventory.is_returnable || Boolean(inventory.return_location) || false;
      selectedAsset.created_by.value = inventory.created_by || '';
      selectedAsset.created_at.value = inventory.created_at || '';
      selectedAsset.updated_by.value = inventory.updated_by || '';
      selectedAsset.updated_at.value = inventory.updated_at || '';
      selectedAsset.sharable_groups.value = inventory.sharable_groups || [];
      selectedAsset.creator_name = inventory.creator_name;
      selectedAsset.updator_name = inventory.updater_name;

      if (inventory?.return_datetime) {
        setReturnDateTime(dayjs(inventory.return_datetime));
      }

      if (inventory?.return_notes) {
        setOpenReturnNotes(true);
        selectedAsset.return_notes.value = inventory.return_notes;
      }

      setStorageLocation({ location: inventory.location });
      setFormData(selectedAsset);
    }
  }, [loading, inventory]);

  return (
    <>
      <RowHeader
        title="Editing inventory"
        caption={`Editing ${formData.name.value}`}
        primaryStartIcon={<AddPhotoAlternateRounded />}
        primaryButtonTextLabel={'Add Image'}
        handleClickPrimaryButton={() => setEditImgMode(!editImgMode)}
      />
      <EditInventoryFormFields
        formData={formData}
        handleInputChange={handleInputChange}
        options={storageLocations}
        storageLocation={storageLocation}
        setStorageLocation={setStorageLocation}
      />
      <Divider>
        <Typography variant="caption">More information</Typography>
      </Divider>
      <EditInventoryMoreInformation
        formData={formData}
        returnDateTime={returnDateTime}
        setReturnDateTime={setReturnDateTime}
        openReturnNote={openReturnNote}
        setOpenReturnNotes={setOpenReturnNotes}
        handleCheckbox={handleCheckbox}
        handleInputChange={handleInputChange}
      />
      <Divider>
        <Typography variant="caption">Weight and Dimension</Typography>
      </Divider>
      <EditInventoryWeightDimension formData={formData} handleInputChange={handleInputChange} />
      {editImgMode && (
        <SimpleModal
          title="Assign image"
          subtitle="Assign image to the selected item."
          handleClose={() => setEditImgMode(false)}
          maxSize="sm"
        >
          <ImagePicker id={id} name={formData.name.value} handleUpload={handleUpload} disableCancel />
        </SimpleModal>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button startIcon={<CheckRounded fontSize="small" />} onClick={handleSubmit} disabled={isFormDisabled()}>
          Submit
        </Button>
      </Box>
    </>
  );
};

export default EditInventory;
